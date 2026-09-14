## 1. Establish Behavior Baseline

- [x] 1.1 Run `npm test`, `npm run typecheck`, and `npm run build`, record any pre-existing failures, and verify the migration starts from a known automated-test baseline. (2026-09-14: all passed; no pre-existing failures.)
- [x] 1.2 Exercise `/` and `/homelab` at desktop and mobile widths in both themes and languages, including project dialogs, contact dialog, email copying, homelab keyboard/canvas controls, and status indicators; verify current behavior is documented well enough for post-move comparison. (2026-09-14: automated-only baseline accepted by user.)
- [x] 1.3 Exercise `/api/homelab/status/` and its route tests, and verify the response keys, status values, cache behavior, and failure behavior that must remain unchanged. (2026-09-14: focused route test passed; contract recorded before relocation.)

## 2. Decouple Homelab Status Infrastructure

- [x] 2.1 Create the focused `src/shared/api/homelab-status` public boundary for status identifiers, transport types, and response parsing; move the existing parser tests and verify they pass from the new location.
- [x] 2.2 Move the probe targets, timeout, in-memory cache, and GET implementation into `src/_app/api-routes/homelab-status`, update the root route to delegate through its public API, and verify the route tests and response contract remain unchanged.
- [x] 2.3 Update the homelab client status hook to consume `shared/api/homelab-status` through its public API, remove the private widget-model dependency from server code, and verify `npm run typecheck` plus a focused search finds no `app/` import from `widgets/projects/homelab/model`.

## 3. Establish Route-Owned Pages

- [x] 3.1 Create `src/_pages/home` with a public API, move the existing home page component without changing markup or styles, update `app/page.tsx` to consume that API, and verify `/` matches the baseline.
- [x] 3.2 Create `src/_pages/homelab` with a public API for its route layout and metadata-compatible component boundary, update `app/homelab/page.tsx` to use it, and verify `/homelab` matches the baseline.
- [x] 3.3 Add `src/_app/providers` to compose the existing theme and language providers without rewriting their state mechanisms, update the root layout adapter, and verify initial cookie-derived theme/language state and metadata remain unchanged.

## 4. Extract The Reusable Homelab Feature

- [x] 4.1 Move homelab topology declarations, layout and connection routing, view state, selection state, and their tests into `src/features/explore-homelab/model`; preserve domain-based file names and verify all moved unit and snapshot tests pass unchanged.
- [x] 4.2 Move homelab canvas UI, status polling, status presentation, and styles into `src/features/explore-homelab`, preserve `"use client"` boundaries, expose only the reusable canvas from its `index.ts`, and verify type checking succeeds without deep external imports.
- [x] 4.3 Update `_pages/home` and `_pages/homelab` to compose `explore-homelab` through its public API, remove the feature's dependency on the home project model, and verify both embedded and full-page canvases match the baseline.
- [x] 4.4 Delete the obsolete `src/widgets/projects/homelab` boundary after all consumers and tests have moved, and verify a repository search finds no imports from its former path.

## 5. Consolidate Home-Only Responsibilities

- [x] 5.1 Move project catalog definitions, localization mapping, gallery state, photo detail UI, and project dialog UI into appropriate `config`, `model`, and `ui` segments under `_pages/home`; update local imports and verify project model tests and every project dialog variant pass.
- [x] 5.2 Move the profile and footer widgets into `_pages/home/ui` without changing their DOM, assets, responsive classes, or composition, and verify desktop/mobile home layouts match the baseline.
- [x] 5.3 Move theme toggle, language toggle, and contact dialog into `_pages/home/ui`, retain `features/copy-email` as the page's focused reused interaction, and verify toggling, persistence, keyboard shortcut, dialog focus restoration, and clipboard states match the baseline.
- [x] 5.4 Remove empty `src/views`, `src/widgets`, and migrated feature directories, update all consumers, and verify searches find no imports through `@/views` or `@/widgets` and no obsolete empty layer directories remain.

## 6. Normalize Public APIs

- [x] 6.1 Replace external imports of `shared/lib/language/locale` and `shared/lib/theme/theme-context` with their established folder public APIs, and verify a repository search finds no remaining boundary bypasses.
- [x] 6.2 Give infinite canvas, close button, contact icon, and technology logo focused Shared UI entry points, update consumers to use them, and verify no external import reaches through a Shared UI boundary into `model/` or `ui/`.
- [x] 6.3 Remove temporary migration re-exports that have no external consumers, check the final dependency direction `_app -> _pages -> features -> shared`, and verify there are no same-layer cross-imports or imports from lower layers to higher layers.

## 7. Add Architecture Guardrails

- [x] 7.1 Add Steiger as a development dependency with a project script scoped to `src`, configure only narrowly necessary exceptions, and verify the architecture command passes without broad rule suppression.
- [x] 7.2 Update project architecture documentation with the root Next.js adapter distinction, current FSD layers, extraction rule, public API rule, and import direction, and verify the documented commands and paths match the repository.
- [x] 7.3 Run `graphify update .` after source relocation and verify the knowledge graph reflects `_app`, `_pages`, `features/explore-homelab`, and the absence of legacy `views`/`widgets` nodes.

## 8. Final Regression Verification

- [x] 8.1 Run the final architecture check, `npm test`, `npm run typecheck`, and `npm run build`, and verify all checks pass or only explicitly recorded baseline failures remain.
- [x] 8.2 Repeat the browser matrix for `/` and `/homelab` across desktop/mobile, theme/language, keyboard, dialog, clipboard, canvas, polling, and failure states, and verify behavior and accessibility match the baseline. (2026-09-14: automated-only verification accepted by user.)
- [x] 8.3 Re-run `/api/homelab/status/` integration checks and verify its URL, payload shape, caching, timeout, and error behavior remain unchanged after the server boundary move.
