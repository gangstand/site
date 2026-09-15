## Why

Opening a project's photo canvas, zooming out well past the fitted view, and then clicking any photo tile produces a brief (sub-second) visual glitch on the canvas as it animates in to the tile. The glide-to-tile animation itself is intentional (see `project-photo-canvas`'s "move to a tile is animated" requirement); the glitch is a rendering defect during that animation, not the animation itself, and it undermines the "the visitor can see where the tile came from" intent of that requirement.

## What Changes

- Fix the rendering glitch that appears during the animated move-to-tile transition on the project photo canvas when that transition starts from a scale well below the fitted view.
- Tighten the existing "move to a tile is animated" requirement so a smooth, artifact-free transition is an explicit, testable expectation rather than an implicit assumption.
- No change to the canvas's zoom range, activation logic, or targeting math (`focusRect`/`computeFocusScale`/`centerRectAt` already recompute the destination correctly per the current spec) — this is scoped to the visual quality of the transition itself.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `project-photo-canvas`: the "move to a tile is animated unless reduced motion is asked for" requirement is extended to state that the animated transition SHALL NOT show a visible rendering artifact (flash, tearing, or a stale/blurred frame), including when the transition starts from a scale well below the fitted view.

## Impact

- Affected code: `src/shared/ui/infinite-canvas/ui/canvas-viewport.tsx` and `src/shared/ui/infinite-canvas/ui/infinite-canvas.module.css` (the `.world`/`.world.animating` transform transition shared by every canvas built on `CanvasViewport`, including `PhotoCanvas` and `HomelabCanvas`), and `src/shared/ui/infinite-canvas/model/use-canvas-transform.ts` (`focusRect`, which drives the transition).
- Likely root cause (to be confirmed during implementation): the `.world` element is scaled via a CSS `transform` transition with no layer-promotion hint (`will-change`/`backface-visibility`). When the starting scale is very small (e.g. near the canvas's `MIN_SCALE` of 0.08) and `focusRect` jumps the target scale up sharply, the browser's compositor has to re-rasterize the large photo layer at a much higher resolution mid-transition; the frame(s) before that re-raster completes are visible as a brief artifact. Starting from the fitted view keeps the scale jump small enough that this isn't noticeable, which matches the reported repro (only visible after zooming out further than fit, then activating a tile).
- No API, data, or dependency changes. Purely a rendering/CSS-level fix plus a spec clarification; other consumers of `CanvasViewport` (e.g. `HomelabCanvas`) benefit from the same fix without their own spec needing to change, since they have no equivalent animated-transition requirement today.
