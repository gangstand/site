# Capture snapshot

The `public/projects/swaprat/*.webp` set (excluding `thumbnail.webp`) shipped by this
change is a point-in-time snapshot of the SwapRat demo, not something to diff against
later. If the demo's data or layout drifts, recapture rather than reconcile.

- **Capture date:** 2026-09-15
- **Demo tenant:** «Ресторан Веранда» (demo mode, no credentials)
- **Pinned reporting period:** Месяц, 16.08.2026 — 14.09.2026 (used for every screen so
  totals across tiles stay consistent)
- **Tile size:** every tile 1920×1080, cropped from the top or padded with the app's
  background to that fixed size (see `design.md` — "Crop or pad every capture to a
  fixed 1920×1080 tile")
