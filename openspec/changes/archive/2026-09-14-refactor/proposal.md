## Why

Project and Homelab concerns are coupled through duplicated identity, mixed server/client configuration, executable UI embedded in data models, and shared primitives that depend on application state. These boundaries make routine topology, status, project, and localization changes require synchronized edits across unrelated modules and provide little compile-time protection against drift.

## What Changes

- Establish one typed Homelab topology as the source of entity identity, containment, display metadata, connection endpoints, and status association.
- Separate Homelab topology, scene geometry, route hints, pure routing, and rendered connection projections.
- Split Homelab status responsibilities into server probe policy, shared API contract, client polling policy, feature association, and localized presentation.
- Make project definitions serializable, discriminated data and move concrete renderer selection into the projects composition layer.
- Standardize individual project module entry points and stop central model modules from importing feature implementations.
- Centralize the locale contract while moving feature copy to its owner and making shared UI primitives accept labels explicitly.
- Clarify the infinite-canvas composition boundary for shell, toolbar, fullscreen, controls, and interaction state.
- Add characterization and invariant tests around topology integrity, routing, status parsing, project variants, and current user-visible behavior.
- Preserve existing routes, API response shape, visual content, interactions, and persisted language/theme preferences.

## Capabilities

### New Capabilities

None. This change reorganizes implementation without introducing user-visible behavior.

### Modified Capabilities

None. Existing behavior and external contracts remain unchanged.

## Impact

The change primarily affects `src/widgets/projects`, `src/widgets/projects/homelab`, `src/shared/config/homelab-status.ts`, `src/shared/lib/language`, `src/shared/ui/infinite-canvas`, `app/layout.tsx`, and `app/api/homelab/status/route.ts`. Internal imports and types will change substantially, but public routes, browser persistence, and the Homelab status endpoint remain compatible. No new runtime dependency is expected; test tooling may be added if the repository still lacks a test runner when implementation begins.
