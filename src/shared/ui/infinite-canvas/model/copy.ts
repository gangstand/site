import type { Lang } from "@/shared/lib/language";

export interface CanvasControlLabels {
  zoomOut: string;
  zoomIn: string;
  fit: string;
  fitLabel: string;
  fullscreenEnter: string;
  fullscreenExit: string;
}

export interface CanvasLabels {
  label: string;
  keyboard: string;
  controls: CanvasControlLabels;
}

export const canvasCopy: Record<Lang, CanvasLabels> = {
  ru: {
    label: "Полотно",
    keyboard: "Стрелки — перемещение, плюс и минус — масштаб, 0 — показать всё.",
    controls: { zoomOut: "Уменьшить", zoomIn: "Увеличить", fit: "Всё полотно", fitLabel: "Показать всё полотно", fullscreenEnter: "На весь экран", fullscreenExit: "Выйти из полноэкранного режима" },
  },
  en: {
    label: "Canvas",
    keyboard: "Arrow keys to pan, plus and minus to zoom, 0 to fit all.",
    controls: { zoomOut: "Zoom out", zoomIn: "Zoom in", fit: "Fit all", fitLabel: "Fit all content", fullscreenEnter: "Enter fullscreen", fullscreenExit: "Exit fullscreen" },
  },
};
