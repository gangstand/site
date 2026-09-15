## Context

See `proposal.md` — Why. The constraints that shape the approach were measured against the live demo rather than assumed:

**The demo is a fixed-height app shell, so "full page" does not mean what it usually means.** On the dashboard, `document.documentElement.scrollHeight` equals the viewport height (1000), while an inner container reports `clientHeight 1000 / scrollHeight 1997`. The page does not scroll; a pane inside it does. A `fullPage` screenshot therefore returns exactly the viewport crop we already have.

**The capture window cannot simply be made taller by resizing.** Asking the browser for a 1600×2100 window left `window.innerHeight` at 1000 — the host screen caps it.

**CDP viewport emulation does work.** Overriding the viewport to `1920×2100` produced `innerHeight: 2100`, and the 1997-pixel inner scroller collapsed into the page — its content became fully laid out rather than clipped. A capture at that setting returned a 1920×2100 file holding the whole dashboard. Two small lists (`clientHeight 200 / scrollHeight 300`) kept their own scrollbars.

**The canvas already supports uniform tiles at any shared size.** `PhotoCanvas` derives its bounds from the min/max of the images' own `x`/`y`/`width`/`height`, and `.photo` is absolutely positioned with `max-width: none`. Nothing in `src/shared/ui/infinite-canvas/` assumes a particular tile size.

**Maximum zoom is a floor, not a multiple.** `useCanvasTransform` clamps to `max(fitScale × 3, 0.8)`. A large world makes `fitScale` small, so the effective ceiling is 0.8 regardless of how big the canvas grows — which fixes how much pixel detail a tile needs.

**Nothing is paid on the home page.** `projects.tsx` renders `ProjectDetailDialog` only for the active project, so the whole image set is fetched when a visitor opens SwapRat, never before.

## Goals / Non-Goals

**Goals:**
- A capture recipe deterministic enough that re-running it on another machine yields the same pixel geometry, rather than inheriting the operator's screen DPR.
- A uniform grid — every tile the same declared size — so the canvas reads as one system, the same property the original 4×5 grid had.
- Declared dimensions in config provably equal to the files on disk.

**Non-Goals:**
- A committed scraper or scheduled job against the external demo. The set is a point-in-time snapshot taken by hand; the demo is not ours to depend on in CI.
- Any change to `src/shared/ui/infinite-canvas/` or to `PhotoCanvas` itself.
- A light-theme variant of the set (declined).
- Filling the other four projects' canvases, or writing the "О проекте" copy that is still a placeholder.
- Showing the entire length of a screen taller than the tile frame — a tile is a fixed 1920×1080 window onto the screen's top, not a full-page capture (see the crop decision below).

## Decisions

### Capture by viewport emulation in two passes, not `fullPage`

For each screen: drive it into its populated state, **probe** the height its content wants, then re-emulate the viewport at that height and capture the viewport at its full extent, before cropping or padding it down to the shared tile size (see below).

The probe reads the tallest `scrollHeight` among the shell's scroll containers rather than `document.scrollHeight`, because the document never grows. Re-emulating at that height collapses the container, so a plain viewport screenshot now contains the whole screen — this is what feeds the crop/pad step, rather than capturing at 1920×1080 directly, so a screen's real layout (donut charts, expanded panels) is what gets cropped, not a premature clip.

*Alternatives considered:* Window resizing — capped by the host screen (a request for 1600×2100 left `innerHeight` at 1000). Injecting CSS to unfreeze the shell (`height: auto; overflow: visible`) — works in principle but mutates the layout being photographed, risking reflow artifacts in a picture whose whole job is to be faithful.

### Why no full-page capture tool works here, whatever its name

Three tools from the same family were evaluated and all fail for one shared reason, so this is recorded once rather than re-litigated per tool.

They all reach content below the fold by scrolling **the window** and stitching the frames. On this app the window does not scroll. Measured directly:

```
window.scrollTo(0, 5000)   ->  window.scrollY stays 0
document.scrollHeight 1025  ==  window.innerHeight 1025
inner container:  clientHeight 1025 / scrollHeight 1997
inner.scrollTop = 5000      ->  clamps to 972   (it scrolls, but only programmatically)
```

- **`fullPage: true` / DevTools «Capture full size screenshot»** (device toolbar at 1920×1080): returns a 1920×1080 file. Verified, not assumed — the capture was taken and measured.
- **A full-page capture browser extension** (GoFullPage or any equivalent): relies on the same window scroll, so it would stitch repeats of the first screen. It also cannot be driven from here at all — CDP refuses to navigate to `chrome-extension:` URLs, an extension's toolbar button is browser UI rather than page content, and the automation browser runs a clean profile without the operator's extensions.

The 972 px of content the standard technique cannot reach is exactly what the tall-viewport approach recovers — and that taller capture is the source the final 1920×1080 tile is cropped from, not a viewport screenshot taken directly at 1080.

### Capture at 1920 CSS px wide with DPR 1

Emulate 1920 CSS px wide at DPR 1, emitting 1920 native px, and declare the tile 1920 wide. No downscale, no DPR trick.

**1920 changes what the app renders, not just how much fits.** At 1920 the dashboard draws «Выручка по группам товара» and «Наценка по группам» as donut charts; at 1600 the same panels degrade to plain bar lists. The wider viewport buys a richer product, not merely a wider photograph.

**Declaring the tile at its native width makes the density automatic.** Maximum zoom is the fixed 0.8 floor, so a tile declared `W` wide renders at `0.8 × W` CSS px, and native-equals-declared always yields `1 / 0.8 = 1.25×` density at full zoom — the ratio the current set already demonstrates as legible on dense tables. This holds at any width, which is why no DPR multiplier is needed.

The existing set was captured at the operator's DPR of 1.667 and downscaled from 2667 px; that is reproducible on no other machine. Pinning the viewport makes the pipeline machine-independent.

*Alternatives considered:* 1600 CSS × DPR 1.25 → 2000 px — equivalent density and was the earlier choice here, but loses the donut charts and the three lower dashboard panels. DPR 2 — rejected on evidence; see the next decision.

### Cap a raw capture at 3000 CSS px of height, and treat an oversized capture as fatal to its page

A screen that probes taller than 3000 CSS px is captured in two tiles at a deliberate seam rather than as one extreme strip. Two independent reasons set the ceiling.

The layout reason: an extreme strip is wasted work once the tile is cropped down to a fixed 1920×1080 frame anyway (see below) — only the top 1080 px of it will ever be shown.

The mechanical reason, found the hard way: a 3200×4200 capture (DPR 2) did not merely run slow — it exceeded the tool budget, and every subsequent capture on that page hung too, including a plain 1600×1000 one and one taken after clearing the emulation override. The oversized capture wedges the renderer permanently. A fresh page opened against the same URL captured instantly.

So the rule has two halves: stay under roughly 8 megapixels per capture (3000 CSS px at 1920 wide is 1920×3000, a comfortable 5.8), and if a capture ever does time out, abandon that page and open a new one rather than retrying on it — retries on a wedged page cost minutes and always fail.

### Crop or pad every capture to a fixed 1920×1080 tile

Every raw capture — whatever height the populated screen actually needs — is normalized to exactly 1920×1080 before it becomes a tile: a capture taller than 1080 is cropped from the top (the screen's header and primary panels, which is what a visitor sees first, stay in frame; a long table's lower rows do not); a capture shorter than 1080 is padded below with the app's own dark background color rather than left as an odd-sized tile.

This trades the previous full-page goal (every pixel of every screen, however long) for a uniform grid at a standard, recognizable resolution (1920×1080) — the same trade the original 20-tile set made at 1600×1000, just at a size that matches what the product actually renders. A visitor who wants the full length of a long report still sees its top — the summary and the first rows of its table — which is what a real user glances at first.

*Alternatives considered:* Keeping full variable height per tile, packed into columns by real height — this was the first approach taken and was fully implemented (packing function, per-tile dimensions, non-uniform grid); it was reverted in favor of a uniform grid because a uniform grid reads more like a clean product tour and was preferred over preserving every pixel of the longest reports. Squashing a tall capture to fit 1080 (scale down) — rejected: shrinks text below the legible floor this project already tunes for (see the 1920-width decision) and distorts nothing being distorted only because of tile-count wobble; cropping keeps the pixels that are shown at native density.

### Lay tiles out in a uniform grid

All tiles now share one size (1920×1080), so the layout is a plain grid: a fixed column count, a fixed gap, walked in narrative order. `packColumns` (see below) still does the placement — with every tile the same height it is equivalent to a straightforward row-major grid, but keeping one function means a future non-uniform set (another project) does not need a second layout. Column count (5) is chosen so the resulting world aspect lands near the canvas pane's (~1.1–1.3), the ratio that made the original 4×5 grid fill its pane.

### Move the layout out of the config and into a tested function

Today `swaprat.ts` derives every `x`/`y` from a two-line modulo formula. That moves to a pure function (`packColumns`) under `src/_pages/home/model/` with a unit test covering no-overlap and column balance, so the placement logic is verified independently of the config. The config keeps a declarative `shots` list of file names, localized descriptions, and the shared tile size.

### Record one shared size, then verify every file against it

The tile size (1920×1080) is declared once, and a verification step compares every file on disk against that single pair before the change is considered done. A mismatch on any file is a defect exactly as it would be with per-tile declared dimensions — the shared-size approach only removes the chance of a per-entry typo.

### Pin one reporting period across every screen

Every capture uses the same range (Месяц, 16.08.2026 — 14.09.2026), the range that gives the demo representative data — a single day leaves charts nearly flat. Consistency matters beyond aesthetics: tiles showing different periods would contradict each other's totals.

## Risks / Trade-offs

- **An oversized capture wedges the page permanently**, not just slowly: after one 3200×4200 attempt, every later capture on that page hung, including small ones and ones taken after resetting emulation → hold raw captures under ~8 megapixels, and discard a page that has timed out instead of retrying on it. Keep the probe pass cheap by measuring the DOM, never by screenshotting.
- **Two inner lists do not expand with the viewport** (`clientHeight 200 / scrollHeight 300`) → decide per screen whether the hidden rows carry meaning; where they do, scroll or expand that list before capture.
- **Cropping to 1080 loses the lower portion of the tallest reports** (waiter shift calculation, write-off acts, the Pavesic and Kasavana-Smith matrices, the full dish-sales table) → accepted deliberately in exchange for a uniform grid; the cropped tiles still show the screen's header, controls, and leading rows, which is what a visitor evaluates first.
- **Payload growth.** 27 tiles at 1920×1080 total ~2.1 MB, up from the previous set's ~1.9 MB → measured directly from the files; the increase is modest because every tile is capped to one fixed frame rather than growing with content. Mitigated structurally by the dialog's lazy mount: the home page is unaffected.
- **The demo is external and will drift.** Data, and possibly layout, will differ on a later capture → record the capture date and pinned period with the change, and treat the set as a snapshot rather than something to diff against later.
- **Replacing the whole set at once** → build and verify in a scratch directory first, then swap in one commit; the previous set stays recoverable in git history.

## Migration Plan

1. Produce the new set into a scratch directory; keep `public/projects/swaprat/` untouched until it is verified.
2. Verify: every tile populated, cropped/padded to exactly 1920×1080, declared dimensions equal to the files, fitted view and full-zoom legibility checked in the running app.
3. Replace the 20 existing files with the new set and update the config in one commit.
4. Rollback is `git revert` of that commit — the old files and the old formula return together.

## Open Questions

- Whether the two residual inner lists that keep their own scrollbars need expanding before capture, or whether their first visible rows already convey the screen. Decidable per screen during capture; it changes neither the specs, the approach, nor the task breakdown.
