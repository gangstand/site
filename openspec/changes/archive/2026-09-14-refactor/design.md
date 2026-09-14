## Context

See `proposal.md` for motivation. The project uses a feature-sliced directory structure, but several dependencies currently run against that intended direction: a model-layer project registry imports concrete project modules, shared status configuration knows Homelab-private node IDs, and shared canvas UI reads application-global localization state.

Homelab identity is distributed among `nodes.ts`, `layout.ts`, `homelab-status.ts`, and UI string conventions. Routing combines infrastructure policy and a generic obstacle-routing algorithm in one module. There are no import cycles today, but the architectural ownership cycles and non-null assertions make changes fragile.

The repository has no test runner or existing tests. The refactor must preserve public routes, the `/api/homelab/status` JSON shape, cookie names and values, current project ordering and navigation behavior, and the rendered Homelab scene and interactions.

## Goals / Non-Goals

**Goals:**

- Make entity identity and relationships compiler-checked and owned in one place.
- Restore dependency direction from composition toward models and leaf implementations.
- Separate server policy, shared contracts, client behavior, and presentation.
- Keep generic UI primitives independent of application-global providers.
- Introduce seams that allow pure model and routing behavior to be tested.
- Deliver the refactor incrementally with characterization checks at each boundary.

**Non-Goals:**

- Redesigning the portfolio or Homelab visualization.
- Changing localization behavior, adding locales, or correcting existing translated content.
- Changing status probe semantics, polling cadence, caching, or API payloads.
- Changing project destinations, thumbnails, ordering, or dialog content.
- Introducing a general-purpose graph, layout, routing, or internationalization framework.

## Decisions

### 1. Use a canonical, declarative Homelab topology

Create one Homelab-owned topology declaration containing every addressable entity, including logical/container entities such as `proxy` and `proxmox`. Stable entity IDs will derive a `NodeId` type, and connection endpoints, parent relationships, status associations, and layout records will be checked against it.

Each entity will explicitly describe its display kind and parent relationship. UI code will no longer infer VM identity from labels or reconstruct node IDs by stripping `-vm`. Derived selectors will produce card nodes, zones, counts, and lookups from the canonical declaration.

Geometry remains separate and keyed by `NodeId`; it must not repeat names, roles, logos, or status ownership. Runtime validation will provide clear errors for duplicate IDs, unresolved endpoints, and missing placement in addition to compile-time checks.

Alternative considered: retain separate node and zone declarations with stronger string types. This reduces immediate edits but leaves duplicated identity and metadata, so it does not address the root cause.

### 2. Treat routed connections as a projection, not domain data

Logical connections will contain endpoint IDs, kind, label, and optional declarative route hints. A pure routing projection will combine topology, geometry, and hints to produce SVG paths for the canvas.

The generic obstacle router will be isolated from Homelab-specific ports and corridors. Existing routes that need precise geometry will use typed hints rather than branches that inspect specific node IDs. Scene bounds and SVG extents will derive from the same projected scene.

Alternative considered: only move `route()` to another file. That improves file size but retains mixed policy and does not create an independently testable boundary.

### 3. Split status concerns while preserving the wire contract

Status responsibilities will be divided into:

- A server-only probe configuration and cache policy consumed by the API route.
- A server/client-safe DTO and parser contract owned by the Homelab domain.
- A client polling policy owned by `useSiteStatus`.
- Status association stored on canonical Homelab entities.
- Localized status labels owned by Homelab presentation.

The API will continue returning the current object keyed by site ID with `{ state, checkedAt }` entries. Parsing strictness, timeout classification, cache duration, and polling interval remain unchanged in this refactor.

Alternative considered: keep a shared status facade that re-exports all concerns. This would preserve existing imports but hide rather than remove the inverted dependency, so consumers will move to narrow entry points instead.

### 4. Keep project data serializable and compose renderers above the model

Replace optional fields that encode incompatible states with discriminated project data for destination, thumbnail, and detail presentation. Project definitions will contain data only and will not store React component types.

A composition-level registry will import project descriptors and map detail discriminants to concrete renderers. The model layer will define types and pure localization helpers but will not import individual project modules. Every project directory will expose its descriptor through its public `index.ts`; specialized Homelab UI remains a separately named export.

The migration will encode current behavior exactly, including the fact that only external project destinations currently render a dialog action.

Alternative considered: retain `canvas.component` and merely relocate the registry. That repairs directory direction but keeps metadata coupled to React and prevents serialization or independent validation.

### 5. Separate the locale contract from translation content

Introduce a small server-safe locale contract containing the `Lang` type, supported values, default, cookie key, and parser/toggle policy. Server preference loading and the client provider will consume this shared contract.

Translation content will remain colocated according to ownership: application/profile copy, project UI copy, Homelab copy, and shared canvas defaults. A common `Localized<T>` type may be shared, but catalogs will not be centralized solely for convenience.

Shared canvas primitives will receive a complete labels object. Application-aware wrappers or composition code will resolve those labels using the language provider. Existing instant language switching and document title updates remain unchanged.

Alternative considered: continue exposing the entire global translation catalog from one hook. This is simple at the call site but maintains cross-feature coupling and forces shared primitives to require application context.

### 6. Expose one composable infinite-canvas boundary

The canvas package will define a composable frame that owns viewport structure, fullscreen target, controls, and interaction state. Explicit slots will support Homelab's toolbar and overlays without requiring consumers to depend on parent-element assumptions or private data attributes.

Interaction state needed for animation will be exposed through a typed callback, context, or render state selected during implementation based on the smallest API that preserves the current DOM. `InfiniteCanvas` and `CanvasViewport` will no longer represent overlapping public abstractions with inconsistent capabilities.

Alternative considered: document the current DOM attributes as public API. This preserves CSS coupling and makes structural changes unsafe, so a typed composition seam is preferred.

### 7. Protect the refactor with invariants and characterization tests

Add the smallest test setup compatible with the existing TypeScript/React stack. Prioritize pure tests for unique IDs, endpoint resolution, placement completeness, route output/extents, status parsing, project variant interpretation, and selection-state transitions. Add focused component characterization only where pure tests cannot protect visible behavior.

Tests will assert current behavior before each corresponding extraction. They are a migration guard, not an opportunity to redefine status or localization semantics.

## Risks / Trade-offs

- [Large cross-cutting change creates review and regression risk] -> Implement in dependency-ordered slices, keeping adapters only within a single migration slice and removing them before completion.
- [Canonical topology can become an oversized configuration object] -> Keep identity and relationships canonical while deriving geometry and presentation through focused selectors rather than embedding all behavior in the declaration.
- [Exact visual routes can shift when routing becomes pure] -> Characterize generated paths or route points before extraction and preserve existing route hints and scene bounds.
- [New discriminated project data can accidentally change navigation] -> Encode current external/internal interpretation explicitly and test each existing descriptor.
- [Moving localization can change strings or hydration behavior] -> Move copy without editing values and preserve the current provider lifecycle and cookie behavior.
- [A new test dependency increases maintenance] -> Select one minimal runner and avoid broad browser infrastructure unless a behavior cannot be protected otherwise.

## Migration Plan

1. Add characterization tests for current topology, routing, status parsing, project interpretation, and selection invariants.
2. Introduce the locale contract and move shared canvas labels behind explicit inputs without changing rendered copy.
3. Convert project definitions and composition registry, then standardize project entry points.
4. Introduce canonical Homelab identity and derive existing views while preserving current layout data.
5. Split status policy, contract, mapping, and labels onto their owning sides of the new boundary.
6. Extract routing and scene projection, preserving characterized paths and extents.
7. Consolidate the infinite-canvas frame and replace implicit DOM coupling with its typed composition API.
8. Remove superseded declarations and compatibility adapters, then run type checking, tests, production build, and manual desktop/mobile checks.

Each step should leave the application buildable. If a slice regresses behavior, revert that slice rather than retaining parallel sources of truth.
