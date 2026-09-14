## Why

The frontend currently mixes a custom `views` layer, single-page widgets, prematurely extracted features, and a nested `projects`/`homelab` boundary that permits private and same-layer dependencies. Migrating incrementally to Feature-Sliced Design v2.1 will make route ownership and dependency direction explicit without changing the site's behavior or requiring a risky rewrite.

## What Changes

- Introduce the Next.js-compatible FSD `_pages` and `_app` layers, keeping root `app/` files as thin framework adapters.
- Migrate one route at a time, beginning with stable shared boundaries and then moving home and homelab responsibilities into page slices.
- Resolve the ambiguous nested `projects`/`homelab` widget structure through page-level composition rather than same-layer cross-imports.
- Move the homelab status transport contract and parsing to shared API infrastructure so server and client code no longer depend on widget internals.
- Re-evaluate single-consumer widgets and features using the FSD v2.1 extraction rule, retaining only boundaries with demonstrated reuse and independent responsibility.
- Standardize slice and Shared public APIs and remove deep imports across established boundaries.
- Add automated FSD architecture validation after the structure is migrated sufficiently for useful enforcement.
- Preserve rendered content, routes, metadata, interactions, API responses, accessibility behavior, and responsive presentation throughout the migration.

## Capabilities

### New Capabilities

None. This change is an internal architecture refactor and introduces no user-visible capability.

### Modified Capabilities

None. Existing behavior and external contracts remain unchanged, so this change opts out of delta specs.

## Impact

- Affected areas: root Next.js route adapters, `src/views`, `src/widgets`, selected `src/features`, Shared APIs, path imports, architecture documentation, and build validation.
- Public URLs and API response shapes remain unchanged, including `/`, `/homelab`, and `/api/homelab/status/`.
- Existing tests will move with their owning modules and continue to assert the same behavior.
- The migration may add Steiger as a development dependency and validation script; no runtime dependency is required.
