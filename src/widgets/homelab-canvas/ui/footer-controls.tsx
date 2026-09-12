import { memo } from "react";
import styles from "./homelab.module.css";

interface FooterControlsProps {
  scale: number;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onFit: () => void;
}

export const FooterControls = memo(function FooterControls({ scale, onZoomOut, onZoomIn, onFit }: FooterControlsProps) {
  return (
    <footer className={styles.footer}>
      <span className={styles.hint}>
        Перетаскивайте карту <span>· Ctrl + колесо — масштаб</span>
      </span>
      <div className={styles.tools}>
        <button aria-label="Уменьшить" onClick={onZoomOut}>
          −
        </button>
        <span>{Math.round(scale * 100)}%</span>
        <button aria-label="Увеличить" onClick={onZoomIn}>
          +
        </button>
        <i />
        <button className={styles.fit} onClick={onFit} aria-label="Показать всю карту">
          Вся карта <span>↗</span>
        </button>
      </div>
    </footer>
  );
});
