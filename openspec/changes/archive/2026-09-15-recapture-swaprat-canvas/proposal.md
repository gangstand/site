## Why

The SwapRat canvas currently holds 20 viewport-sized screenshots (1600×1000 CSS, 2000×1250 px) laid out on a uniform 4×5 grid. Several tiles show a half-empty screen because the app defers work behind a button (`Сформировать`, `Загрузить`, `Загрузить чеки`) or behind a selection in a master–detail pane, and one whole analysis tab (Комбо-анализ) was dropped for that reason. The set was also captured at the operator's screen DPR and downscaled, which is not reproducible on another machine.

The canvas is the only place a visitor sees what SwapRat actually does. Showing half-loaded screens undersells the product.

## What Changes

- Recapture every SwapRat demo screen at a fixed **1920×1080** viewport instead of the old 1600×1000. Every tile shares this exact size, so the set reads as one system and the grid stays uniform.
- Before capturing, drive each screen into its **fully populated state**: press the report-generating control, select a row in every master–detail pane so the detail side is never an empty prompt, and expand the inline explainer blocks.
- Broaden coverage from 20 tiles to **every screen plus every tab and revealed state**, including the previously dropped Комбо-анализ (with checks loaded) and «Что с чем покупают» (with a dish selected).
- A screen whose content is taller than 1080 CSS px is captured from the top, so its primary content is in frame; a screen shorter than 1080 is padded with the app's own background rather than left as dead canvas space.
- Layout stays a uniform grid — same idea as the old 4×5 grid, sized for the new tile dimensions and the larger tile count (5 columns).
- Retire the 20 current `public/projects/swaprat/*.webp` files and replace them with the new set.

## Capabilities

### New Capabilities
- `project-photo-canvas`: what the photo canvas inside a project's detail dialog must present — that a tile is populated rather than an empty prompt, that every tile in a project shares one fixed capture size, that the layout places them in a grid without overlap or dead space, and that each tile carries a localized description.

### Modified Capabilities
<!-- None. `project-showcase` governs the home page list and its thumbnails; this change does not alter a thumbnail, its declared size, or how an entry is announced. -->

## Impact

- **Assets**: `public/projects/swaprat/` — all 20 existing screenshots replaced with 27 files at a uniform 1920×1080. Payload grows from ~1.9 MB to ~2.1 MB, paid only when a visitor opens the SwapRat dialog (`projects.tsx` mounts `ProjectDetailDialog` only for the active project), never on home page load.
- **Config**: `src/_pages/home/config/swaprat.ts` — the `shots` list and the grid formula that derives `images` are both replaced; every image now shares one declared width/height.
- **Shared canvas**: `src/_pages/home/ui/photo-canvas.tsx` and `src/shared/ui/infinite-canvas/` already position each image from its own `x`/`y`/`width`/`height` and derive bounds from the min/max of the set, so no component change is needed.
- **Source of truth**: the SwapRat demo at `https://app.swaprat.ru/`, entered through «Посмотреть демо-режим» (no credentials), demo tenant «Ресторан Веранда».
- **Not affected**: `public/projects/swaprat/thumbnail.webp` and its declared `thumbnail` dimensions; the other four projects, whose `images` stay empty.
