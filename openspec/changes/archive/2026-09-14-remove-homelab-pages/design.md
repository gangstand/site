## Context

See proposal.md — Why. Two facts shape the approach:

- `app/homelab/page.tsx` is the only importer of `src/_pages/homelab`, and `src/_pages/homelab/ui/homelab-page.tsx` is a four-line wrapper that renders `<HomelabCanvas />` inside a full-height div. Nothing else in the page slice is reused.
- `ProjectDestination` has two variants, `internal` and `external`. Only the HomeLab entry uses `internal`, and `ProjectDetailDialog` renders the destination link only when `kind === "external"`. The `internal` variant therefore has no rendered effect today — it is data pointing at the route being deleted.

The repo follows a one-way dependency rule, `_app -> _pages -> features -> shared`, checked by `steiger src`.

## Goals / Non-Goals

**Goals:**

- Leave no dangling reference to `/homelab` in code, config, or tests.
- Keep the map's behavior inside the home page dialog byte-for-byte unchanged.

**Non-Goals:**

- Redirecting `/homelab` anywhere. It is unlinked and `noindex`; a 404 is the correct end state.
- Relocating or reshaping `src/features/explore-homelab`.
- Touching the status API, its cache, or its contract tests.

## Decisions

**Delete the `internal` destination variant rather than leaving the field pointed at a dead route.**
`destination` becomes optional on `ProjectDefinition`, `ProjectDestination` narrows to the single `external` variant, and the HomeLab config omits the field. `ProjectDetailDialog` reads `project.destination?.kind === "external"`, which is false for HomeLab exactly as it is today, so the dialog renders identically.
_Alternatives:_ (a) keep `destination: { kind: "internal", url: "/homelab" }` — leaves data describing a route that 404s, and the next reader has to discover it is inert; (b) add a `{ kind: "none" }` variant — a third variant to carry the absence of a value that an optional field already expresses. `ProjectView` derives from `ProjectDefinition` via `Omit`, so the optional field flows through `projectView` without further change.

**Delete `src/_pages/homelab` outright instead of folding its wrapper into the home page.**
The `h-svh` shell exists only to give the standalone route a viewport-height container; the dialog supplies its own canvas frame via `HomelabCanvas embedded`. There is nothing to preserve.

**Leave `src/features/explore-homelab` in the features layer.**
After this change it has a single consumer, `_pages/home/ui/project-detail-dialog.tsx`, which by the README's own rule ("keep code in its owning page unless it has multiple current consumers") is an argument for moving it under `_pages/home`. That move is a large, purely structural diff across ~20 files with no behavior change, and `steiger.config.js` already disables `fsd/insignificant-slice` for this slice, so the architecture check stays green either way. Keeping the deletion small and reviewable wins; the move is a separate change if it is wanted at all.

## Risks / Trade-offs

- **A bookmarked or externally shared `/homelab` link starts 404ing** → Accepted, and the reason the proposal marks it **BREAKING**. The route is `noindex`, unlinked, and absent from the sitemap, so the exposure is limited to someone who saved the URL by hand; the map itself is still one click away on the home page.
- **`destination` becoming optional weakens the compile-time guarantee that every project declares one** → `project.test.ts` keeps asserting `destination.kind === "external"` for every entry other than HomeLab, so an accidentally dropped destination on a real project still fails the suite.
- **A stale `.next/` build cache can keep serving the deleted route locally** → Verify with a fresh `npm run build` rather than a warm `next dev` process.

## Migration Plan

No data, no deploy step. The change lands as a single commit; rollback is `git revert`.
