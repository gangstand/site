## Context

See `proposal.md` — Why. What shapes the approach is that the copy being changed is not text: it is antialiased glyphs composited over a gradient inside a lossy WebP, and the file that produced them no longer exists.

The constraints that follow from the repo as it stands:

- `openspec/changes/archive/2026-09-14-add-homelab-thumbnail/` records the recipe that produced the current asset — capture through the dialog, compose in a throwaway HTML sheet, render at DPR 2, downscale to 994 wide, encode WebP. It records the copy and the output dimensions, but **not** the sheet's geometry: padding, type scale, line-height, frame radius and the gradient stops were never written down and the sheet itself was explicitly not committed.
- The committed `public/projects/homelab/thumbnail.webp` (994 × 644, 31 KB) is therefore the only surviving record of that geometry. It is readable: the layout is measurable off the pixels.
- The map still cannot be sourced from that file at full quality — it is already downscaled and lossily encoded. A fresh capture is the chosen source (see proposal, *What Changes*).
- `HomelabCanvas` is rendered `embedded` inside the dialog with `fitOnMount`, and the map has no URL of its own — `homelab-map` requires that the site serve no dedicated homelab page. The shoot goes through the project dialog, as before.
- Tooling is present and needs nothing new: ImageMagick 7.1.2 with a working WebP write delegate (libwebp 1.6.0), ffmpeg 9.0.1 as the fallback the archived recipe names, and Geist Sans under `node_modules/geist/dist/fonts/geist-sans`.

## Goals / Non-Goals

**Goals:**

- Replace both baked lines while leaving the thumbnail recognisably the same artefact — same ground, same type treatment, same framed-still rhythm — so the swap reads as a copy edit and not as a new thumbnail.
- Recover the sheet geometry from the committed asset and **write the measured numbers into `tasks.md`**, so the next re-bake starts from recorded values instead of re-deriving them a third time.
- Leave the declared dimensions in `homelab.ts` agreeing with the file that ships, whatever the new height turns out to be.

**Non-Goals:**

- Not committing the bake sheet, a capture script, or any npm task. The archived change made that a standing non-goal and nothing here overturns it; the durable record is the measured geometry in `tasks.md`, which survives in the archive as text.
- Not re-cutting the other four thumbnails, and not touching the Russian-only baking of the set.
- Not editing `homelab.description.ru`, even though the new headline crowds it (proposal, *Flagged, not changed*).

## Decisions

### Re-bake the whole sheet rather than patch the text band in place

The old headline and supporting line occupy a band above the framed map. Overwriting just that band with ImageMagick — erase to the gradient, draw the new lines — is the smallest possible edit and is rejected anyway.

Erasing cleanly requires reproducing the exact gradient underneath the glyphs, which is a lossy WebP's interpolated approximation of the original, not a formula. Drawing back requires Geist Sans at the exact size, weight, tracking and line-height of the original — the values this change is measuring, but measured to within a pixel rather than within a few percent, because the new band sits directly beside untouched pixels and any drift shows as a seam. And the headline is the line most likely to change height, which cascades into the frame position regardless.

A full re-bake pays the capture cost once and gets a composition that is internally consistent.

### Recover the geometry from the committed asset, by measurement

Before writing the new sheet, the current `thumbnail.webp` is measured: side padding, the headline's cap height and baseline positions, the gap to the supporting line, its size, the gap to the frame, the frame's inset and corner radius, and the gradient's endpoint colours (sampled at the corners). These become the sheet's declared values.

*Alternative — rebuild by eye against a screenshot.* This is what produced the drift risk in the first place. Measuring costs one pass with `magick` and a crop/inspect loop and removes the guesswork.

*Alternative — reconstruct from the archived design's prose.* It names Geist Sans, bold headline, regular supporting line, light blue-to-white gradient, rounded frame. That is enough to make something similar and not enough to make something that matches. Prose is the fallback where a measurement is ambiguous, not the source.

### Author the headline in sentence case and let the sheet uppercase it

The archived task recorded the headline as `Свой дата-центр дома, под полным контролем` while the rendered asset shows it in capitals, so the sheet applies the uppercase transform rather than carrying pre-uppercased text. The new headline is authored the same way — `Собственная инфраструктура для домашних сервисов`, uppercased by the sheet — keeping one mechanism and one place where the casing decision lives.

The requested copy arrived in capitals; that is how it renders, and nothing about the rendered result differs. Sentence case in the source keeps the string readable for whoever edits it next.

### Let the composed height follow the content, then reconcile the config

The new headline is longer than the old (47 characters against 42) and the new supporting line shorter (68 against 82). At the measured column width the headline most likely still wraps to two lines and the supporting line still fits on one, which would land the sheet back on 644 — but *most likely* is not a number to declare in a config.

So: measure the composed content height at 1×, set it explicitly on `html`/`body`/`.sheet` before capturing (the archived recipe records that an unset height tiled the capture 2×2), render, and whatever `identify` reports for the encoded file is what `homelab.ts` declares. If it is 644, the config edit is a no-op and the change ships as one binary.

*Alternative — pin the height to 644 and let the headline shrink or the frame crop to fit.* Rejected. `project-showcase` already grants this thumbnail the right to differ in proportion from its neighbours, and it does not grant the frame the right to crop the map or the headline the right to fall below legibility at 0.45 scale.

### Keep the fresh capture faithful to the recorded capture environment

Window 1920 × 1200, device pixel ratio 2, default dark palette (no `light-theme` on `documentElement`), details pane dragged narrow so the canvas region is at least 1400 CSS px wide, `/api/homelab/status/` answered before the shutter so the site indicators read as resolved rather than a wall of "unknown". These are the archived values; reusing them keeps the new still framed like the old one, which is what makes the swap read as a copy edit.

The indicators are frozen into the asset exactly as before — small enough to be below legibility at the rendered column width, and one click from the live truth.

## Risks / Trade-offs

- **The measured geometry is slightly off and the new thumbnail sits visibly apart from its neighbours** → verification is comparative, not absolute: the new asset is opened beside `esaul` and `swapdog` at the list's real widths, and beside the *old* homelab asset, before it is accepted.
- **A fresh capture frames the map differently from the old still, so the change reads as a new thumbnail rather than a copy edit** → the capture parameters are pinned to the archived values, and the accept test includes holding the new still against the old one.
- **The composed height changes and `homelab.ts` is not updated with it** → the config value is read back from `identify` on the committed file, not from intent, and `project-showcase` already requires declared dimensions to match the served file.
- **The new supporting line is a category list, which is vaguer than nine product names** → this is the point of the change, and the spec now states it: the line's job is what the estate runs, not what fills each slot. The product names remain visible in the map still and in the live map the thumbnail opens.
- **The new headline crowds the caption beneath it** → flagged in the proposal, left as the user's call; the cheap fix afterwards is the caption string, not another bake.
- **The bake sheet is thrown away a second time** → mitigated by recording the measured geometry in `tasks.md`, which the archive keeps. Committing the sheet is still refused, so a third re-bake still rebuilds a file — but from numbers, not from pixels.
- **A scratchpad artefact leaks into the repo** → the accept test includes a `git status` check that the only changed paths are the thumbnail and, if its height moved, `homelab.ts`.

## Migration Plan

No runtime migration. The change ships as one commit: the re-baked binary, plus the `homelab.ts` dimensions if and only if the height moved. Rollback is reverting that commit; the old asset and the old declared dimensions come back together, so there is no intermediate state where the declared size disagrees with the served file.
