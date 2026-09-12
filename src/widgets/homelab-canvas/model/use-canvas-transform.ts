"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { bounds } from "./layout";

const HOMELAB_BOUNDS = { minX: bounds.x, minY: bounds.y, maxX: bounds.x + bounds.w, maxY: bounds.y + bounds.h };
const CONTENT_W = HOMELAB_BOUNDS.maxX - HOMELAB_BOUNDS.minX;
const CONTENT_H = HOMELAB_BOUNDS.maxY - HOMELAB_BOUNDS.minY;
const MIN_SCALE = 0.08;
// How far past "the whole map fits the viewport" a user may zoom in. A fixed
// absolute cap (e.g. 2.2x) let a small viewport (phones especially) zoom the
// SVG in so far that the animated connection lines got expensive to repaint
// every frame — tying the ceiling to the fit-to-view scale keeps max zoom
// proportional to how big the content actually renders on this screen.
const MAX_ZOOM_MULTIPLIER = 3;
// Initial zoom level; resizing preserves the user's current view.
const DEFAULT_SCALE = 0.8;

interface Transform {
  x: number;
  y: number;
  scale: number;
}

function computeFitScale(width: number, height: number) {
  const padding = 24;
  return Math.max(MIN_SCALE, Math.min((width - padding * 2) / CONTENT_W, (height - padding * 2) / CONTENT_H, 1));
}

/** Pan/zoom/pinch state for the infrastructure map, isolated so a drag frame only re-renders the viewport wrapper, not the node/connection tree. */
export function useCanvasTransform() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<Transform>({ x: 0, y: 0, scale: 1 });
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const panState = useRef<{ x: number; y: number } | null>(null);
  const pinchState = useRef<{ dist: number; mid: { x: number; y: number } } | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [isWheeling, setIsWheeling] = useState(false);
  const [ready, setReady] = useState(false);
  const moved = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  const fitScaleRef = useRef(1);
  const frameRef = useRef<number | null>(null);

  // Consume every input delta, but commit at most once per display frame.
  const updateTransform = useCallback((next: Transform) => {
    transformRef.current = next;
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      setTransform(transformRef.current);
    });
  }, []);

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  }, []);

  const clampScale = useCallback((scale: number) => {
    // Floored at the default scale so it's always reachable, even on a
    // viewport small enough that 3x its fit scale would land under it.
    const maxScale = Math.max(fitScaleRef.current * MAX_ZOOM_MULTIPLIER, DEFAULT_SCALE);
    return Math.min(maxScale, Math.max(MIN_SCALE, scale));
  }, []);

  const centerAt = useCallback((width: number, height: number, scale: number) => {
    const x = (width - CONTENT_W * scale) / 2 - HOMELAB_BOUNDS.minX * scale;
    const y = (height - CONTENT_H * scale) / 2 - HOMELAB_BOUNDS.minY * scale;
    return { x, y, scale };
  }, []);

  /** Zooms out to fit the whole map — used by the explicit "Вся карта" control, not the initial view. */
  const fitView = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    fitScaleRef.current = computeFitScale(rect.width, rect.height);
    const next = centerAt(rect.width, rect.height, clampScale(fitScaleRef.current));
    updateTransform(next);
  }, [centerAt, clampScale, updateTransform]);

  useEffect(() => {
    let previousSize: { width: number; height: number } | undefined;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width <= 0 || height <= 0) return;
      fitScaleRef.current = computeFitScale(width, height);
      if (!previousSize) {
        updateTransform(centerAt(width, height, clampScale(DEFAULT_SCALE)));
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
  }, [centerAt, clampScale, updateTransform]);

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
  }, [zoomAround, updateTransform]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    if (pointers.current.size === 0) moved.current = false;
    start.current = { x: e.clientX, y: e.clientY };
    // Capture on the interactive ancestor so clicking an icon keeps button semantics.
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
  }, []);

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
    // Animated SVG strokes repaint a growing surface as we zoom in. Keep the
    // overview animated and the detail view static, including small screens.
    isDetailView: transform.scale > Math.min(1.25, fitScaleRef.current * 1.75),
    ready,
    moved,
    fitView,
    zoomButton,
    panBy,
    onPointerDown,
    onPointerMove,
    endPointer,
  };
}
