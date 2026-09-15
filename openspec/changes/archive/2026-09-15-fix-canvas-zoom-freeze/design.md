## Context

See `proposal.md` — Why. The state that shapes this design:

- `useCanvasTransform` already owns a single rAF loop and already keeps the live camera in `transformRef` (`use-canvas-transform.ts`). The one thing the loop does with it is `setTransform(transformRef.current)`, so every frame of every gesture and of the focus glide is a React render plus a commit of `canvas-viewport.tsx`'s whole subtree — the full tile set for `PhotoCanvas`, the whole map for `HomelabCanvas`.
- `.world` is `position:absolute; transform-origin:0 0` and carries the camera as an inline `transform` built from React state; the `ready` flag gates its `opacity` so nothing is painted at the placeholder camera. The compositing fix from `2026-09-15-fix-canvas-image-zoom-artifact` lives on `.viewport` (`contain:strict; isolation:isolate; transform:translateZ(0)`) and stays.
- `PhotoCanvas` renders one `<button>` per image with an `<img>` inside, absolutely positioned from the image record; SwapRat is 28 tiles of 1920x1080 packed into 5 columns with a 120px gap (`src/_pages/home/config/swaprat.ts`, `packColumns`) — roughly a 10200x7200 world, all of it mounted and rasterisable at all times.
- `CanvasViewport` is shared: `HomelabCanvas` drives `.canvasInteracting` / `.canvasDetailView` from `onInteractionChange`, so that callback's contract has to survive.
- `focus-geometry.ts` holds the pure camera maths (`computeFocusScale`, `centerRectAt`, `toViewportPoint`) and is unit-tested; none of it changes.

## Goals / Non-Goals

**Goals:**
- One writer for the camera — the rAF loop — writing the DOM directly, with React seeing only what it needs to render: the zoom readout, the mode flags, and readiness.
- A tile set whose drawn members follow the camera without the consumer doing per-frame React work.
- Keep every existing camera behaviour bit-for-bit: opening camera, resize re-centring, drag threshold, pinch, wheel, zoom buttons, reduced motion, interruption of an in-flight glide.

**Non-Goals:**
- Virtualising `HomelabCanvas`. It has a bounded node count and no tiles; it gets the camera fix for free and nothing else.
- Any change to the camera maths, the zoom range, or the fit/focus destinations.
- Any change to image assets, formats or resolutions, and any form of thumbnail or LOD pyramid (explicitly excluded by the request).
- A general React performance pass on the project dialog outside the canvas.

## Decisions

**Decision: the rAF loop writes `world.style.transform`; React state carries only what is rendered.**

`useCanvasTransform` takes a `worldRef`. `commitTransform` keeps writing `transformRef` and asking for a frame; the frame applies `translate(...) scale(...)` to `worldRef.current.style` instead of calling `setTransform`. The hook stops returning `transform` and returns `scale` (for the readout), the mode flags, and the refs. `canvas-viewport.tsx` renders `.world` with no inline `transform` at all, so a React re-render can never stamp a stale camera over the one the loop wrote.

Alternatives considered: keeping `setTransform` but memoising `children` — rejected, it still pays a render+commit per frame and leaves the rendered camera one frame behind the coordinates the next gesture reads, which is the failure the previous change already had to fix. Driving the glide with a CSS transition — rejected for the same reason that change rejected it: the ref and the painted element disagree mid-transition, so interrupting jumps.

**Decision: readiness is applied in the same frame as the first camera, by the loop, not by React.**

The `readyRef` → `setReady` handshake exists so the first camera and the un-hiding land together. With the camera leaving React that guarantee is gone, so the loop sets `world.style.opacity` itself in the same write as the first transform. `ready` stays as React state purely for `FooterControls` (it gates the readout), and may land a frame later without anything being visible at an intermediate camera.

**Decision: the zoom readout is rate-limited while the camera moves; mode flags flip only at boundaries.**

The loop publishes `scale` to React at most once every ~100ms while a gesture or glide is running, and once unconditionally when movement ends, so the readout settles on the true value. `isPanning` / `isWheeling` / `isAnimating` are set at gesture start and end only. `isDetailView` is derived from the published (throttled) scale — it drives CSS classes on the homelab map, where being up to ~100ms late is invisible.

**Decision: `isAnimating` joins the interaction signal.**

`animation.current !== null` becomes an `isAnimating` state flag set when a glide starts and cleared when it finishes or is interrupted, and `isInteracting = isPanning || isWheeling || isAnimating`. `HomelabCanvas` never calls `focusRect`, so its `.canvasInteracting` behaviour is unchanged in practice; `PhotoCanvas` gets a single signal covering glide, drag, wheel and pinch.

**Decision: the viewport rect is pushed to the consumer from the loop; the consumer diffs membership.**

`CanvasViewport` gains an optional `onVisibleRectChange?: (rect: CanvasBounds) => void`, invoked from the same rAF write (and once when the first camera lands) with the visible region in canvas coordinates, expanded by a margin of half a viewport on each side. `PhotoCanvas` holds a stable callback, computes which tiles intersect that rect, and calls `setState` only when the resulting membership differs from the last one — for 28 tiles that is a few dozen comparisons per frame and a state update perhaps once per second of panning.

Alternatives considered: exposing the live transform and letting the consumer compute per render — that is the per-frame React cost this change removes. An `IntersectionObserver` per tile — rejected: it observes against the scroll viewport with the world's transform applied, fires asynchronously with its own latency, and gives no control over the margin in canvas units.

Consequences that fall out of it: when the whole set fits (the fitted view every project opens at) the rect covers every tile, so the "fitted view shows everything" scenario holds by construction, and the margin makes the "arrives already drawn" scenario hold for any pan slower than half a viewport per frame.

**Decision: culling detaches the `<img>`, never the tile's `<button>`.**

Every tile stays mounted as a positioned `<button>` with its `aria-label`, its dimensions and its background frame; only the `<img>` inside is conditionally rendered. This is what keeps the canvas bounds, `packColumns` geometry, tab order, the focus ring and an in-flight pointer capture untouched no matter where the camera goes — the requirement that focus and pointer capture survive is satisfied because the focused element is never one of the things that unmounts. It also means an undrawn tile reads as an empty framed rectangle rather than a hole.

**Decision: pre-decoding is opportunistic and never blocks the camera.**

The margin band is the main preparation mechanism — a tile mounts its `<img>` before it is on screen and decodes asynchronously. On top of that, activating a tile kicks off a detached `new Image()` + `decode()` for that tile's `src` while the glide starts; the glide never awaits it. A generation counter guards the result so a decode that resolves after the visitor has moved on is dropped, and rejections (decode aborts, failed loads) are swallowed — a tile that cannot load stays an empty frame and the canvas keeps working. Already-decoded sources are remembered so repeat activations are free.

**Decision: shadow suppression is one class on an ancestor, and only ships if measured.**

`PhotoCanvas` mirrors what `HomelabCanvas` already does: it takes `onInteractionChange` and puts a `movingCamera` class on the `CanvasViewport` root, with `.movingCamera .photo { box-shadow: none }` in `photo-canvas.module.css`. One class toggle, one style recalculation, instead of touching 28 elements. `box-shadow` does not participate in layout, so nothing moves or resizes when it is dropped or restored. Whether it ships at all is decided by a before/after trace (tasks 4.x); if the frames do not improve, the class and the CSS rule are dropped and only the `isAnimating` part of this item remains.

**Decision: compositing is left exactly as it is.**

`.viewport` keeps `contain:strict; isolation:isolate; transform:translateZ(0)`; `.world` gets no `will-change` and no `translateZ(0)`. The artifact that fix cured was caused by rasterising the enormous world layer, and the culling work in this change alters how much of that layer has content in it — which is a reason to re-run that change's Yandex verification, not a reason to add layer hints speculatively.

## Risks / Trade-offs

- [A future edit re-introduces an inline `transform` on `.world` from React state and silently fights the loop] → The hook stops returning a `transform` object at all, so there is nothing to bind; the only exported camera value is `scale`.
- [React 18 Strict Mode double-invokes effects, and a remount leaves `.world` with no transform until the next frame] → The loop applies transform and opacity together and `transformRef` survives as the source of truth; a fresh `.world` node is written on the first frame after mount, before it is un-hidden.
- [Membership thrash at the margin boundary during a slow pan] → The margin is half a viewport on each side, far larger than a frame's worth of movement, so a tile crosses the boundary once rather than oscillating; if a case is found, hysteresis (a larger enter band than exit band) is the fix.
- [Culling changes what the compositor holds and re-opens the Yandex zoom artifact] → Re-run the `2026-09-15-fix-canvas-image-zoom-artifact` repro in Yandex as an explicit verification task, before and after.
- [`isInteracting` now includes `isAnimating`, and `HomelabCanvas` reads it] → Behaviourally inert there (no `focusRect` caller), but spot-check the map for changed connection-animation behaviour.
- [The throttled readout makes `isDetailView` late, and with it the homelab's `.canvasDetailView` class] → Bounded by the throttle interval and only affects a decorative animation; publish once on movement end so the resting state is always correct.

## Open Questions

None. The one empirical unknown — whether suppressing tile shadows during movement measurably helps — is a decision the verification tasks make, with a defined outcome either way.
