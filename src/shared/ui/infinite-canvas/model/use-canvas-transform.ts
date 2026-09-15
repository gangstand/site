"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MOBILE_QUERY } from "@/shared/lib/media-query";
import { centerRectAt, computeFocusScale } from "./focus-geometry";

const FOCUS_ANIMATION_MS = 280;

export interface CanvasBounds { x: number; y: number; w: number; h: number }
const MIN_SCALE = 0.08;
const MAX_ZOOM_MULTIPLIER = 3;
const DEFAULT_SCALE = 0.8;

/** Clamps `scale` to the canvas's zoom range for a given fit-to-content scale. */
export function clampZoomScale(scale: number, fitScale: number): number {
  const maxScale = Math.max(fitScale * MAX_ZOOM_MULTIPLIER, DEFAULT_SCALE);
  return Math.min(maxScale, Math.max(MIN_SCALE, scale));
}

interface Transform {
  x: number;
  y: number;
  scale: number;
}

export function useCanvasTransform({ x: minX, y: minY, w: contentWidth, h: contentHeight }: CanvasBounds, fitOnMount = false) {
  const computeFitScale = useCallback((width: number, height: number) => {
    const padding = 24;
    return Math.max(MIN_SCALE, Math.min((width - padding * 2) / contentWidth, (height - padding * 2) / contentHeight, 1));
  }, [contentWidth, contentHeight]);
  const viewportRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<Transform>({ x: 0, y: 0, scale: 1 });
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const panState = useRef<{ x: number; y: number } | null>(null);
  const pinchState = useRef<{ dist: number; mid: { x: number; y: number } } | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [isWheeling, setIsWheeling] = useState(false);
  const [ready, setReady] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moved = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  const fitScaleRef = useRef(1);
  const frameRef = useRef<number | null>(null);

  const stopAnimating = useCallback(() => {
    if (animationTimer.current !== null) {
      clearTimeout(animationTimer.current);
      animationTimer.current = null;
    }
    setIsAnimating(false);
  }, []);

  const updateTransform = useCallback((next: Transform) => {
    transformRef.current = next;
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      setTransform(transformRef.current);
    });
  }, []);

  const setTransformImmediate = useCallback((next: Transform) => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    transformRef.current = next;
    setTransform(next);
  }, []);

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    if (animationTimer.current !== null) clearTimeout(animationTimer.current);
  }, []);

  const clampScale = useCallback((scale: number) => clampZoomScale(scale, fitScaleRef.current), []);

  const centerAt = useCallback((width: number, height: number, scale: number) => {
    const x = (width - contentWidth * scale) / 2 - minX * scale;
    const y = (height - contentHeight * scale) / 2 - minY * scale;
    return { x, y, scale };
  }, [contentWidth, contentHeight, minX, minY]);

  const fitView = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    fitScaleRef.current = computeFitScale(rect.width, rect.height);
    const next = centerAt(rect.width, rect.height, clampScale(fitScaleRef.current));
    updateTransform(next);
  }, [centerAt, clampScale, updateTransform, computeFitScale]);

  const focusRect = useCallback((rect: CanvasBounds) => {
    const el = viewportRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const scale = clampScale(computeFocusScale(rect, width, height));
    const next = { ...centerRectAt(rect, width, height, scale), scale };
    setTransformImmediate(next);
    if (animationTimer.current !== null) clearTimeout(animationTimer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsAnimating(false);
    } else {
      setIsAnimating(true);
      animationTimer.current = setTimeout(() => {
        animationTimer.current = null;
        setIsAnimating(false);
      }, FOCUS_ANIMATION_MS);
    }
  }, [clampScale, setTransformImmediate]);

  useEffect(() => {
    let previousSize: { width: number; height: number } | undefined;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width <= 0 || height <= 0) return;
      fitScaleRef.current = computeFitScale(width, height);
      if (!previousSize) {
        const isMobile = window.matchMedia(MOBILE_QUERY).matches;
        setTransformImmediate(centerAt(width, height, clampScale(isMobile || fitOnMount ? fitScaleRef.current : DEFAULT_SCALE)));
      } else {
        const t = transformRef.current;
        const scale = clampScale(t.scale);
        const worldX = (previousSize.width / 2 - t.x) / t.scale;
        const worldY = (previousSize.height / 2 - t.y) / t.scale;
        updateTransform({ x: width / 2 - worldX * scale, y: height / 2 - worldY * scale, scale });
      }
      previousSize = { width, height };
      setReady(true);
    });
    if (viewportRef.current) observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [centerAt, clampScale, updateTransform, setTransformImmediate, fitOnMount, computeFitScale]);

  const zoomAround = useCallback((clientX: number, clientY: number, scaleFactor: number) => {
    const el = viewportRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;
    const t = transformRef.current;
    const worldX = (px - t.x) / t.scale;
    const worldY = (py - t.y) / t.scale;
    const nextScale = clampScale(t.scale * scaleFactor);
    const next = { x: px - worldX * nextScale, y: py - worldY * nextScale, scale: nextScale };
    updateTransform(next);
  }, [clampScale, updateTransform]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    let wheelTimer: ReturnType<typeof setTimeout> | undefined;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      stopAnimating();
      setIsWheeling(true);
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => setIsWheeling(false), 150);
      const unit = e.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : e.deltaMode === WheelEvent.DOM_DELTA_PAGE ? el.clientHeight : 1;
      if (e.ctrlKey || e.metaKey) {
        const factor = Math.pow(1.0016, -e.deltaY * unit);
        zoomAround(e.clientX, e.clientY, factor);
      } else {
        const t = transformRef.current;
        const next = { ...t, x: t.x - e.deltaX * unit, y: t.y - e.deltaY * unit };
        updateTransform(next);
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      clearTimeout(wheelTimer);
    };
  }, [zoomAround, updateTransform, stopAnimating]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    stopAnimating();
    if (pointers.current.size === 0) moved.current = false;
    start.current = { x: e.clientX, y: e.clientY };
    const target = (e.target as Element).closest("button, [role='button']") ?? e.currentTarget;
    target.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      panState.current = { x: e.clientX, y: e.clientY };
      setIsPanning(true);
    } else if (pointers.current.size === 2) {
      moved.current = true;
      const pts = Array.from(pointers.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
      pinchState.current = { dist, mid };
      panState.current = null;
    }
  }, [stopAnimating]);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!pointers.current.has(e.pointerId)) return;
      if (Math.hypot(e.clientX - start.current.x, e.clientY - start.current.y) > 5) moved.current = true;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.current.size === 2 && pinchState.current) {
        const pts = Array.from(pointers.current.values());
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
        const factor = pinchState.current.dist > 0 ? dist / pinchState.current.dist : 1;
        zoomAround(pinchState.current.mid.x, pinchState.current.mid.y, factor);
        const t = transformRef.current;
        const next = { ...t, x: t.x + (mid.x - pinchState.current.mid.x), y: t.y + (mid.y - pinchState.current.mid.y) };
        updateTransform(next);
        pinchState.current = { dist, mid };
        return;
      }

      if (pointers.current.size === 1 && panState.current) {
        const dx = e.clientX - panState.current.x;
        const dy = e.clientY - panState.current.y;
        const t = transformRef.current;
        const next = { ...t, x: t.x + dx, y: t.y + dy };
        updateTransform(next);
        panState.current = { x: e.clientX, y: e.clientY };
      }
    },
    [zoomAround, updateTransform],
  );

  const endPointer = useCallback((e: React.PointerEvent) => {
    if (e.type === "pointercancel") moved.current = true;
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) {
      panState.current = null;
      pinchState.current = null;
      setIsPanning(false);
    } else if (pointers.current.size === 1) {
      const [p] = Array.from(pointers.current.values());
      panState.current = { x: p.x, y: p.y };
      pinchState.current = null;
    }
  }, []);

  const zoomButton = useCallback(
    (factor: number) => {
      const el = viewportRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      zoomAround(rect.left + rect.width / 2, rect.top + rect.height / 2, factor);
    },
    [zoomAround],
  );

  const panBy = useCallback((dx: number, dy: number) => {
    const t = { ...transformRef.current, x: transformRef.current.x + dx, y: transformRef.current.y + dy };
    updateTransform(t);
  }, [updateTransform]);

  return {
    viewportRef,
    transform,
    isPanning,
    isInteracting: isPanning || isWheeling,
    isDetailView: transform.scale > Math.min(1.25, fitScaleRef.current * 1.75),
    ready,
    isAnimating,
    stopAnimating,
    moved,
    fitView,
    focusRect,
    zoomButton,
    panBy,
    onPointerDown,
    onPointerMove,
    endPointer,
  };
}
