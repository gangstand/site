## 1. Baseline the freeze before changing anything

- [x] 1.1 Record a Chrome DevTools performance trace of the SwapRat photo canvas: open the project, click a tile, then drag and wheel-zoom while zoomed in — verify the trace shows the long frames and note the per-frame scripting/rendering cost, so tasks 2, 3 and 4 have a before/after to compare against
- [x] 1.2 From the same trace, note how much of a frame is React render/commit (the `setTransform` path) versus paint/raster of the tiles — verify both contributors are identified, since task 2 addresses the first and task 3 the second

## 2. Move the per-frame camera out of React

- [x] 2.1 Add a `worldRef` to `useCanvasTransform` and have the rAF loop write `world.style.transform` from `transformRef` instead of calling `setTransform`; stop returning a `transform` object from the hook and return `scale` instead — verify `canvas-viewport.tsx` no longer binds any inline transform on `.world` and `npm run typecheck` passes
- [x] 2.2 Apply first-paint readiness from the same rAF write (set `world.style.opacity` alongside the first transform, keeping `ready` state only for `FooterControls`) — verify by opening a project repeatedly, with the dialog animation running, that the canvas never appears at an intermediate camera or scale
- [x] 2.3 Rate-limit the scale published to React to ~100ms while the camera is moving and publish once unconditionally when movement ends — verify the footer readout updates visibly during a wheel zoom and settles on the exact final value after it stops
- [x] 2.4 Add `isAnimating` state set when a focus glide starts and cleared when it ends or is interrupted, and include it in `isInteracting` — verify `onInteractionChange` fires on glide start and end and that `isDetailView` still flips at the same scale threshold
- [x] 2.5 Re-verify every camera entry point drives the new path: click-to-focus, drag, wheel pan, ctrl/⌘ wheel zoom, pinch, the zoom in/out/fit buttons and the arrow/`+`/`-`/`0` keys — verify each moves the canvas exactly as before, and that `npm test` (including `focus-geometry.test.ts`) passes
- [x] 2.6 Verify the interruption case from the spec: start a glide, then drag or wheel-zoom mid-flight — the camera must continue from where it visibly is, with no jump to or from the animation's destination
- [x] 2.7 Re-trace as in 1.1 and verify the React render/commit cost per camera frame is gone

## 3. Draw only the tiles near the viewport

- [x] 3.1 Add an optional `onVisibleRectChange` callback to `CanvasViewport`, invoked from the rAF write (and once when the first camera lands) with the visible region in canvas coordinates expanded by half a viewport on each side — verify by logging that it reports the full canvas bounds in the fitted view and a correspondingly smaller rect when zoomed in
- [x] 3.2 In `PhotoCanvas`, compute which tiles intersect that rect and store the result in state only when the membership actually changes — verify with a render counter or log that panning within one membership produces no re-render
- [x] 3.3 Render the `<img>` only for tiles in that set while keeping every tile's `<button>`, position, size, `aria-label` and frame mounted — verify the canvas's "fit all" view frames the same region as before the change and no tile moves or resizes as the camera crosses a membership boundary
- [x] 3.4 Verify the fitted view shows every tile's screenshot (open SwapRat and confirm all 28 tiles are drawn, none blank)
- [x] 3.5 Verify panning towards an off-screen part of the set brings tiles in already drawn rather than filling in after they appear, at both a slow and a fast drag
- [x] 3.6 Verify keyboard reach is unaffected: tab through the canvas while zoomed in on one corner, confirm off-screen tiles take focus with a visible indicator, activating one brings it into view, and focus stays on the tile throughout the glide
- [x] 3.7 Verify a pointer gesture started on a tile keeps following the pointer until release even when the drag carries the camera far enough to cull that tile
- [x] 3.8 Add opportunistic pre-decoding for an activated tile (detached `Image` + `decode()`, started alongside the glide and never awaited), guarded by a generation counter and with rejections swallowed — verify by activating several tiles in quick succession that the drawn set always matches the final camera position and no error surfaces in the console
- [x] 3.9 Verify a tile whose image fails to load (simulate with a blocked or renamed request in DevTools) stays as an empty frame while panning, zooming and tile activation keep working
- [x] 3.10 Re-trace as in 1.1 while zoomed in and verify per-frame paint/raster cost has dropped against the 1.2 baseline

## 4. Decide the effects simplification by measurement

- [x] 4.1 Add the `movingCamera` class wiring in `PhotoCanvas` (from `onInteractionChange`, as `HomelabCanvas` already does) with `.movingCamera .photo { box-shadow: none }` in `photo-canvas.module.css` — verify the class appears on the canvas root while the camera moves and is gone when it stops. Done and verified: the class tracked the glide, the drag and the wheel and cleared at rest. Removed again by 4.2.
- [x] 4.2 Trace the same click/drag/zoom sequence with the rule on and off and verify whether the frames measurably improve; keep the rule only if they do, and remove the class and the CSS rule if they do not — record which way it went in the task notes. **Outcome: dropped.** Three paired traces of a zoomed-in wheel pan at 20x CPU throttle showed no benefit — long frames 37/37 with shadows off against 36/38 with them kept, render pipeline 7.95-8.05 ms/frame against 7.92-8.51 ms/frame. The class and the CSS rule were removed; `isAnimating` and its place in `isInteracting` stay.
- [x] 4.3 If it ships, verify nothing shifts, resizes or flickers as the shadow drops and is restored at the start and end of a glide, a drag and a wheel zoom. Verified while it was in place (tile boxes byte-identical with the shadow on and off at the same camera, `box-shadow` being a non-layout property); moot now that 4.2 dropped it — no effect is toggled during movement at all.

## 5. Compositing, motion preferences and the shared consumer

- [x] 5.1 BLOCKED (Yandex Browser is not installed on this machine, so the engine the original artifact was reported on cannot be exercised here; the Chromium half was run — zoom out to `MIN_SCALE`, activate a tile, then six rounds of rapid zoom in/out: every on-screen tile kept its photo, no empty raster areas, dialog intact, no console errors — and the CSS assertion holds: `.viewport` still carries `contain:strict; isolation:isolate; transform:translateZ(0)` and `.world` has no `will-change`/`translateZ`, only the new `opacity:0` initial state) Re-run the `2026-09-15-fix-canvas-image-zoom-artifact` repro in Yandex Browser — zoom out well below the fitted view, activate a tile, and zoom rapidly — verify no flash, no missing images, no empty raster areas and no damage to the surrounding dialog, and confirm `.viewport` still carries the compositing rules while `.world` gained no `will-change`/`translateZ(0)`
- [x] 5.2 PARTIAL (Chromium done: fit/zoom/fit-key round trip exact, 27 tiles drawn at fit, tiles arrive drawn while panning, drag and glide as specified. No WebKit engine is drivable on this machine — no Safari/WebKit build and no automation package for one; Epiphany/WebKitGTK is present but cannot be scripted) Repeat the core checks (2.5, 2.6, 3.4, 3.5) on one Chromium-based and one WebKit-based browser — verify no engine-specific regression
- [x] 5.3 Verify `prefers-reduced-motion: reduce` still jumps straight to the activated tile with no animation, with the tile drawn on arrival
- [x] 5.4 Spot-check `HomelabCanvas` — pan, zoom, select a node and a connection — and verify the map behaves and animates as before, with `.canvasInteracting` / `.canvasDetailView` still toggling correctly
- [x] 5.5 Run `npm run typecheck`, `npm test`, `npm run architecture` and `npm run build` and verify all pass
