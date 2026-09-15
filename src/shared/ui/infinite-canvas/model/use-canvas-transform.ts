"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MOBILE_QUERY } from "@/shared/lib/media-query";
import { centerRectAt, computeFocusScale, toViewportPoint, type ViewportFrame } from "./focus-geometry";

const FOCUS_ANIMATION_MS = 280;
/** How far a pointer travels before the gesture counts as a drag rather than a click. */
const DRAG_THRESHOLD = 5;

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

interface CameraAnimation {
  from: Transform;
  to: Transform;
  startedAt: number;
}

export function useCanvasTransform({ x: minX, y: minY, w: contentWidth, h: contentHeight }: CanvasBounds, fitOnMount = false) {
  const computeFitScale = useCallback((width: number, height: number) => {
    const padding = 24;
    return Math.min(Math.max(1, width - padding * 2) / contentWidth, Math.max(1, height - padding * 2) / contentHeight, 1);
  }, [contentWidth, contentHeight]);
  const viewportRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<Transform>({ x: 0, y: 0, scale: 1 });
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const viewportSize = useRef({ width: 0, height: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const panState = useRef<{ x: number; y: number } | null>(null);
  const pinchState = useRef<{ dist: number; mid: { x: number; y: number } } | null>(null);
  const dragging = useRef(false);
  const [isPanning, setIsPanning] = useState(false);
  const [isWheeling, setIsWheeling] = useState(false);
  const [ready, setReady] = useState(false);
  const readyRef = useRef(false);
  const readyApplied = useRef(false);
  const animation = useRef<CameraAnimation | null>(null);
  const moved = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  const fitScaleRef = useRef(1);
  const frameRef = useRef<number | null>(null);

  // One frame loop owns the camera. Gestures and buttons write `transformRef` and ask for a
  // frame; the focus animation advances inside that same frame. Nothing else calls setTransform,
  // so the rendered camera never lags behind the coordinates the next gesture reads.
  const scheduleFrame = useCallback(() => {
    if (frameRef.current !== null) return;
    const runFrame = () => {
      frameRef.current = null;
      const current = animation.current;
      if (current) {
        const progress = Math.min(1, (performance.now() - current.startedAt) / FOCUS_ANIMATION_MS);
        const eased = 1 - Math.pow(1 - progress, 3);
        transformRef.current = {
          x: current.from.x + (current.to.x - current.from.x) * eased,
          y: current.from.y + (current.to.y - current.from.y) * eased,
          scale: current.from.scale + (current.to.scale - current.from.scale) * eased,
        };
        if (progress >= 1) animation.current = null;
      }
      setTransform(transformRef.current);
      if (readyRef.current && !readyApplied.current) {
        readyApplied.current = true;
        setReady(true);
      }
      if (animation.current !== null) frameRef.current = requestAnimationFrame(runFrame);
    };
    frameRef.current = requestAnimationFrame(runFrame);
  }, []);

  const commitTransform = useCallback((next: Transform) => {
    transformRef.current = next;
    scheduleFrame();
  }, [scheduleFrame]);

  const stopAnimating = useCallback(() => {
    animation.current = null;
  }, []);

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    animation.current = null;
  }, []);

  const clampScale = useCallback((scale: number) => clampZoomScale(scale, fitScaleRef.current), []);

  /** The viewport's layout size — the single coordinate system every camera calculation uses. */
  const readViewportSize = useCallback(() => {
    const size = viewportSize.current;
    if (size.width > 0 && size.height > 0) return size;
    const el = viewportRef.current;
    // The observer has not reported yet; fall back to layout so an early focus still lands.
    if (el && el.clientWidth > 0 && el.clientHeight > 0) return { width: el.clientWidth, height: el.clientHeight };
    return null;
  }, []);

  /** Maps client coordinates into that layout system. `getBoundingClientRect` follows an
   *  ancestor's entrance transform while the layout size does not, so divide the two out. */
  const readViewportFrame = useCallback((): (ViewportFrame & { width: number; height: number }) | null => {
    const el = viewportRef.current;
    const size = readViewportSize();
    if (!el || !size) return null;
    const rect = el.getBoundingClientRect();
    return {
      ...size,
      left: rect.left,
      top: rect.top,
      scaleX: rect.width > 0 ? rect.width / size.width : 1,
      scaleY: rect.height > 0 ? rect.height / size.height : 1,
    };
  }, [readViewportSize]);

  const centerAt = useCallback((width: number, height: number, scale: number) => {
    const x = (width - contentWidth * scale) / 2 - minX * scale;
    const y = (height - contentHeight * scale) / 2 - minY * scale;
    return { x, y, scale };
  }, [contentWidth, contentHeight, minX, minY]);

  const fitView = useCallback(() => {
    stopAnimating();
    const size = readViewportSize();
    if (!size) return;
    fitScaleRef.current = computeFitScale(size.width, size.height);
    commitTransform(centerAt(size.width, size.height, clampScale(fitScaleRef.current)));
  }, [centerAt, clampScale, commitTransform, computeFitScale, readViewportSize, stopAnimating]);

  const focusRect = useCallback((rect: CanvasBounds) => {
    stopAnimating();
    const size = readViewportSize();
    if (!size) return;
    const scale = clampScale(computeFocusScale(rect, size.width, size.height));
    const to = { ...centerRectAt(rect, size.width, size.height, scale), scale };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      commitTransform(to);
      return;
    }
    animation.current = { from: transformRef.current, to, startedAt: performance.now() };
    scheduleFrame();
  }, [clampScale, commitTransform, readViewportSize, scheduleFrame, stopAnimating]);

  useEffect(() => {
    let previousSize: { width: number; height: number } | undefined;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width <= 0 || height <= 0) return;
      stopAnimating();
      viewportSize.current = { width, height };
      fitScaleRef.current = computeFitScale(width, height);
      if (!previousSize) {
        const isMobile = window.matchMedia(MOBILE_QUERY).matches;
        commitTransform(centerAt(width, height, clampScale(isMobile || fitOnMount ? fitScaleRef.current : DEFAULT_SCALE)));
      } else {
        const t = transformRef.current;
        const scale = clampScale(t.scale);
        const worldX = (previousSize.width / 2 - t.x) / t.scale;
        const worldY = (previousSize.height / 2 - t.y) / t.scale;
        commitTransform({ x: width / 2 - worldX * scale, y: height / 2 - worldY * scale, scale });
      }
      previousSize = { width, height };
      // Flagged rather than set directly, so the first camera and `ready` land in the same
      // render and nothing is ever painted at the placeholder transform.
      readyRef.current = true;
    });
    if (viewportRef.current) observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [centerAt, clampScale, commitTransform, fitOnMount, computeFitScale, stopAnimating]);

  /** Zooms about a point already expressed in the viewport's layout coordinates. */
  const zoomAround = useCallback((px: number, py: number, scaleFactor: number) => {
    const t = transformRef.current;
    const worldX = (px - t.x) / t.scale;
    const worldY = (py - t.y) / t.scale;
    const nextScale = clampScale(t.scale * scaleFactor);
    commitTransform({ x: px - worldX * nextScale, y: py - worldY * nextScale, scale: nextScale });
  }, [clampScale, commitTransform]);

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
      const frame = readViewportFrame();
      if (!frame) return;
      const unit = e.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : e.deltaMode === WheelEvent.DOM_DELTA_PAGE ? frame.height : 1;
      if (e.ctrlKey || e.metaKey) {
        const factor = Math.pow(1.0016, -e.deltaY * unit);
        const point = toViewportPoint(e.clientX, e.clientY, frame);
        zoomAround(point.x, point.y, factor);
      } else {
        const t = transformRef.current;
        commitTransform({ ...t, x: t.x - e.deltaX * unit, y: t.y - e.deltaY * unit });
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      clearTimeout(wheelTimer);
    };
  }, [zoomAround, commitTransform, readViewportFrame, stopAnimating]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    stopAnimating();
    if (pointers.current.size === 0) {
      moved.current = false;
      dragging.current = false;
    }
    start.current = { x: e.clientX, y: e.clientY };
    const target = (e.target as Element).closest("button, [role='button']") ?? e.currentTarget;
    target.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      // Arm panning but hold the camera until the threshold is passed, so a click on a tile
      // neither nudges the canvas nor turns the cursor into a grab.
      panState.current = { x: e.clientX, y: e.clientY };
    } else if (pointers.current.size === 2) {
      // A second pointer is unambiguously a camera gesture; take control at once.
      moved.current = true;
      dragging.current = true;
      setIsPanning(true);
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
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.current.size === 2 && pinchState.current) {
        const frame = readViewportFrame();
        if (!frame) return;
        const pts = Array.from(pointers.current.values());
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
        const factor = pinchState.current.dist > 0 ? dist / pinchState.current.dist : 1;
        const anchor = toViewportPoint(pinchState.current.mid.x, pinchState.current.mid.y, frame);
        zoomAround(anchor.x, anchor.y, factor);
        const t = transformRef.current;
        commitTransform({
          ...t,
          x: t.x + (mid.x - pinchState.current.mid.x) / frame.scaleX,
          y: t.y + (mid.y - pinchState.current.mid.y) / frame.scaleY,
        });
        pinchState.current = { dist, mid };
        return;
      }

      if (pointers.current.size !== 1 || !panState.current) return;
      if (!dragging.current) {
        if (Math.hypot(e.clientX - start.current.x, e.clientY - start.current.y) <= DRAG_THRESHOLD) return;
        dragging.current = true;
        moved.current = true;
        setIsPanning(true);
      }
      const frame = readViewportFrame();
      if (!frame) return;
      // `panState` still holds the press point, so this first step carries the threshold
      // distance too and the content stays under the pointer.
      const dx = (e.clientX - panState.current.x) / frame.scaleX;
      const dy = (e.clientY - panState.current.y) / frame.scaleY;
      const t = transformRef.current;
      commitTransform({ ...t, x: t.x + dx, y: t.y + dy });
      panState.current = { x: e.clientX, y: e.clientY };
    },
    [zoomAround, commitTransform, readViewportFrame],
  );

  const endPointer = useCallback((e: React.PointerEvent) => {
    if (e.type === "pointercancel") moved.current = true;
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) {
      panState.current = null;
      pinchState.current = null;
      dragging.current = false;
      setIsPanning(false);
    } else if (pointers.current.size === 1) {
      const [p] = Array.from(pointers.current.values());
      panState.current = { x: p.x, y: p.y };
      pinchState.current = null;
      // The remaining pointer carries on the same gesture; don't re-arm the threshold.
      dragging.current = true;
    }
  }, []);

  const zoomButton = useCallback(
    (factor: number) => {
      stopAnimating();
      const size = readViewportSize();
      if (!size) return;
      zoomAround(size.width / 2, size.height / 2, factor);
    },
    [readViewportSize, zoomAround, stopAnimating],
  );

  const panBy = useCallback((dx: number, dy: number) => {
    stopAnimating();
    const t = transformRef.current;
    commitTransform({ ...t, x: t.x + dx, y: t.y + dy });
  }, [commitTransform, stopAnimating]);

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
