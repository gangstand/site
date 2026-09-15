## Context

See proposal.md — Why. What shapes the approach is the existing canvas plumbing, all of which already exists and must keep working:

- `src/shared/ui/infinite-canvas/model/use-canvas-transform.ts` owns the whole transform: a `transformRef` written synchronously, a rAF-batched `setTransform` for render, `clampScale` (min `0.08`, max `max(fitScale * 3, 0.8)`), `centerAt`, `fitView`, `zoomAround`, wheel/pinch/drag handlers and the `moved` ref used to tell a drag from a click.
- `src/shared/ui/infinite-canvas/ui/canvas-viewport.tsx` renders `.world` with `transform: translate(...) scale(...)` and already guards clicks after a drag in `onClickCapture` (it cancels the click when `moved.current` is set and the target is not a `[data-canvas-control]`). That guard fires in the capture phase on the viewport, so it stops the event before it reaches a tile — dragging from a tile cannot activate it, for free.
- `onPointerDown` sets pointer capture on `(e.target as Element).closest("button, [role='button']") ?? e.currentTarget`, so a drag that starts on a button still pans the canvas.
- `PhotoCanvas` (`src/_pages/home/ui/photo-canvas.tsx`) passes the tiles as `children` of `CanvasViewport` and computes `bounds` from the same `ProjectImage[]` that carries each tile's `x/y/width/height` — the rectangle a tile needs to be focused on is already in hand.
- The other consumer, `src/features/explore-homelab/ui/homelab-canvas.tsx`, must be unaffected.
- Tests run under plain vitest with no DOM environment (`vitest.config.mts` sets only the `@` alias), so anything to be unit-tested has to be a pure function.

## Goals / Non-Goals

**Goals:**

- One reusable "bring this world rectangle into view" action in the shared canvas, with the geometry as a pure, testable function.
- Additive shared-canvas API: existing props and behavior unchanged, homelab untouched.
- Keyboard activation that rides on native button semantics rather than a hand-rolled key handler.

**Non-Goals:**

- No persistent "selected tile" styling (outline, dimming of the others) and no selection state in `PhotoCanvas` — activation is a one-shot camera move, so the component needs no state at all.
- No change to the canvas zoom limits, the wheel/pinch behavior, or the footer controls.
- No lightbox, no next/previous tile navigation, no deep link to a tile.
- No focus behavior added to the homelab canvas.

## Decisions

### An imperative handle on `CanvasViewport`, not a declarative `focus` prop

`CanvasViewport` gains one optional prop — a ref receiving a handle, e.g. `canvasRef?: Ref<CanvasHandle>` with `interface CanvasHandle { focusRect(rect: CanvasBounds): void; fitView(): void }` — wired with `useImperativeHandle`. `PhotoCanvas` holds the ref and each tile's activation handler calls `canvasRef.current?.focusRect({ x: image.x, y: image.y, w: image.width, h: image.height })`.

Alternatives considered:

- **Declarative `focus: CanvasBounds | null` prop.** Rejected: it forces `PhotoCanvas` to hold selection state, and then the "activate the same tile again after panning away" scenario breaks — the prop value would be unchanged, so no effect would run. Making it work needs a nonce or a reset-on-interaction callback, which is more machinery than the ref for a one-shot camera move.
- **React context published by `CanvasViewport` and consumed by tiles.** Rejected as unnecessary: the tiles are written by `PhotoCanvas`, the same component that owns the viewport, so a plain ref reaches them without a provider. Context stays available later if an unrelated consumer ever needs it.

### The geometry is a pure function in the model

Add `focusTransform({ rect, viewport, scale })`-shaped pure helper next to the hook (same file or a sibling `model/` module) computing:

- `scale = min((viewportWidth - 2 * PADDING) / rect.w, (viewportHeight - 2 * PADDING) / rect.h, 1)`, reusing the existing `PADDING = 24` and the existing "never upscale past 1:1" cap that `computeFitScale` already applies;
- then the hook passes that through the existing `clampScale`, which is what makes the "tile larger than the zoom ceiling" scenario fall out: the tile is centred at the ceiling instead of overshooting it;
- `x = viewportWidth / 2 - (rect.x + rect.w / 2) * scale`, `y = viewportHeight / 2 - (rect.y + rect.h / 2) * scale`.

For SwapRat's real numbers (1920x1080 tiles, dialog canvas roughly 900x600) the needed scale is about `0.44`, comfortably under the current ceiling of `0.8`, so no constant needs changing. A vitest case covers the centring, the 1:1 cap and the ceiling case without a DOM.

### Animation by CSS transition on `.world`, toggled by the hook

The hook exposes an `isAnimating` flag; `CanvasViewport` puts a class on `.world` while it is set, and `infinite-canvas.module.css` gives that class `transition: transform 280ms cubic-bezier(0.2, 0, 0, 1)`. `focusRect` writes the target transform through `setTransformImmediate` (not the rAF-batched path) so the class and the destination land in the same commit and the browser interpolates from the committed transform.

The flag is cleared on the world's `transitionend` and by a fallback timer, and — this is the part that matters for feel — immediately by `onPointerDown` and by the wheel handler, so a gesture during the glide drops the transition and tracks the pointer exactly. Drag, wheel and pinch never set the flag, so they stay unanimated as today.

Alternatives considered: a rAF tween inside the hook (more code, re-renders every frame, and duplicates what the compositor does for a transform-only transition); the Web Animations API on the world element (fights the React-owned `style.transform` and needs a commit step when it finishes).

Reduced motion is read at call time with `window.matchMedia("(prefers-reduced-motion: reduce)").matches` — the same `matchMedia`-at-the-moment style already used for `MOBILE_QUERY` in this hook — and simply skips setting the flag. No subscription, because nothing needs to re-render when the preference changes between clicks.

### Tiles become real `<button type="button">` wrappers

Each tile renders as an absolutely positioned `button` (taking over `left/top/width/height` from `.photo`) containing the `img`. A native button gives Enter/Space, the disabled-free default tab order and the focus-visible ring the shell CSS already styles (`.shell button:focus-visible`) — and it is the element the existing pointer-capture and click-suppression code already special-cases by selector, so drag-to-pan from a tile keeps working with no change to the hook's gesture code.

The accessible name moves to the button (`aria-label` = the tile's localized `alt`) and the `img` becomes decorative (`alt=""`), so the description is announced once, as the button's name. The canvas's own key handler already ignores events whose `target` is not the viewport itself, so a tile's Enter/Space never collides with the canvas keys, and the canvas keys keep working when the viewport has focus.

Alternatives considered: `role="button"` + `tabIndex={0}` on the `img` (needs a hand-written key handler and an `alt` doubling as the name of an interactive element); a single delegated click handler on the world (no keyboard story at all).

### Layer placement

`focusRect`, the geometry helper and the animation flag live in `src/shared/ui/infinite-canvas` and are exported through its existing `index.ts` public API (`CanvasHandle` type alongside `CanvasViewportProps`). `PhotoCanvas` stays in `_pages/home` and consumes only that public API, which keeps the FSD import direction intact and `steiger` quiet.

## Risks / Trade-offs

- **The transition leaks onto transforms it should not animate** (mount fit, resize re-centring, drag) → the class is only ever on while a focus move is in flight, and every gesture entry point clears it; the mount/resize path keeps using `setTransformImmediate`/`updateTransform` without the flag.
- **A tile activated mid-drag** → already prevented by the existing capture-phase `moved.current` guard; the pinch case is covered too because a second pointer sets `moved.current = true`. Worth an explicit manual check rather than new code.
- **30+ tiles become 30+ tab stops inside the dialog**, ahead of the footer controls → accepted: it is what makes the tiles reachable at all, the dialog already traps focus, and the tab order follows the tiles' reading order in the images array. If it proves noisy, a later change can add roving tabindex; that would not change this change's specs.
- **Animating a transform over a world of 30 large images could jank on a weak device** → only `transform` is animated (compositor-friendly), the duration is short, and reduced-motion users skip it entirely.
- **A tile whose declared `width`/`height` disagrees with the served file** would be centred on the wrong rectangle → not a new risk: `project-photo-canvas` already requires declared sizes to match the files, and layout already depends on it.

## Migration Plan

Not applicable — additive UI behavior, no data, no config, no API surface consumed outside this repo. Rollback is a revert; the new `CanvasViewport` prop is optional, so reverting `PhotoCanvas` alone also restores the old behavior.
