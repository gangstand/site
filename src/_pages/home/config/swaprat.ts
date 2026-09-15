import { packColumns } from "../model/column-layout";
import type { ProjectDefinition } from "../model/project";

const GAP = 120;
const COLUMNS = 5;
const TILE_WIDTH = 1920;
const TILE_HEIGHT = 1080;

/**
 * Screenshots of the SwapRat demo workspace, captured at a uniform 1920x1080 CSS px
 * viewport per screen (cropped from the top for taller content, padded with the app's
 * background for shorter content) so every tile shares one size for a clean grid.
 */
const shots: { file: string; alt: { ru: string; en: string } }[] = [
  { file: "login", alt: { ru: "Экран входа в личный кабинет SwapRat с приглашением попробовать демо-режим", en: "SwapRat sign-in screen with the invitation to try demo mode" } },
  { file: "dashboard", alt: { ru: "Дашборд ресторана «Веранда» с выручкой, средним чеком, топ-5 официантов и блюд за период", en: "Dashboard for restaurant «Veranda» showing revenue, average check, top-5 waiters and dishes for the period" } },
  { file: "audit-incidents", alt: { ru: "Умный аудит опасных операций со списком инцидентов и составом чека выбранного заказа", en: "Smart audit of risky operations with the incident list and the selected order's check composition" } },
  { file: "pnl", alt: { ru: "Отчёт о прибылях и убытках (P&L) с развёрнутой структурой доходов и расходов", en: "Profit and loss report with the fully expanded income and expense structure" } },
  { file: "dds", alt: { ru: "Отчёт по движению денежных средств (ДДС) с развёрнутыми поступлениями, выплатами и остатками по счетам", en: "Cash flow statement with expanded receipts, payments and account balances" } },
  { file: "dishes-general", alt: { ru: "Анализ продаж по блюдам: таблица «Общие продажи» с суммой продаж, себестоимостью и наценкой по каждому блюду", en: "Dish sales analysis: the «General sales» table with sales amount, cost and markup per dish" } },
  { file: "dishes-pairs", alt: { ru: "Вкладка «Что с чем покупают» с топом совместных продаж и подобранным блюдом для кросс-продаж", en: "The «What sells with what» tab showing top co-purchases and companion dishes for a selected item" } },
  { file: "dishes-combo", alt: { ru: "Комбо-анализ загруженных чеков с разбивкой встречаемости выбранного блюда по официантам", en: "Combo analysis of loaded checks with the selected dish's occurrence broken down by waiter" } },
  { file: "dishes-abc", alt: { ru: "ABC-Анализ меню с классами A/B/C по выручке, количеству и прибыли для каждого блюда", en: "ABC menu analysis with A/B/C classes by revenue, quantity and profit for each dish" } },
  { file: "dishes-bcg", alt: { ru: "Матрица Касавана-Смита с блюдами, распределёнными по квадрантам Stars, Puzzles, Plowhorses и Dogs", en: "Kasavana-Smith matrix with dishes plotted across the Stars, Puzzles, Plowhorses and Dogs quadrants" } },
  { file: "dishes-pavesik", alt: { ru: "Метод Павесика с квадрантами меню и детальной таблицей показателей по каждому блюду", en: "The Pavesic method with menu quadrants and a detailed metrics table per dish" } },
  { file: "heatmap-revenue", alt: { ru: "Тепловая карта выручки по часам и дням недели, показывающая пиковые часы заведения", en: "Revenue heatmap by hour and weekday showing the venue's peak hours" } },
  { file: "heatmap-orders", alt: { ru: "Та же тепловая карта, переключённая на показатель «Поток заказов»", en: "The same heatmap switched to the «Order flow» metric" } },
  { file: "discounts-categories", alt: { ru: "Скидки по категориям с развёрнутым списком чеков по типу «Счастливые часы 20%»", en: "Discounts by category with the check list expanded for the «Happy hours 20%» type" } },
  { file: "discounts-clients", alt: { ru: "Аудит скидок по клиентам с детализацией чеков выбранного гостя", en: "Client discount audit with the selected guest's check-level detail" } },
  { file: "stock-balances", alt: { ru: "Остатки на складах с развёрнутыми группами и товарными позициями по каждому складу", en: "Warehouse stock balances with expanded groups and individual product positions" } },
  { file: "stock-dynamics", alt: { ru: "Динамика складских остатков в рублях по дням периода с итоговым изменением", en: "Warehouse stock value dynamics by day over the period with the total change" } },
  { file: "stock-invoices", alt: { ru: "Приходные накладные со списком поставок и развёрнутыми позициями одной накладной", en: "Purchase invoices with the delivery list and one invoice's line items expanded" } },
  { file: "stock-prices", alt: { ru: "Изменение закупочных цен с подсветкой позиций, подорожавших или подешевевших сильнее порога", en: "Purchase price changes highlighting positions that moved beyond the alert threshold" } },
  { file: "stock-writeoffs", alt: { ru: "Акты списания, сгруппированные по счёту списания, с составом выбранного документа", en: "Write-off acts grouped by write-off account, with the selected document's composition" } },
  { file: "stock-inventory", alt: { ru: "Инвентаризации с выбранным документом, показывающим позиции излишков и недостач", en: "Stocktakes with a selected document showing surplus and shortage line items" } },
  { file: "waiter-order", alt: { ru: "Анализ официантов по заказу с итоговой строкой продаж, скидок и прибыли по ресторану", en: "Waiter analysis by order with the restaurant-wide totals row for sales, discounts and profit" } },
  { file: "waiter-dish", alt: { ru: "Анализ официантов по блюду, где выручка доставки числится отдельной строкой «Пользователь iikoTransport»", en: "Waiter analysis by dish, where delivery revenue appears on its own «iikoTransport user» row" } },
  { file: "waiter-analysis", alt: { ru: "Анализ продаж блюд в разрезе официантов с распределением количества и выручки по каждому сотруднику", en: "Dish sales broken down by waiter, showing quantity and revenue distribution per staff member" } },
  { file: "shift-settings", alt: { ru: "Настройки смен с пояснением, как система считает рабочие смены и часы сотрудников", en: "Shift settings explaining how the system calculates staff shifts and hours" } },
  { file: "shift-calc", alt: { ru: "Расчёт смен официантов за период: продолжительность и результаты каждой смены", en: "Waiter shift calculations for the period: duration and results of each shift" } },
  { file: "cabinet", alt: { ru: "Личный кабинет с подключёнными серверами iiko и настройками рабочего пространства", en: "Account cabinet with connected iiko servers and workspace settings" } },
];

const positions = packColumns(
  shots.map(() => ({ width: TILE_WIDTH, height: TILE_HEIGHT })),
  COLUMNS,
  GAP,
);

export const swaprat: ProjectDefinition = {
  id: "swaprat",
  name: "SwapRat",
  destination: { kind: "external", url: "https://swaprat.ru/" },
  description: {
    ru: "Система контроля и аудита в ресторане.",
    en: "Restaurant control and audit system.",
  },
  images: shots.map(({ file, alt }, index) => ({
    src: `/projects/swaprat/${file}.webp`,
    alt,
    x: positions[index].x,
    y: positions[index].y,
    width: TILE_WIDTH,
    height: TILE_HEIGHT,
  })),
  thumbnail: { width: 1000, height: 819 },
  detail: { kind: "photos" },
};
