import type { Lang } from "@/shared/config/translations";
import type { CanvasControlLabels } from "../ui/footer-controls";

export const canvasCopy: Record<Lang, { label: string; keyboard: string; controls: CanvasControlLabels }> = {
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
