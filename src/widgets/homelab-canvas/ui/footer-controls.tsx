import { memo } from "react";
import styles from "./homelab.module.css";

export interface CanvasControlLabels {
  hint: string;
  zoomHint: string;
  zoomOut: string;
  zoomIn: string;
  fit: string;
  fitLabel: string;
}

const DEFAULT_LABELS: CanvasControlLabels = {
  hint: "Перетаскивайте карту",
  zoomHint: "· Ctrl + колесо — масштаб",
  zoomOut: "Уменьшить",
  zoomIn: "Увеличить",
  fit: "Вся карта",
  fitLabel: "Показать всю карту",
};

interface FooterControlsProps {
  scale: number;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onFit: () => void;
  labels?: CanvasControlLabels;
}

export const FooterControls = memo(function FooterControls({ scale, onZoomOut, onZoomIn, onFit, labels = DEFAULT_LABELS }: FooterControlsProps) {
  return (
    <footer className={styles.footer}>
      <span className={styles.hint}>
        {labels.hint} <span>{labels.zoomHint}</span>
      </span>
      <div className={styles.tools}>
        <button type="button" aria-label={labels.zoomOut} onClick={onZoomOut}>
          −
        </button>
        <span>{Math.round(scale * 100)}%</span>
        <button type="button" aria-label={labels.zoomIn} onClick={onZoomIn}>
          +
        </button>
        <i />
        <button type="button" className={styles.fit} onClick={onFit} aria-label={labels.fitLabel}>
          {labels.fit} <span aria-hidden="true">↗</span>
        </button>
      </div>
    </footer>
  );
});
