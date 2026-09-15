## Why

The SwapRat photo canvas is currently down to a single tile. The previous pass (`recapture-swaprat-canvas`) built a full 27-tile set, but the result was discarded and `public/projects/swaprat/` now holds only `login.webp`; `swaprat.ts` declares one shot. The canvas is the only place a visitor sees what SwapRat does, so it has to be refilled — and the previous pass showed that batching every screen into a scratch directory, then auditing the whole set with pixel diffs and contact sheets, cost far more time than it caught.

## What Changes

- Refill the canvas to full navigation coverage (26 screens remaining beyond `login`), keeping the tile geometry already shipped: uniform 1920×1080, 5 columns, 120 px gap, placed by the existing `packColumns`.
- **Replace the batch-then-swap workflow with a per-screen loop.** For each screen: open the app on that tab, drive it into its populated state, capture at 1920×1080, convert to webp, write it straight into `public/projects/swaprat/`, append its entry to `swaprat.ts`, and report the progress step. The canvas grows one tile at a time instead of being swapped in one commit.
- **Drop the per-screen verification apparatus.** No pixel diffing, no contact sheets, no per-tile bottom-strip review, no re-reading each capture back, no full check-suite run between screens. Each capture keeps exactly one cheap gate: a single in-page assertion that the screen's distinguishing content actually rendered before the shutter fires.
- Run `npm run typecheck`, the test suite, and `npm run architecture` **once at the end**, not per screen.
- Carry over the two rules from the previous pass that are cheap and demonstrably save time: the pinned reporting period (Месяц, 16.08.2026 — 14.09.2026) so tile totals agree with each other, and the wedged-renderer rule (a capture that times out means abandon that page and open a fresh one rather than retry).

## Capabilities

### New Capabilities
<!-- None. What the canvas must present — populated screens, shared tile size, grid placement without overlap, localized descriptions — is already specified by the `project-photo-canvas` delta in the in-flight `recapture-swaprat-canvas` change. This change restores compliance with that contract; it does not alter it. -->

### Modified Capabilities
<!-- None. `project-photo-canvas` is not yet under `openspec/specs/` (its originating change is unarchived), and none of its requirements change here. This change is execution-only, so `.openspec.yaml` sets `skip_specs: true`. -->

## Impact

- **Assets**: `public/projects/swaprat/` — 26 webp files added alongside the existing `login.webp`, each 1920×1080. Expected total ~2.1 MB, paid only when a visitor opens the SwapRat dialog.
- **Config**: `src/_pages/home/config/swaprat.ts` — the `shots` list grows from 1 entry back to 27. Geometry constants and the `packColumns` call are unchanged.
- **Unchanged**: `src/_pages/home/model/column-layout.ts` and its test; `src/_pages/home/ui/photo-canvas.tsx`; `src/shared/ui/infinite-canvas/`; `thumbnail.webp` and the home page list.
- **Source of truth**: the SwapRat demo at `https://app.swaprat.ru/`, entered via «Посмотреть демо-режим», tenant «Ресторан Веранда».
- **Working state**: because tiles land in `public/` as they are captured, the canvas is partially filled between steps. That is local-only until the work is committed.
