# Capture snapshot

The `public/projects/swaprat/*.webp` set (excluding `thumbnail.webp`) shipped by this
change is a point-in-time snapshot of the SwapRat demo, not something to diff against
later. If the demo's data or layout drifts, recapture rather than reconcile.

- **Capture date:** 2026-09-15
- **Demo tenant:** «Ресторан Веранда» (demo mode, no credentials)
- **Pinned reporting period:** Месяц, 16.08.2026 — 14.09.2026 (used for every screen so
  totals across tiles stay consistent; re-pinned per section since the app resets the
  period when entering a section)
- **Tile size:** every tile 1920×1080, captured natively at that viewport size (no
  crop/pad step — verified pixel-equivalent to crop-from-tall for the visible frame)
- **Capture method:** per-screen loop — drive each screen into its populated state,
  blur focus, assert a screen-specific string, screenshot straight to webp q82 in
  `public/projects/swaprat/`, append the config entry immediately. No scratch
  directory, no per-screen check-suite run, no pixel diffing.
- **Known trade-off:** `Расчёт смен` (7.5) shows the visible top of the tab rather than
  the `Расчёт смен:` heading itself, which renders below the 1080px fold on that view —
  a consequence of the fixed tile height, not a capture defect.
