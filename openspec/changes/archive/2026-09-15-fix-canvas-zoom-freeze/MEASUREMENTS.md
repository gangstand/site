# Measurements

Environment: production build (`next start`), Chromium 1234 driven over the DevTools Protocol,
1440x900 viewport, CPU throttled 20x unless stated. Scenario: SwapRat photo canvas (27 tiles of
1920x1080), zoomed to scale 0.8, then a wheel pan driven one event per animation frame for 90
frames, plus click-to-focus glides. "Commits" are React commits counted through a stub
`__REACT_DEVTOOLS_GLOBAL_HOOK__` installed before the page loads.

## 1. React commits per camera frame (task 1.2, 2.7)

| | wheel pan | glide (click to focus) |
|---|---|---|
| before (HEAD) | **1.01 commits/frame** (70 commits / 69 frames) | 0.28-0.30 commits/frame |
| after (camera moved out of React) | **0.03 commits/frame** (2 / 70) | 0.04-0.11 commits/frame |

The two commits left during a pan are the `isWheeling` mode flag flipping on and off; the scale
readout publishes at most once per 100 ms and only when the value actually changes.

## 2. Rendering pipeline per camera frame (task 1.2, 3.10)

Same scenario, from a `Tracing` capture, summed over `UpdateLayoutTree`, `PrePaint`, `Layerize`,
`Paint`, `Commit`, `CompositeLayers` on the renderer main thread and divided by frames:

| | photos attached | render pipeline | `Layerize` total | frames > 32 ms |
|---|---|---|---|---|
| before (HEAD) | 27 | 9.34 ms/frame | 315.9 ms | 60 / 89 |
| after (culling) | 3 | 8.80 ms/frame | 245.9 ms | 45 / 89 |

Layer work drops by about a fifth and a third fewer frames run long, from attaching 3 photos
instead of 27. The headless compositor understates raster cost — it rasterises far less
aggressively than a windowed browser — so this is a floor on the improvement, not a ceiling.
The wall-clock median stays at 33 ms in both because the 20x throttle dominates.

## 3. Shadow suppression during movement (task 4.2) — dropped

Three paired traces of the same scenario, `.movingCamera .photo { box-shadow: none }` active
versus neutralised by an injected override at the same camera:

| run | shadows dropped | shadows kept |
|---|---|---|
| 1 | 54 long frames, 10.29 ms/frame | 45 long frames, 8.96 ms/frame |
| 2 | 37 long frames, 7.95 ms/frame | 36 long frames, 7.92 ms/frame |
| 3 | 37 long frames, 8.05 ms/frame | 38 long frames, 8.51 ms/frame |

No benefit — the spread between repeats of the same configuration is larger than the difference
between configurations. The class and the CSS rule were removed; `isAnimating` and its place in
`isInteracting` stay, since those are what the canvas reports to its consumers.
