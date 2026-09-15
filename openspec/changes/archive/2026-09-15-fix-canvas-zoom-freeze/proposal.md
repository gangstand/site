## Why

Clicking a photo on the SwapRat project canvas freezes the interface for a noticeable moment before the camera starts moving, and panning or zooming while the canvas is zoomed in stays jerky. The canvas holds 28 tiles of 1920x1080 (`src/_pages/home/config/swaprat.ts`), every one of them mounted and rasterised at all times, while the camera drives its per-frame transform through a React render on every animation frame (`setTransform` inside the rAF loop in `use-canvas-transform.ts`). Both costs land on exactly the frames where the visitor expects motion.

## What Changes

- Take the per-frame camera out of React: keep the live camera in `transformRef`, write `world.style.transform` directly from the single rAF loop, and use that path for click-to-focus, drag, wheel, pinch and the zoom/fit buttons. React state is updated only for the zoom indicator (rate-limited while the camera is moving), mode changes, and the end of a movement.
- Keep the first frame honest: the canvas still appears already at its opening camera, never at an intermediate one, and a gesture still interrupts an in-flight glide from where the camera actually is, with no jump.
- Draw only the tiles near the viewport: compute the visible region in canvas coordinates from the camera and the viewport size, expand it by a margin so a tile is prepared before it scrolls in, and attach the image only for tiles inside that region. The rendered set is recomputed only when its membership actually changes. When the whole canvas fits the viewport — the fitted view every project opens at — every tile shows its image, as today.
- Keep tile geometry, canvas bounds, focus and pointer capture intact while doing so: a tile that holds focus or pointer capture is never unmounted, every tile stays reachable by keyboard and activatable whether or not it is on screen, and preparation uses the existing full-size images via `decode()` without holding up the start of the camera movement.
- Add an `isAnimating` flag to the camera so the glide counts as active movement alongside pan and wheel, and use that combined signal to simplify visual effects during movement — specifically, suppress the photo tiles' box shadow while the camera moves and restore it when it stops, if measurement confirms it helps. Any such toggle must not move or resize a tile or produce visible flicker.
- Leave the compositing fix from `2026-09-15-fix-canvas-image-zoom-artifact` in place: the bounded `.viewport` stays the composited, isolated layer, and no blanket `will-change: transform` / `translateZ(0)` is added to `.world` without its own verification.

Constraints carried through unchanged: the existing full-size 1920x1080 images are used as-is (no thumbnails, downscaled copies or multi-resolution tiers), the current focus rules, zoom limits and `prefers-reduced-motion` behaviour stay, and `CanvasViewport` keeps working for `HomelabCanvas`, which shares it.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `project-photo-canvas`: the "move to a tile is animated unless reduced motion is asked for" requirement gains an explicit expectation that activating a tile starts and runs the glide without a stall, on a canvas of this size; the "a tile is activatable by pointer and by keyboard" requirement gains the expectation that reach, activation and held focus survive wherever the camera sits; and a requirement is added for tiles out of view not drawing their image (and every tile drawing it when the whole set fits). **Outcome at archive time:** a second added requirement — effects simplified during movement being invisible apart from the smoothness they buy — was dropped rather than synced, because task 4.2 measured no benefit from suppressing tile shadows, so nothing is simplified during movement and the permissive requirement would have described behaviour the canvas does not have.

## Impact

- Affected code: `src/shared/ui/infinite-canvas/model/use-canvas-transform.ts` (rAF camera, `transformRef`, `worldRef`, `isAnimating`, throttled scale state), `src/shared/ui/infinite-canvas/ui/canvas-viewport.tsx` (world ref wiring, transform no longer read from React state, interaction state), `src/_pages/home/ui/photo-canvas.tsx` (visible-region computation and image attachment), `src/_pages/home/ui/photo-canvas.module.css` (shadow suppression during movement).
- Shared-component blast radius: `CanvasViewport` is also used by `src/features/explore-homelab/ui/homelab-canvas.tsx`, which drives `.canvasInteracting` / `.canvasDetailView` off `onInteractionChange`. That contract must keep firing on mode changes; the homelab map has no tiles to cull and must show no visual or behavioural regression.
- No API, data, dependency or image-asset changes.
- Assumptions recorded here rather than asked: (a) culling attaches or detaches the `<img>` inside a tile while the tile's own `<button>` stays mounted — that is what keeps geometry, tab order, focus and pointer capture intact; (b) a culled tile keeps its existing background and rounded corners, so an unprepared tile reads as an empty frame rather than a hole; (c) the shadow suppression in item 3 ships only if measurement confirms a benefit, and is otherwise dropped.
