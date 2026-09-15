## Context

The photo canvas (`PhotoCanvas` → `CanvasViewport` → `useCanvasTransform`, all under `src/shared/ui/infinite-canvas/`) renders every tile as an absolutely-positioned `<img>` inside one `.world` div. Camera movement is a single CSS `transform: translate(...) scale(...)` applied to `.world`; panning/wheel/pinch update that transform every frame via `requestAnimationFrame` with no CSS transition, while `focusRect` (invoked when a tile is activated, `photo-canvas.tsx:40`) sets the transform straight to its destination and toggles an `.animating` class that gives `.world` a 280ms CSS transition (`infinite-canvas.module.css:4`) so the jump reads as a glide.

`.world` has no `will-change`, `backface-visibility`, or other layer-promotion hint. The canvas's zoom range runs down to `MIN_SCALE = 0.08` (`use-canvas-transform.ts:10`), well below the fitted scale for a typical photo set. `focusRect` always recomputes its destination scale from the tile and current viewport (`computeFocusScale`/`centerRectAt`), independent of the scale the canvas is currently at — this targeting logic is correct per the existing spec and is not being changed.

See `proposal.md` for the reported symptom and reproduction. This design covers only how the rendering artifact is eliminated.

## Goals / Non-Goals

**Goals:**
- Eliminate the visible flash/stale-frame artifact during the animated glide to an activated tile, at any starting scale, without changing the destination the canvas animates to.
- Keep the fix scoped to `CanvasViewport`'s rendering path so every consumer (`PhotoCanvas`, `HomelabCanvas`) benefits, since they share the same `.world` transition.

**Non-Goals:**
- Changing the animation duration, easing curve, or the reduced-motion behavior.
- Changing zoom limits (`MIN_SCALE`, `MAX_ZOOM_MULTIPLIER`) or the fit/focus targeting math.
- A general performance overhaul of the canvas; this addresses the one reported visual defect.

## Decisions

**Decision: Promote `.world` to its own compositor layer ahead of time, rather than changing how the transition is driven.**

The working hypothesis (see `proposal.md` Impact) is that the artifact is a browser compositing side effect: `.world` is plain (auto) layer, so a large, sudden scale change forces the compositor to re-rasterize the whole photo layer at the new resolution mid-transition, and the frame(s) before that re-raster lands are what's visible as a flash. This is consistent with the repro only surfacing when the starting scale is well below the fitted view — that's when the scale delta, and therefore the raster-resolution delta, is largest.

Fix: add `will-change: transform` (or `transform: translateZ(0)` if that proves more consistent across the target browsers) to `.world` so it's kept on a stable compositor layer at all times, not just during the transition. This avoids the layer-creation/raster-resize churn that a class-toggled promotion (e.g. adding `will-change` only while `.animating` is set) would still trigger right at the moment the transition starts — the same moment the artifact currently appears.

Alternatives considered:
- *Toggle `will-change` only during `.animating`*: rejected — promoting the layer at the same instant the transition begins doesn't avoid the initial raster-resize cost; it needs to already be promoted before the jump.
- *Drive the transition with `requestAnimationFrame`-interpolated scale steps instead of a CSS transition* (the codebase already has an rAF-based `updateTransform` path used for pan/zoom): rejected as first approach — more invasive, changes how every camera movement is scheduled, and doesn't by itself fix compositor raster churn (the same large scale delta happens either way; only the promoted-layer fix addresses that). Keep as a fallback if the layer-promotion fix doesn't fully resolve the artifact.
- *Clamp how far below fit scale the canvas can zoom*: rejected — changes user-facing zoom behavior (a real capability) to paper over a rendering bug, and the spec doesn't ask for a zoom-range change.

**Outcome: the fallback was taken.** Promoting `.world` did not clear the artifact — compositing the bounded `.viewport` instead did (`contain: strict; isolation: isolate; transform: translateZ(0)`), because the damage came from rasterising the enormous world layer, not from promoting it. The `.world.animating` CSS transition was replaced by the rAF-interpolated glide listed as an alternative below, for a second reason found during implementation: a CSS transition leaves `transformRef` at the destination while the element is still travelling, so interrupting the glide jumped the camera.

## Risks / Trade-offs

- [The compositing hypothesis is wrong or only partially explains the artifact] → Verify by reproducing the exact repro (zoom out well below fit, activate a tile, observe) before and after the fix; if the artifact persists, fall back to the rAF-interpolated transition alternative above rather than layering on more CSS hints speculatively.
- [`will-change: transform` on an always-large `.world` layer increases GPU memory usage] → `.world` is already the entire canvas content and is already transformed on every pan/zoom/pinch frame today (just not via a CSS transition), so this keeps an already-active layer promoted rather than creating a new cost class; watch for regressions on low-end/mobile during manual verification.
- [Fix is browser-specific and doesn't reproduce/resolve identically across engines] → Manually verify on at least one Chromium-based and one WebKit-based browser during implementation, since compositor raster behavior is engine-specific.

## Open Questions

None — the mitigation and its fallback are decided; only empirical confirmation during implementation remains, which is captured as a verification task rather than an open design question.
