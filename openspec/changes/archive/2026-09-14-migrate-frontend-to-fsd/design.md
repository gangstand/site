## Context

See `proposal.md` for motivation. The application uses Next.js 16 App Router with framework routes in root `app/` and application code under `src/`. The current frontend has one custom page-like slice (`src/views/home`), three widgets used only by that route, four small features, and a `projects` widget that also contains the separately routed homelab experience. The homelab status route imports a private widget model, and several consumers bypass existing Shared entry points.

The migration must preserve `/`, `/homelab`, `/api/homelab/status/`, metadata, localized content, theme and language persistence, dialogs, clipboard behavior, homelab polling, canvas interaction, accessibility behavior, and responsive styling. The worktree is already under active development, so relocation must be staged and must not combine unrelated behavior refactoring with architectural movement.

## Goals / Non-Goals

**Goals:**

- Establish the Next.js-compatible FSD shape with framework routes in root `app/` and application layers in `src/_app`, `src/_pages`, `src/features`, and `src/shared`.
- Give each route an explicit page slice that owns route-specific composition, UI, state, and project data.
- Preserve one focused reusable homelab interaction for the home dialog and standalone homelab page without page-to-page or widget-to-widget imports.
- Ensure server adapters, page slices, features, and Shared modules depend only on permitted lower layers and public APIs.
- Keep each migration phase behaviorally complete, testable, and independently reversible.
- Avoid adding an entities layer until a reused business-domain responsibility satisfies the FSD extraction rule.

**Non-Goals:**

- Redesigning the UI, changing copy, routes, response schemas, polling intervals, caching, or interaction behavior.
- Rewriting components, state hooks, canvas geometry, or tests merely to adopt different coding patterns.
- Creating speculative entities, widgets, or features.
- Removing the root Next.js `app/` directory; it remains the framework routing boundary and is not the FSD App layer.
- Converting backend functionality beyond the minimum needed to remove its dependency on frontend widget internals.

## Decisions

### 1. Use `_app` and `_pages` for FSD layers

The target top-level shape is:

```text
app/                         # Next.js route adapters and framework exports
src/
  _app/                      # FSD App initialization and route-handler implementations
  _pages/
    home/
    homelab/
  features/
    copy-email/
    explore-homelab/
  shared/
```

The underscore names follow the FSD Next.js integration guidance and avoid confusing the root Next.js `app/` directory with the FSD App layer. Root route files will import or re-export page public APIs and retain only framework-required exports such as metadata.

Alternative considered: rename `views` to `pages` and omit `_app`. This is smaller, but it conflicts with the current Next.js FSD convention, leaves app-wide route-handler implementation without a clear application boundary, and makes future linting less accurate.

### 2. Migrate route ownership before removing legacy layers

Create `_pages/home` and `_pages/homelab` first, then redirect root routes to their public APIs. During migration, a page may temporarily compose legacy widgets through their public APIs. Once a route has an FSD page owner, move its single-use code into that page in small relocations.

This produces a valid hybrid transition: completed routes use `_pages`, while unmigrated modules remain in their existing locations. Temporary dependencies are removed phase by phase rather than hidden behind compatibility barrels.

Alternative considered: move every directory into its final location at once. That creates a large, difficult-to-review diff and makes behavioral regressions harder to isolate.

### 3. Keep home-only composition in `_pages/home`

Move the current home view, profile, footer, project gallery, project definitions, theme toggle, language toggle, and contact dialog into segments of the home page slice. They currently serve one route and therefore do not earn independent widget or feature boundaries under FSD v2.1.

Keep `copy-email` as a feature. It has two current consumers, a focused clipboard interaction, browser fallback behavior, and an independent reason to change. The home page composes it in both profile and footer locations through the feature public API.

Alternative considered: retain all current widgets and features. Existing widgets are legal but discouraged; retaining single-consumer slices would preserve the current fragmentation and leave route ownership too thin.

### 4. Extract one focused `explore-homelab` feature

The interactive homelab canvas is used both inside the home project dialog and by the standalone `/homelab` page. Move its UI, topology model, layout and routing calculations, selection state, and status-fetching hook into `features/explore-homelab` with one public API. Both page slices compose that feature independently.

Project catalog metadata remains owned by `_pages/home`; the feature must not import the home project model. This removes the current parent/child cycle between `widgets/projects` and `widgets/projects/homelab`.

Alternative considered: duplicate the canvas into both pages. FSD permits duplication, but this implementation has substantial deterministic geometry, tests, status behavior, and interaction logic that must remain synchronized. It meets all three extraction criteria.

Alternative considered: create a homelab entity. The module represents an interactive experience and its presentation model, not a stable business entity reused by several workflows.

### 5. Put the shared homelab transport contract in Shared API

Create a focused `shared/api/homelab-status` boundary containing site/status transport types and response parsing. The client feature and the server probe both depend on that public contract. Put probing, cache state, target URLs, and the `GET` implementation in `_app/api-routes/homelab-status`; keep root `app/api/homelab/status/route.ts` as the Next.js adapter.

This direction is valid for both dependency graphs:

```text
app/api route --> _app/api-routes --> shared/api/homelab-status
_pages/*      --> features/explore-homelab --> shared/api/homelab-status
```

Alternative considered: export status types from the homelab feature. `_app` importing a feature would be directionally legal, but the server contract would remain owned by an interactive UI boundary and server/client entry points would become easier to mix accidentally.

### 6. Enforce public APIs at established boundaries

External consumers import page and feature slices only through `index.ts`. Shared will expose folder-level APIs for cohesive modules such as language, theme, infinite canvas, homelab status, close button, contact icon, and technology logo. Imports reaching into `model/`, `ui/`, `theme-context`, or `locale` from outside the owning boundary will be removed.

Internal relative imports within one page or feature slice remain allowed. No transitional re-export will be retained after all consumers move unless an external consumer is discovered during implementation.

Alternative considered: one broad `shared/index.ts`. FSD Shared has no slices, and a top-level barrel obscures intent and can pull unrelated client/server modules into the same graph.

### 7. Preserve providers as Shared mechanisms composed by `_app`

Theme and language state mechanisms remain in Shared because they are application infrastructure without business rules. `_app/providers` composes them, while the root layout handles Next.js-specific metadata and cookie access or delegates framework-neutral preference interpretation to `_app` where useful. The migration will not force a provider rewrite.

### 8. Add architecture checks after boundaries stabilize

Add Steiger as a development-only check after `_pages` exists and the ambiguous widget structure is gone. Configure the check for the actual layers present and include it in the documented verification commands. Do not create an entities or widgets directory merely to satisfy a canonical diagram.

Architecture validation supplements, rather than replaces, existing TypeScript, unit, build, and browser-level behavior checks.

## Risks / Trade-offs

- [Large path-only diffs obscure behavioral changes] -> Separate relocation from behavior refactoring and run focused tests after every migration phase.
- [Temporary hybrid architecture allows legacy imports] -> Define an explicit phase exit condition and do not add compatibility barrels that outlive the phase.
- [Moving client modules changes Next.js client/server boundaries] -> Preserve existing `"use client"` directives and validate with both type checking and a production build.
- [A Shared barrel accidentally exposes server-only code to clients] -> Use focused folder APIs and keep probe/cache implementation in `_app`; add an environment-specific entry point only if a real runtime boundary requires it.
- [Inlining widgets makes the home page slice physically large] -> Accept a large page slice when it has one route responsibility; retain cohesive `ui`, `model`, and `config` files rather than extracting speculative lower-layer slices.
- [Homelab extraction becomes another god feature] -> Limit it to the reusable interactive canvas experience; keep project catalog data, route metadata, and page layout in their page owners.
- [Visual or accessibility regressions are not caught by unit tests] -> Preserve markup and styles during moves, then perform browser checks for both routes, themes, languages, responsive widths, keyboard controls, dialogs, and status states.
- [Steiger flags intentional Shared folder organization] -> Resolve genuine boundary violations first and document narrowly scoped configuration rather than disabling broad rule classes.

## Migration Plan

1. Capture a behavior baseline with existing tests, type checking, production build, and focused browser checks for `/`, `/homelab`, and the homelab status endpoint.
2. Introduce the Shared homelab status contract and `_app/api-routes` implementation; switch server and client imports without changing the endpoint contract.
3. Introduce `_pages/home` and `_pages/homelab` public APIs and redirect root route adapters to them while they still compose existing lower modules.
4. Extract `features/explore-homelab`, move its tests with it, and update both page consumers. Remove the nested homelab widget boundary once no consumers remain.
5. Move home-only profile, footer, project gallery/model/config, theme toggle, language toggle, and contact dialog into `_pages/home`. Keep `copy-email` as the focused reusable feature.
6. Remove the obsolete `views` and `widgets` directories when empty, then normalize Shared folder APIs and all external imports.
7. Add Steiger validation and update architecture documentation to describe the final layer map and import rules.
8. Run the full verification matrix and compare visible behavior with the baseline.

Each numbered phase should be independently reviewable and leave the application runnable. Rollback consists of reverting only the current phase; no persisted data migration or external contract rollback is required.
