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
  return Math.min(maxScale, Math.max(Math.min(MIN_SCALE, fitScale), scale));
}

interface Transform {
  x: number;
  y: number;
  scale: number;
}

export function useCanvasTransform({ x: minX, y: minY, w: contentWidth, h: contentHeight }: CanvasBounds, fitOnMount = false) {
  const computeFitScale = useCallback((width: number, height: number) => {
    const padding = 24;
    return Math.min(Math.max(1, width - padding * 2) / contentWidth, Math.max(1, height - padding * 2) / contentHeight, 1);
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
  const animationFrame = useRef<number | null>(null);
  const moved = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  const fitScaleRef = useRef(1);
  const frameRef = useRef<number | null>(null);

  const stopAnimating = useCallback(() => {
    if (animationFrame.current !== null) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
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
    if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
  }, []);

  const clampScale = useCallback((scale: number) => clampZoomScale(scale, fitScaleRef.current), []);

  const centerAt = useCallback((width: number, height: number, scale: number) => {
    const x = (width - contentWidth * scale) / 2 - minX * scale;
    const y = (height - contentHeight * scale) / 2 - minY * scale;
    return { x, y, scale };
  }, [contentWidth, contentHeight, minX, minY]);

  const fitView = useCallback(() => {
    stopAnimating();
    const el = viewportRef.current;
    if (!el) return;
    const rect = { width: el.clientWidth, height: el.clientHeight };
    fitScaleRef.current = computeFitScale(rect.width, rect.height);
    const next = centerAt(rect.width, rect.height, clampScale(fitScaleRef.current));
    updateTransform(next);
  }, [centerAt, clampScale, updateTransform, computeFitScale, stopAnimating]);

  const focusRect = useCallback((rect: CanvasBounds) => {
    stopAnimating();
    const el = viewportRef.current;
    if (!el) return;
    // Layout dimensions do not include the dialog's entrance scale transform.
    const { clientWidth: width, clientHeight: height } = el;
    const scale = clampScale(computeFocusScale(rect, width, height));
    const next = { ...centerRectAt(rect, width, height, scale), scale };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTransformImmediate(next);
    } else {
      const from = transformRef.current;
      const startedAt = performance.now();
      // Keep the rendered camera and interaction coordinates on the same frame.
      // A CSS transition leaves the ref at the destination and jumps on interruption.
      const animate = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / FOCUS_ANIMATION_MS);
        const eased = 1 - Math.pow(1 - progress, 3);
        setTransformImmediate({
          x: from.x + (next.x - from.x) * eased,
          y: from.y + (next.y - from.y) * eased,
          scale: from.scale + (next.scale - from.scale) * eased,
        });
        animationFrame.current = progress < 1 ? requestAnimationFrame(animate) : null;
      };
      animationFrame.current = requestAnimationFrame(animate);
    }
  }, [clampScale, setTransformImmediate, stopAnimating]);

  useEffect(() => {
    let previousSize: { width: number; height: number } | undefined;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width <= 0 || height <= 0) return;
      stopAnimating();
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
  }, [centerAt, clampScale, updateTransform, setTransformImmediate, fitOnMount, computeFitScale, stopAnimating]);

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
      stopAnimating();
      const el = viewportRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      zoomAround(rect.left + rect.width / 2, rect.top + rect.height / 2, factor);
    },
    [zoomAround, stopAnimating],
  );

  const panBy = useCallback((dx: number, dy: number) => {
    stopAnimating();
    const t = { ...transformRef.current, x: transformRef.current.x + dx, y: transformRef.current.y + dy };
    updateTransform(t);
  }, [updateTransform, stopAnimating]);

  return {
    viewportRef,
    transform,
    isPanning,
    isInteracting: isPanning || isWheeling,
    isDetailView: transform.scale > Math.min(1.25, fitScaleRef.current * 1.75),
    ready,
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
