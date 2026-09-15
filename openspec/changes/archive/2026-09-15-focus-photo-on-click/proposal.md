## Why

A project's photo canvas opens fitted to the whole set, where a 1920x1080 tile is drawn at roughly a tenth of its size and nothing on it is readable. The only way to actually look at a screen today is to aim the wheel or the pinch at it and zoom by hand, which is fiddly on a trackpad and near impossible on a phone inside the dialog. A visitor who taps a tile is asking to see that screen, so the tap itself should bring the canvas to it.

## What Changes

- Activating a tile on a project's photo canvas moves the canvas to that tile: the canvas zooms so the tile fills the viewport and centres it, instead of leaving the visitor to aim the zoom themselves.
- Activation cycles: activating a different tile moves to that tile, and activating the tile the canvas is already sitting on changes nothing. Returning to the whole set stays the job of the existing "Fit all" control and the `0` key; the dialog keeps `Escape` for closing itself.
- The move is animated (~280 ms, eased) rather than a jump, and is instant for a visitor who asks for reduced motion. Hand-driven panning, wheel zoom and pinch stay unanimated and cancel an animation in flight.
- Tiles become keyboard-activatable: each photo is wrapped in a real button carrying the photo's localized description, so `Tab` reaches it and `Enter`/`Space` moves the canvas to it. Dragging across a tile still pans and does not count as an activation.
- The shared infinite canvas grows one internal capability to support this — an imperative "bring this rectangle into view" entry point exposed to the canvas's owner. The homelab canvas, the other consumer, is untouched and keeps behaving exactly as it does now.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `project-photo-canvas`: adds requirements for activating a tile to bring it into view (zoom-to-tile, cycling between tiles, animated transition honouring reduced motion) and for tiles being keyboard-activatable without breaking drag-to-pan. The existing requirement about a tile being legible at full zoom and described in the visitor's language is extended so the description is carried by an activatable control.

## Impact

- `src/_pages/home/ui/photo-canvas.tsx` — tiles become buttons with an activation handler that asks the canvas to bring the tile's rectangle into view.
- `src/_pages/home/ui/photo-canvas.module.css` — positioning moves from the image to its wrapping button; focus-visible styling.
- `src/shared/ui/infinite-canvas/model/use-canvas-transform.ts` — new `focusRect` action plus the animation flag and the cancel-on-manual-interaction rule.
- `src/shared/ui/infinite-canvas/ui/canvas-viewport.tsx` and `src/shared/ui/infinite-canvas/index.ts` — a new optional handle prop and its exported type; existing props unchanged.
- `src/shared/ui/infinite-canvas/ui/infinite-canvas.module.css` — transition on the transformed world layer.
- No new dependencies. `src/features/explore-homelab` is unaffected.
