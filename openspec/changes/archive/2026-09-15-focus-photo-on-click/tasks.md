## 1. Focus geometry in the shared canvas model

- [x] 1.1 Add the pure focus-geometry helper next to `useCanvasTransform` in `src/shared/ui/infinite-canvas/model/` — it takes a world rectangle plus viewport width/height and returns `{ x, y, scale }` that centres the rectangle, scaled to fit inside the existing 24px padding and never above 1:1, reusing the padding/no-upscale rules `computeFitScale` already applies; verify by exporting it and type-checking with `npm run typecheck`
- [x] 1.2 Add a vitest file for the helper covering: a 1920x1080 rectangle in a 900x600 viewport is centred at the fit-to-tile scale, a rectangle smaller than the viewport is not upscaled past 1:1, and a non-zero rectangle origin (`x`/`y` offset) is centred correctly; verify with `npm test`
- [x] 1.3 Add `focusRect(rect)` to `useCanvasTransform`: read the live viewport rect, run the helper, pass the scale through the existing `clampScale`, and commit through `setTransformImmediate`; verify by type-checking and by a vitest case asserting the helper's scale above the ceiling is clamped rather than applied (ceiling math exercised through the helper plus the clamp rule)

## 2. Animated camera move

- [x] 2.1 Add the `isAnimating` flag to `useCanvasTransform`, set by `focusRect` only when `window.matchMedia("(prefers-reduced-motion: reduce)").matches` is false, cleared by a fallback timer, and return it from the hook; verify with `npm run typecheck`
- [x] 2.2 Clear `isAnimating` at the start of `onPointerDown` and in the wheel handler so a gesture during the glide drops the transition immediately; verify by dragging and wheel-zooming mid-animation in the running app — the canvas tracks the pointer with no lag behind it
- [x] 2.3 Apply the flag as a class on `.world` in `canvas-viewport.tsx` and add `transition: transform 280ms cubic-bezier(0.2, 0, 0, 1)` for that class in `infinite-canvas.module.css`, clearing the flag on the world's `transitionend`; verify in the app that a focus move glides while mount, resize, drag, wheel and pinch stay unanimated

## 3. Canvas handle exposed to consumers

- [x] 3.1 Add the `CanvasHandle` interface (`focusRect`, `fitView`) and the optional `canvasRef` prop to `CanvasViewport`, wired with `useImperativeHandle`; verify with `npm run typecheck` that existing call sites — including `homelab-canvas.tsx` — still compile untouched
- [x] 3.2 Export `CanvasHandle` from `src/shared/ui/infinite-canvas/index.ts` and verify `npm run architecture` (steiger) reports no new import-boundary violations

## 4. Activatable tiles on the photo canvas

- [x] 4.1 In `photo-canvas.tsx`, hold a `CanvasHandle` ref, pass it to `CanvasViewport`, and wrap each tile's `img` in an absolutely positioned `<button type="button">` whose click calls `focusRect` with that image's `{ x, y, w: width, h: height }`; verify in the app that clicking a tile centres and enlarges it, clicking another tile moves to that one, and clicking the same tile again leaves the view where it is
- [x] 4.2 Move the absolute positioning and box styling from `.photo` to the button in `photo-canvas.module.css`, keeping the image filling its button; verify in the app that the grid is laid out exactly as before the change (no shifted or resized tiles, in both themes)
- [x] 4.3 Give the button the tile's localized description as its `aria-label` and set the `img` to `alt=""`; verify with a screen reader or the browser's accessibility inspector that each tile is announced once, as a button named by the screen description, in both `ru` and `en`
- [x] 4.4 Verify keyboard activation in the app: `Tab` reaches each tile in reading order with a visible focus ring, `Enter` and `Space` bring the focused tile into view, and the canvas's own arrow/plus/minus/`0` keys still work when the viewport itself has focus

## 5. Regression checks across the change

- [x] 5.1 Verify the drag and pinch guards in the app: pressing down on a tile and dragging pans the canvas without bringing any tile into view, and a two-finger pinch starting on a tile zooms without activating one
- [x] 5.2 Verify the way back out and the dialog's own keys: the footer "fit all" control and the `0` key restore the whole-set view from a focused tile, a tile activated afterwards still comes into view, and `Escape` closes the project dialog from a focused tile
- [x] 5.3 Verify with reduced motion forced on (devtools rendering emulation) that activating a tile lands on it instantly with no animation
- [x] 5.4 Verify the homelab canvas is unchanged — open the HomeLab project and confirm zone/card selection, panning, zooming and fit all behave exactly as before, with no animated transform
- [x] 5.5 Run `npm run typecheck`, `npm test`, `npm run architecture` and `npm run build`, then `graphify update .` to refresh the knowledge graph
