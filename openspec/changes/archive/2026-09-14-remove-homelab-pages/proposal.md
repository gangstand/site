## Why

The infrastructure map has two entry points that render the same `HomelabCanvas`: the HomeLab project dialog on the home page, and a standalone `/homelab` route. The standalone route is not linked from anywhere in the UI, is marked `robots: { index: false, follow: false }`, and is absent from `app/sitemap.ts` — it is reachable only by typing the URL. It costs a route, a `_pages` slice, and a `ProjectDestination` variant that exists solely to point at it.

## What Changes

- Remove the `/homelab` route (`app/homelab/page.tsx`) and the page slice it composes (`src/_pages/homelab/`). **BREAKING**: `GET /homelab` starts returning the 404 page instead of the map. The route is `noindex` and unlinked, so no in-app navigation and no indexed URL is affected.
- Remove the `internal` variant of `ProjectDestination`, which existed only to hold `/homelab`, and make `destination` optional on `ProjectDefinition`. The HomeLab entry then carries no destination, and `ProjectDetailDialog` renders no "Visit website" link for it — the same output it produces today, since that link is already rendered only for `external` destinations.
- Update `src/_pages/home/model/project.test.ts`, which asserts the HomeLab entry's `internal` destination.
- Keep everything the map itself needs: `src/features/explore-homelab/`, the `/api/homelab/status` route with `src/_app/api-routes/homelab-status/` and `src/shared/api/homelab-status/`, the HomeLab card in the home project list, and its `homelab` detail dialog with live site status.

## Capabilities

### New Capabilities

- `homelab-map`: how the homelab infrastructure map is reached and what it shows. This change is the first to write a spec for it, and it records the post-removal contract: one entry point (the HomeLab project dialog on the home page), no standalone route.

### Modified Capabilities

<!-- None. openspec/specs/ is empty; there is no existing capability to amend. -->

## Impact

Deleted:

- `app/homelab/page.tsx` (and the now-empty `app/homelab/` directory)
- `src/_pages/homelab/index.ts`, `src/_pages/homelab/ui/homelab-page.tsx`

Edited:

- `src/_pages/home/model/project.ts` — drop the `internal` destination variant, make `destination` optional
- `src/_pages/home/config/homelab.ts` — drop the `destination` field
- `src/_pages/home/ui/project-detail-dialog.tsx` — guard the optional `destination`
- `src/_pages/home/model/project.test.ts` — drop the `/homelab` destination assertion

Untouched: the `explore-homelab` feature and its tests, the homelab status API and its contract tests, `steiger.config.js` (its two `explore-homelab` overrides stay relevant), `app/sitemap.ts` (never listed `/homelab`), `README.md` (describes layers, not routes).

Verification: `npm run typecheck`, `npm run test`, `npm run architecture`, `npm run build`.
