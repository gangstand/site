import type { CanvasBounds } from "./use-canvas-transform";

const PADDING = 24;

/** A viewport's client-space origin and the visual scale an ancestor transform applies to it. */
export interface ViewportFrame {
  left: number;
  top: number;
  scaleX: number;
  scaleY: number;
}

/** Maps a client point into the viewport's layout coordinates, undoing any ancestor visual scale. */
export function toViewportPoint(clientX: number, clientY: number, frame: ViewportFrame): { x: number; y: number } {
  return { x: (clientX - frame.left) / frame.scaleX, y: (clientY - frame.top) / frame.scaleY };
}

export interface FocusTransform {
  x: number;
  y: number;
  scale: number;
}

/** The scale that fits `rect` inside the viewport with the canvas's usual padding, never upscaling past 1:1. */
export function computeFocusScale(rect: CanvasBounds, viewportWidth: number, viewportHeight: number): number {
  return Math.min((viewportWidth - PADDING * 2) / rect.w, (viewportHeight - PADDING * 2) / rect.h, 1);
}

/** The transform offset that centres `rect` in the viewport at the given scale. */
export function centerRectAt(rect: CanvasBounds, viewportWidth: number, viewportHeight: number, scale: number): { x: number; y: number } {
  return {
    x: viewportWidth / 2 - (rect.x + rect.w / 2) * scale,
    y: viewportHeight / 2 - (rect.y + rect.h / 2) * scale,
  };
}

/** Centres `rect` in a `viewportWidth`x`viewportHeight` viewport, fit to padding and never upscaled past 1:1. */
export function computeFocusTransform(rect: CanvasBounds, viewportWidth: number, viewportHeight: number): FocusTransform {
  const scale = computeFocusScale(rect, viewportWidth, viewportHeight);
  return { ...centerRectAt(rect, viewportWidth, viewportHeight, scale), scale };
}
