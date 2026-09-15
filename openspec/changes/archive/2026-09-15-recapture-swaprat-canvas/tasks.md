## 1. Capture rig

- [x] 1.1 Open a fresh page on `https://app.swaprat.ru/`, enter via «Посмотреть демо-режим», and pin the period to Месяц 16.08.2026 — 14.09.2026 on the first screen that offers it; verify the dashboard reports 3 007 329 ₽ / 1506 чеков rather than a single-day figure
- [x] 1.2 Establish the probe helper that returns, for the current screen, the largest `scrollHeight` among elements whose `overflow-y` is `auto`/`scroll`; verify it reports ~1997 on the dashboard and that `window.scrollY` stays 0 after `scrollTo(0, 5000)`, confirming the document is not what scrolls
- [x] 1.3 Establish the capture helper: emulate `1920x<probed height + margin>x1`, wait for the layout to settle, screenshot; verify one dashboard capture lands at width exactly 1920 px with no downscale step
- [x] 1.4 Encode the two safety rules from design.md as part of the helper — refuse a capture above ~8 megapixels (split the screen instead), and abandon the page for a fresh one if any capture times out; verify by asserting the guard rejects a probe above 3000 CSS px

## 2. Capture — entry, dashboard, audit

- [x] 2.1 Capture the sign-in screen before entering demo mode; verify the file exists and shows the full card including the demo-mode invitation below it
- [x] 2.2 Capture the dashboard; verify the tile includes «Топ-5 официантов», «Топ-5 блюд», «Распределение оплат» and both group panels, and that the group panels render as donut charts rather than the bar lists 1600 produces
- [x] 2.3 Capture «Аудит опасных операций» with an incident selected; verify the right pane shows the iiko event timeline and the check contents, not «Выберите инцидент слева»

## 3. Capture — Финансы

- [x] 3.1 Capture «P&L / ОПиУ» after pressing «Сформировать» and «Раскрыть все»; verify the tile shows the expanded article tree down to the result section plus the «Куда ушла выручка» breakdown
- [x] 3.2 Capture «Отчёт по ДДС» after «Сформировать» and «Раскрыть все»; verify receipts, payments and closing balance rows are all present

## 4. Capture — Анализ блюд, all six tabs

- [x] 4.1 Capture «Общие продажи»; verify the full dish table is in frame rather than cut at the fold
- [x] 4.2 Capture «Что с чем покупают» with a dish selected in the right-hand search; verify the companion-dish list is populated, not the empty prompt the current set shows
- [x] 4.3 Capture «Комбо-анализ» after selecting menu positions and pressing «Загрузить чеки»; verify the combination results render — this tab is absent from the current set entirely
- [x] 4.4 Capture «ABC-Анализ»; verify class columns and the full ranked table are in frame
- [x] 4.5 Capture «Касавана-Смит»; verify all four quadrants plus the scatter plot and the analytic table below are in one tile
- [x] 4.6 Capture «Метод Павесика»; verify all four quadrants and the detail table below are in one tile

## 5. Capture — Тепловая карта и скидки

- [x] 5.1 Capture «Тепловая карта» after «Сформировать», with the explainer block expanded; verify the full hour×weekday grid and its legend are present
- [x] 5.2 Capture a second heatmap metric beyond «Выручка ₽» (for example «Поток заказов»); verify the grid re-renders with that metric's values
- [x] 5.3 Capture «Скидки по категориям» after «Сформировать», with the discount-type groups expanded; verify the per-type check lists are visible, not just collapsed headers
- [x] 5.4 Capture «Скидки по клиентам» after «Сформировать», with a client opened; verify the per-check detail for that client renders

## 6. Capture — Склад и закупки

- [x] 6.1 Capture «Остатки на складах» after «Сформировать» with «Раскрыть все»; verify product rows under the groups are visible, not only the group totals
- [x] 6.2 Capture «Динамика складских остатков» after «Сформировать»; verify the chart and its period summary are in frame
- [x] 6.3 Capture «Приходные накладные» after «Сформировать» with an invoice expanded; verify the invoice's line items render under its row
- [x] 6.4 Capture «Закупочные цены» after «Сформировать»; verify the full position table including the threshold-breach highlighting is in frame
- [x] 6.5 Capture «Акты списания» after «Загрузить», with «Раскрыть все», a document selected, and «Топ списаний» expanded; verify the right pane shows that document's composition
- [x] 6.6 Capture «Инвентаризации» after «Загрузить», with «Раскрыть все» and a document selected; verify the right pane shows surplus/shortage positions rather than «Выберите инвентаризацию слева»

## 7. Capture — Персонал и кабинет

- [x] 7.1 Capture each tab of «Анализ официантов» («Официант заказа», «Официант блюда», «Анализ продаж в разрезе официантов», «Настройки смен», «Расчёт смен»); verify each tile is populated and the waiter table reaches its last row
- [x] 7.2 Capture «Кабинет»; verify the tile runs to the bottom of the page including the iiko servers and local-cache sections

## 8. Process and measure

- [x] 8.1 Crop or pad every capture to a fixed 1920×1080 and convert to webp at the chosen quality into a scratch directory; verify each output is exactly 1920×1080 and that no file was upscaled
- [x] 8.2 Record each file's real width and height and total the payload; verify the declared numbers come from reading the files, not from the capture request
- [x] 8.3 If the total payload is out of proportion to the value, retune quality and re-measure; verify the final total is recorded in the change before proceeding

## 9. Layout

- [x] 9.1 Add a pure column-packing function under `src/_pages/home/model/` that takes tiles with heights, a column count and a gap, and returns each tile's `x`/`y` by placing it into the shortest column; verify with a unit test that no two tiles overlap and that no column is left shorter by more than one tile's height
- [x] 9.2 Choose the column count that puts the packed world aspect near the canvas pane's (~1.1–1.3) for the shared 1920×1080 tile size; verify by computing the resulting world width and height before touching the config
- [x] 9.3 Remove the modulo grid formula from `swaprat.ts`; verify `npm run typecheck` and `npm test` stay green

## 10. Wire up

- [x] 10.1 Replace the `shots` list in `src/_pages/home/config/swaprat.ts` with the new set, each entry carrying a file name and a ru/en description, sized from one shared 1920×1080 constant; verify every file on disk matches that size
- [x] 10.2 Replace the 20 files in `public/projects/swaprat/` with the new set; verify no orphaned file from the old set remains and no config entry points at a missing file
- [x] 10.3 Run `npm run typecheck`, `npm test` and `npm run architecture`; verify all three pass

## 11. Verify in the running app

- [x] 11.1 Open the SwapRat dialog and confirm every tile loads with `naturalWidth` 1920 and none is broken; verify the count matches the config
- [x] 11.2 Confirm the fitted view fills the canvas pane rather than sitting as a small island, and that no tile overlaps another; verify visually at the default fit
- [x] 11.3 Zoom to maximum on the densest tiles (waiter table, ABC, purchase prices) and confirm figures are legible; verify text is sharp rather than upscaled
- [x] 11.4 Confirm no tile shows an empty prompt or an unpressed report control, and that every cropped tile still reads as a coherent view (header, controls, and leading rows in frame) rather than an awkward cut; verify by reviewing the whole set on one contact sheet

## 12. Close out

- [x] 12.1 Record the capture date and the pinned period alongside the change so the set is identifiable as a point-in-time snapshot; verify the note is present in the change directory
- [x] 12.2 Run `graphify update .`; verify it reports the rebuilt graph without error
