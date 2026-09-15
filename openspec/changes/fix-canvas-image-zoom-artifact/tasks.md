## 1. Confirm the repro and root cause

- [x] 1.1 Reproduce the artifact locally on the project photo canvas: open a project with several photos, zoom out well below the fitted view, activate a tile, and confirm a visible flash/stale-frame appears during the glide (verified by direct observation, ideally captured on video/screen recording at a slowed frame rate for a clear before/after comparison)
- [x] 1.2 Confirm activating a tile from the fitted view (no prior zoom-out) does not show the artifact, establishing the before/after baseline described in `proposal.md`

## 2. Apply the layer-promotion fix

- [x] 2.1 Add a layer-promotion hint (`will-change: transform`, falling back to `transform: translateZ(0)` if needed) to `.world` in `src/shared/ui/infinite-canvas/ui/infinite-canvas.module.css`, keeping the existing `.world.animating` transition unchanged
- [x] 2.2 Re-run the repro from 1.1 and verify the flash/stale-frame no longer appears when activating a tile from a scale well below the fitted view
- [x] 2.3 Verify activating a tile from the fitted view, and repeated activation/pan/re-activation per the `project-photo-canvas` "Activating a tile brings that tile into view" scenarios, still glides correctly with no new visual regression

## 3. Cross-browser and reduced-motion verification

- [ ] 3.1 Verify the fix on at least one Chromium-based and one WebKit-based browser, per `design.md`'s noted risk that compositor behavior is engine-specific
- [x] 3.2 Verify a visitor with `prefers-reduced-motion: reduce` still gets an immediate, unanimated jump to the tile with no artifact (the "Activating a tile with reduced motion asked for" scenario is unaffected)
- [x] 3.3 Verify starting a pan or wheel-zoom mid-animation still stops the animation and hands control to the gesture with no lag, per the "Panning while the canvas is animating" scenario

## 4. Regression check on the other canvas consumer

- [x] 4.1 Spot-check `HomelabCanvas` (`src/features/explore-homelab/ui/homelab-canvas.tsx`), which shares `CanvasViewport`/`.world`, to confirm the CSS change introduces no visual or performance regression there, even though it has no animated move-to-tile requirement of its own
