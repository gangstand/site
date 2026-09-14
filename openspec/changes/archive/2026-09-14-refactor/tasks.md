## 1. Refactoring Safety Net

- [x] 1.1 Add a minimal TypeScript-compatible test runner and package scripts, and verify a smoke test, `npm run typecheck`, and the existing production build all succeed.
- [x] 1.2 Add project-registry characterization tests covering order, localized names/descriptions, thumbnail conventions, detail kind, and current external-action behavior, and verify the new tests pass against the unrefactored implementation.
- [x] 1.3 Add Homelab topology invariant tests for unique IDs, current entity/zone membership, resolvable connection endpoints including synthetic entities, and status associations, and verify the tests capture the current scene.
- [x] 1.4 Add routing characterization tests for every current connection path and scene bounds, and verify snapshots or explicit point assertions pass before routing code moves.
- [x] 1.5 Add status parser and selection-state characterization tests covering current complete-response validation, state values, polling-independent parsing, and node/connection transition behavior, and verify all cases pass.

## 2. Locale And Copy Boundaries

- [x] 2.1 Introduce a server-safe locale contract for supported languages, default language, cookie key, parsing, and language transitions; migrate `app/layout.tsx` and `LanguageProvider`, and verify cookie values, initial `<html lang>`, and language toggling remain unchanged.
- [x] 2.2 Move project and Homelab copy into typed owner-local catalogs without editing string values, and verify type checking plus existing localization characterization tests pass.
- [x] 2.3 Replace `CanvasViewport`'s language-context dependency with a complete labels input resolved by its callers or wrapper, and verify standalone canvas tests render without `LanguageProvider` while application labels remain unchanged.

## 3. Project Module Boundary

- [x] 3.1 Replace `ProjectDefinition`'s optional executable fields with serializable discriminated destination, thumbnail, and detail variants, migrate all project descriptors, and verify every descriptor satisfies the new type and the characterization tests pass.
- [x] 3.2 Move project registration and detail-renderer selection to the projects composition layer so model modules import no concrete project implementation, and verify import search plus type checking show the corrected dependency direction.
- [x] 3.3 Standardize each project directory's public `index.ts` exports and remove deep imports such as the Homelab project descriptor import, and verify all project consumers import through public entry points.
- [x] 3.4 Update list and detail rendering to consume a localized project view model and explicit detail renderer while preserving ordering, thumbnails, dialog content, and external actions; verify project component tests and the production build pass.

## 4. Canonical Homelab Topology

- [x] 4.1 Define the canonical Homelab entity and connection declarations with derived `NodeId` and `ConnectionId` types, explicit display kinds, parents, and status associations, and verify compile-time fixtures reject invalid endpoint and parent IDs.
- [x] 4.2 Derive card nodes, zones, VM counts, node lookups, and status lookups from the canonical declaration, then remove label comparisons, `-vm` rewriting, hard-coded counts, and duplicate metadata; verify topology invariants and rendered labels match the baseline.
- [x] 4.3 Key geometry exclusively by canonical `NodeId` and add clear validation for missing placement or duplicate identity, and verify every renderable entity has geometry without non-null assertions.
- [x] 4.4 Replace the two-value node/connection selection state with one discriminated selection and derived related-node state, and verify all selection transition tests and Escape/clear behavior pass.

## 5. Homelab Status Boundary

- [x] 5.1 Move probe URLs, timeout/cache policy, and in-flight request coordination into a server-only module near the API route, and verify the route still returns the same payload and cache headers under mocked probe results.
- [x] 5.2 Move the site ID, status DTO, and parser into a server/client-safe Homelab contract while preserving strict complete-response parsing, and verify parser characterization tests pass unchanged.
- [x] 5.3 Move polling cadence into the client status hook, entity-to-site association into canonical topology, and labels into Homelab presentation, and verify no shared module imports Homelab-private IDs and status indicators render the same text/state.

## 6. Scene And Routing Boundary

- [x] 6.1 Separate logical connections from routed SVG connection data by adding a pure scene projection that accepts topology and geometry, and verify logical topology can be imported without evaluating route generation.
- [x] 6.2 Extract the generic orthogonal obstacle router into a pure module and represent current infrastructure-specific behavior as typed route hints, and verify every baseline route characterization passes.
- [x] 6.3 Derive canvas bounds and SVG extents from the same projected scene, including routed points, and verify all node and route extents satisfy containment invariants.
- [x] 6.4 Make `ConnectionsLayer` receive routed data and node lookup explicitly instead of importing global projections, and verify connection selection, labels, styles, and view filters remain unchanged.

## 7. Infinite Canvas Boundary

- [x] 7.1 Define one public composable canvas frame with explicit toolbar/overlay slots, controls, clear-selection behavior, and fullscreen ownership, and verify both the photo and Homelab canvases can use the public entry point.
- [x] 7.2 Replace Homelab's dependency on private canvas DOM attributes and parent-element fullscreen targeting with the typed interaction API, and verify panning animations, detail-view behavior, controls, and fullscreen still work.
- [x] 7.3 Remove overlapping or dead canvas contracts, including the unused `contentOnly` styling path if no consumer requires it, and verify package exports expose only the supported canvas API.

## 8. Integration And Cleanup

- [x] 8.1 Remove superseded topology, status, project, localization, and routing declarations plus temporary migration adapters, and verify content/import searches find no duplicate sources of truth or forbidden deep imports.
- [x] 8.2 Run the complete test suite, `npm run typecheck`, and `npm run build`, and verify all commands succeed without warnings introduced by the refactor.
- [x] 8.3 Manually verify desktop and mobile project dialogs, photo canvas, standalone and embedded Homelab routes, language/theme persistence, canvas keyboard controls, selection, filtering, polling, and fullscreen against the pre-refactor behavior.
- [x] 8.4 Run `graphify update .` and query the updated graph for project, Homelab, localization, status, and canvas coupling; verify the model-to-implementation inversion and shared-to-feature ID dependency are absent.
