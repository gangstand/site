"use client";

import { useCallback, useEffect, useImperativeHandle, useRef, type ReactNode, type Ref } from "react";
import type { CanvasLabels } from "../model/copy";
import { useCanvasTransform, type CanvasBounds } from "../model/use-canvas-transform";
import { useFullscreen } from "../model/use-fullscreen";
import { FooterControls } from "./footer-controls";
import styles from "./infinite-canvas.module.css";

const KEY_DELTAS: Record<string, [number, number]> = {
  ArrowLeft: [70, 0], ArrowRight: [-70, 0], ArrowUp: [0, 70], ArrowDown: [0, -70],
};

export interface CanvasInteractionState {
  isPanning: boolean;
  isInteracting: boolean;
  isDetailView: boolean;
}

/** Imperative entry points a canvas owner can use to move the camera. */
export interface CanvasHandle {
  focusRect(rect: CanvasBounds): void;
  fitView(): void;
}

export interface CanvasViewportProps {
  children: ReactNode;
  bounds: CanvasBounds;
  labels: CanvasLabels;
  onClearSelection?: () => void;
  fitOnMount?: boolean;
  ariaLabel?: string;
  className?: string;
  toolbar?: ReactNode;
  overlay?: ReactNode;
  fullscreenTargetRef?: Ref<HTMLDivElement>;
  /** Use this instead of canvas data attributes when animations depend on panning or detail state. */
  onInteractionChange?: (state: CanvasInteractionState) => void;
  /** Called with the region the camera can see, in canvas coordinates, widened so content can
   *  be prepared before it arrives on screen. Fires from the camera's own frame loop. */
  onVisibleRectChange?: (rect: CanvasBounds) => void;
  canvasRef?: Ref<CanvasHandle>;
}

export function CanvasViewport({ children, bounds, labels, onClearSelection, fitOnMount = false, ariaLabel, className, toolbar, overlay, fullscreenTargetRef, onInteractionChange, onVisibleRectChange, canvasRef }: CanvasViewportProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const { viewportRef, worldRef, scale, isPanning, isInteracting, isDetailView, ready, moved, fitView, focusRect, zoomButton, panBy, onPointerDown, onPointerMove, endPointer } = useCanvasTransform(bounds, fitOnMount, onVisibleRectChange);
  const zoomIn = useCallback(() => zoomButton(1.2), [zoomButton]);
  const zoomOut = useCallback(() => zoomButton(1 / 1.2), [zoomButton]);
  const { isFullscreen, toggleFullscreen } = useFullscreen(() => frameRef.current);

  useImperativeHandle(canvasRef, () => ({ focusRect, fitView }), [focusRect, fitView]);

  useEffect(() => {
    onInteractionChange?.({ isPanning, isInteracting, isDetailView });
  }, [isPanning, isInteracting, isDetailView, onInteractionChange]);

  const setFullscreenTarget = useCallback((element: HTMLDivElement | null) => {
    frameRef.current = element;
    if (typeof fullscreenTargetRef === "function") {
      fullscreenTargetRef(element);
    } else if (fullscreenTargetRef) {
      fullscreenTargetRef.current = element;
    }
  }, [fullscreenTargetRef]);

  return (
    <div ref={setFullscreenTarget} className={`${styles.shell} ${className ?? ""}`}>
      {toolbar}
      <div
        ref={viewportRef}
        className={styles.viewport}
        tabIndex={0}
        aria-label={`${ariaLabel ?? labels.label}. ${labels.keyboard}`}
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
        {/* No inline camera: the frame loop in `useCanvasTransform` owns this element's
            transform and opacity, so a React render can never stamp a stale camera over it. */}
        <div ref={worldRef} className={styles.world}>
          {children}
        </div>
        {overlay}
      </div>
      <FooterControls
        scale={scale}
        ready={ready}
        onZoomOut={zoomOut}
        onZoomIn={zoomIn}
        onFit={fitView}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        labels={labels.controls}
      />
    </div>
  );
}
