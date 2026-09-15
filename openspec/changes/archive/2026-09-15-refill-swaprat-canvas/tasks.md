## 1. Capture loop setup

- [x] 1.1 Open a fresh page on `https://app.swaprat.ru/`, enter via «Посмотреть демо-режим», emulate the viewport at `1920x1080x1`, and pin the period to Месяц 16.08.2026 — 14.09.2026; verify the dashboard reports 3 007 329 ₽ rather than a single-day figure
- [x] 1.2 Establish the per-screen routine used by every task below — drive the screen into its populated state, blur focus so no tooltip overlays the header, assert the screen's own distinguishing string is present, screenshot, convert to webp q82 straight into `public/projects/swaprat/`, append the entry to `shots` in `swaprat.ts`, report the progress step; verify by running it once end-to-end on the dashboard so that tile and its config entry both exist

## 2. Дашборд и аудит

- [x] 2.1 Capture the dashboard; verify the tile asserts on 3 007 329 ₽ before the shutter and the file lands at 1920×1080
- [x] 2.2 Capture «Аудит опасных операций» with an incident selected; verify the assertion is «Состав чека» so the right pane cannot be the empty prompt

## 3. Финансы

- [x] 3.1 Capture «P&L / ОПиУ» after «Сформировать» and «Раскрыть все»; verify the assertion keys on an expanded article row rather than on the page title
- [x] 3.2 Capture «Отчёт по ДДС» after «Сформировать» and «Раскрыть все»; verify the assertion keys on the closing balance row

## 4. Анализ блюд, six tabs

- [x] 4.1 Capture «Общие продажи»; verify the assertion keys on the dish table being populated
- [x] 4.2 Capture «Что с чем покупают» with a dish selected; verify the assertion is «Совм. чеков» so the companion list cannot be the empty prompt
- [x] 4.3 Capture «Комбо-анализ» after selecting a position and «Загрузить чеки»; verify the assertion keys on the loaded-checks count
- [x] 4.4 Capture «ABC-Анализ»; verify the assertion keys on the class column being rendered
- [x] 4.5 Capture «Касавана-Смит»; verify the assertion keys on a quadrant label
- [x] 4.6 Capture «Метод Павесика»; verify the assertion keys on «Детальная таблица Павесика»

## 5. Тепловая карта и скидки

- [x] 5.1 Capture «Тепловая карта» after «Сформировать» on «Выручка ₽»; verify the assertion keys on the hour×weekday grid being rendered
- [x] 5.2 Capture the same heatmap switched to a second metric (for example «Поток заказов»); verify the assertion keys on that metric's own label so it cannot be confused with 5.1
- [x] 5.3 Capture «Скидки по категориям» after «Сформировать» with the discount-type groups expanded; verify the assertion keys on a per-check row, not a collapsed header
- [x] 5.4 Capture «Скидки по клиентам» after «Сформировать» with a client opened; verify the assertion keys on that client's per-check detail

## 6. Склад и закупки

- [x] 6.1 Capture «Остатки на складах» after «Сформировать» with «Раскрыть все»; verify the assertion keys on a product row inside a group
- [x] 6.2 Capture «Динамика складских остатков» after «Сформировать»; verify the assertion keys on the chart's period summary
- [x] 6.3 Capture «Приходные накладные» after «Сформировать» with an invoice expanded; verify the assertion keys on that invoice's line items
- [x] 6.4 Capture «Закупочные цены» after «Сформировать»; verify the assertion keys on the position table
- [x] 6.5 Capture «Акты списания» after «Загрузить» with «Раскрыть все» and a document selected; verify the assertion keys on that document's composition
- [x] 6.6 Capture «Инвентаризации» after «Загрузить» with a document selected; verify the assertion keys on surplus/shortage rows rather than «Выберите инвентаризацию слева»

## 7. Персонал и кабинет

- [x] 7.1 Capture «Официант заказа»; verify the assertion keys on the waiter table's ИТОГО row
- [x] 7.2 Capture «Официант блюда»; verify the assertion distinguishes it from 7.1 rather than keying on the shared table
- [x] 7.3 Capture «Анализ продаж в разрезе официантов»; verify the assertion keys on «Продажи блюд в разрезе официантов»
- [x] 7.4 Capture «Настройки смен»; verify the assertion keys on «Как считаются смены и часы», the panel unique to this view
- [x] 7.5 Capture «Расчёт смен»; verify the assertion keys on «Расчёт смен:» — and if that heading falls below the 1080 fold, record it as a known consequence of the fixed tile height rather than recapturing (heading found at DOM top≈2604px, below the fold — captured tile shows the page's visible top instead; recorded as a known trade-off, not a defect)
- [x] 7.6 Capture «Кабинет»; verify the assertion keys on «СЕРВЕРЫ IIKO»

## 8. Close out

- [x] 8.1 Run `npm run typecheck`, the test suite and `npm run architecture`; verify all three pass
- [x] 8.2 Check every `shots` entry resolves to a real file at exactly 1920×1080 and that no webp in `public/projects/swaprat/` except `thumbnail.webp` lacks a config entry; verify the counts match at 27
- [x] 8.3 Record the capture date and the pinned period alongside the change; verify the note is present in the change directory
- [x] 8.4 Run `graphify update .`; verify it reports the rebuilt graph without error
