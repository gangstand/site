"use client";

import { useCallback, type ReactNode } from "react";
import { useCanvasTransform, type CanvasBounds } from "../model/use-canvas-transform";
import { FooterControls, type CanvasControlLabels } from "./footer-controls";
import styles from "./homelab.module.css";

const KEY_DELTAS: Record<string, [number, number]> = {
  ArrowLeft: [70, 0], ArrowRight: [-70, 0], ArrowUp: [0, 70], ArrowDown: [0, -70],
};

interface CanvasViewportProps {
  children: ReactNode;
  bounds: CanvasBounds;
  onClearSelection?: () => void;
  fitOnMount?: boolean;
  ariaLabel?: string;
  controls?: CanvasControlLabels;
  contentOnly?: boolean;
}

/** Children belong to the parent: gesture frames never reconcile the map tree. */
export function CanvasViewport({ children, bounds, onClearSelection, fitOnMount = false, ariaLabel = "Карта инфраструктуры. Стрелки — перемещение, плюс и минус — масштаб, 0 — вся карта, Escape — снять выделение.", controls, contentOnly = false }: CanvasViewportProps) {
  const { viewportRef, transform, isPanning, isInteracting, isDetailView, ready, moved, fitView, zoomButton, panBy, onPointerDown, onPointerMove, endPointer } = useCanvasTransform(bounds, fitOnMount);
  const zoomIn = useCallback(() => zoomButton(1.2), [zoomButton]);
  const zoomOut = useCallback(() => zoomButton(1 / 1.2), [zoomButton]);

  return (
    <>
      <div
        ref={viewportRef}
        className={`${styles.viewport} ${contentOnly ? styles.contentViewport : ""}`}
        tabIndex={0}
        aria-label={ariaLabel}
        data-panning={isPanning}
        data-interacting={isInteracting}
        data-detail-view={isDetailView}
        style={{ cursor: isPanning ? "grabbing" : "grab" }}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget || e.ctrlKey || e.metaKey || e.altKey) return;
          const delta = KEY_DELTAS[e.key];
          if (delta || ["+", "=", "-", "0"].includes(e.key)) e.preventDefault();
          if (e.key === "0") fitView();
          if (e.key === "+" || e.key === "=") zoomIn();
          if (e.key === "-") zoomOut();
          if (delta) panBy(...delta);
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onLostPointerCapture={endPointer}
        onClickCapture={(e) => {
          if (e.detail !== 0 && moved.current && !(e.target as Element).closest("[data-canvas-control]")) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        onClick={(e) => {
          if (!(e.target as Element).closest("button, a, [role='button']")) onClearSelection?.();
        }}
      >
        <div className={styles.world} style={{ opacity: ready ? 1 : 0, transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}>
          {children}
        </div>
      </div>
      <FooterControls scale={transform.scale} onZoomOut={zoomOut} onZoomIn={zoomIn} onFit={fitView} labels={controls} />
    </>
  );
}
