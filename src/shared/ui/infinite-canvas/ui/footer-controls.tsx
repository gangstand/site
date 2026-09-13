import { memo } from "react";
import styles from "./infinite-canvas.module.css";

export interface CanvasControlLabels {
  zoomOut: string;
  zoomIn: string;
  fit: string;
  fitLabel: string;
  fullscreenEnter: string;
  fullscreenExit: string;
}

interface FooterControlsProps {
  scale: number;
  ready: boolean;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onFit: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  labels: CanvasControlLabels;
}

export const FooterControls = memo(function FooterControls({ scale, ready, onZoomOut, onZoomIn, onFit, isFullscreen, onToggleFullscreen, labels }: FooterControlsProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.tools}>
        <button type="button" aria-label={labels.zoomOut} onClick={onZoomOut}>
          −
        </button>
        <span>{ready ? `${Math.round(scale * 100)}%` : ""}</span>
        <button type="button" aria-label={labels.zoomIn} onClick={onZoomIn}>
          +
        </button>
        <i />
        <button type="button" className={styles.fit} onClick={onFit} aria-label={labels.fitLabel}>
          {labels.fit} <span aria-hidden="true">↗</span>
        </button>
        <i />
        <button
          type="button"
          className={styles.fullscreen}
          onClick={onToggleFullscreen}
          aria-label={isFullscreen ? labels.fullscreenExit : labels.fullscreenEnter}
          aria-pressed={isFullscreen}
        >
          {isFullscreen ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 3v4a2 2 0 0 1-2 2H3M15 3v4a2 2 0 0 0 2 2h4M9 21v-4a2 2 0 0 0-2-2H3M15 21v-4a2 2 0 0 1 2-2h4" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 9V5a2 2 0 0 1 2-2h4M21 9V5a2 2 0 0 0-2-2h-4M3 15v4a2 2 0 0 0 2 2h4M21 15v4a2 2 0 0 1-2 2h-4" />
            </svg>
          )}
        </button>
      </div>
    </footer>
  );
});
