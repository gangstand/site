## Context

See `proposal.md` — Why. The relevant state carried in from the previous pass:

**The geometry is already decided and shipped.** `swaprat.ts` holds `TILE_WIDTH 1920`, `TILE_HEIGHT 1080`, `COLUMNS 5`, `GAP 120`, and derives every `x`/`y` from `packColumns`. `column-layout.ts` and its unit test exist and pass. Nothing about the layout is being redesigned here — only the `shots` list is refilled.

**Capture method is settled by measurement, not preference.** The app's content pane always fills exactly to the emulated viewport height, so a native 1920×1080 capture and "capture tall, then crop the top 1080" were verified pixel-equivalent for the visible frame. The native capture is therefore the simpler of two equivalent options and needs no crop step.

**Two costs from the previous pass dominate and are what this change targets.** The per-screen audit (pixel diffs, contact sheets, reading every capture back, bottom-strip review) caught almost nothing that the capture-time assertion would not have caught, and running the full check suite between screens repeated the same green result 27 times.

**Two failure modes are real and cheap to guard.** A capture that exceeds the tool budget wedges that page permanently — every later capture on it hangs, including small ones. And a mouse left over a help icon leaves a tooltip painted over the page header; this contaminated at least one shipped tile last pass.

## Goals / Non-Goals

**Goals:**
- One pass per screen, ending with the tile already in `public/` and its entry already in the config — no scratch directory, no deferred swap.
- A single capture-time gate per screen that is specific enough to catch the actual failure modes (wrong tab, unpopulated view, leftover tooltip) and nothing more.
- A progress line to the user after each screen, so the run is legible without the user asking.

**Non-Goals:**
- Any change to `packColumns`, `PhotoCanvas`, `infinite-canvas`, or the tile geometry.
- Re-litigating tile height. 1920×1080 is fixed; screens taller than that are captured from the top, as already shipped.
- Restoring content that sits below the 1080 fold on long reports. That trade-off was accepted when the uniform grid was chosen.
- A committed scraper or any CI dependency on the external demo.

## Decisions

### Capture natively at 1920×1080, one screen at a time, straight into `public/`

Emulate the viewport at exactly `1920x1080x1`, drive the screen, screenshot, convert to webp at quality 82, write to `public/projects/swaprat/<name>.webp`, then append the entry to `shots` in `swaprat.ts`.

Writing directly into `public/` — rather than a scratch directory swapped in at the end — is what makes the loop reportable: after each screen the canvas is one tile richer and can be opened. The previous pass's staged-then-swapped approach existed to keep a known-good set intact while a risky full-set rebuild ran; that risk is gone now, because the set being replaced is a single tile and the old 27-tile set is recoverable from git history either way.

*Alternatives considered:* Scratch-then-swap, as before — defers all feedback to the end and buys nothing here. Capture tall then crop — verified pixel-equivalent to the native capture for the visible frame, so it is the same result through an extra step.

### One assertion per screen, chosen to be tab-specific

Before each screenshot, assert in-page that a string unique to that screen's populated state is present — the built report's total, the selected row's detail heading, the tab's own panel title. Not a generic "page loaded" check.

This is sized against the three failures that actually occurred last pass: a report captured before `Сформировать` was pressed, a master–detail pane captured with no row selected, and a tab captured while a different tab was still active. A per-screen string catches all three at the moment they happen, when the fix is one click, instead of at audit time after 27 captures.

The waiter screens need the most care: that page has two independent toggle groups (the `Официант заказа`/`Официант блюда` dimension and the `Анализ продаж…`/`Настройки смен`/`Расчёт смен` view), and several of its views share the same table above the fold. The assertion for those must key on the view-specific panel, not on the shared table.

### Blur before every capture

Call `document.activeElement.blur()` and move focus off any help affordance before the shutter. A leftover tooltip is invisible to every assertion about content — it is an overlay — so it is prevented rather than detected.

### Verify once, at the end

`npm run typecheck`, the test suite, and `npm run architecture` run after the last tile, together with a single pass that every declared entry resolves to a real file at 1920×1080 and that no file in the directory lacks a config entry. Running these per screen produced 27 identical green results last pass.

*Trade-off accepted:* a mistake made at screen 3 surfaces at the end rather than immediately. Cheap to absorb — the fix is recapturing one screen, and the per-screen assertion already covers the failure modes that would otherwise get that far.

### Keep the pinned period and the wedged-page rule

Every screen is captured under Месяц, 16.08.2026 — 14.09.2026 — the range with representative data, and the reason tile totals agree with each other. Note that the period resets per section in this app, so it is re-pinned when entering a section rather than assumed sticky.

If a capture times out, the page is discarded and a fresh one opened. Retrying on a wedged page costs minutes and always fails.

## Risks / Trade-offs

- **The canvas sits partially filled between steps** → local-only until committed; the run ends with the full set before anything is pushed.
- **The demo is external and drifts** → the set stays a point-in-time snapshot; the capture date and pinned period are recorded with the change.
- **A stray tooltip is invisible to content assertions** → prevented by blurring before capture rather than detected afterward.
- **Several waiter views share the same above-the-fold table** → their assertions key on view-specific panels; where a view's distinguishing content falls entirely below the fold, that is a known consequence of the fixed 1080 tile and is not treated as a capture defect.
- **Deferring the check suite to the end** → accepted deliberately; see the decision above.

## Migration Plan

1. Work screen by screen; after each, the tile is in `public/` and its entry in `swaprat.ts`.
2. After the last screen, run typecheck, tests, architecture, and the declared-vs-actual file check.
3. Record the capture date and pinned period with the change.
4. Rollback is `git checkout` of `public/projects/swaprat/` and `swaprat.ts` — the working tree is the only thing touched until the user commits.
