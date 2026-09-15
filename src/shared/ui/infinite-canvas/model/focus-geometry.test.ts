import { describe, expect, it } from "vitest";
import { clampZoomScale } from "./use-canvas-transform";
import { computeFocusScale, computeFocusTransform, toViewportPoint } from "./focus-geometry";

describe("computeFocusTransform", () => {
  it("allows the full SwapRat grid to fit a mobile viewport below 8%", () => {
    const grid = { x: 0, y: 0, w: 10080, h: 7080 };
    const fit = computeFocusTransform(grid, 366, 338);
    const scale = clampZoomScale(fit.scale, fit.scale);

    expect(scale).toBeLessThan(0.08);
    expect(fit.x).toBeGreaterThanOrEqual(24);
    expect(fit.y).toBeGreaterThanOrEqual(24);
    expect(fit.x + grid.w * scale).toBeLessThanOrEqual(366 - 24);
    expect(fit.y + grid.h * scale).toBeLessThanOrEqual(338 - 24);
    expect(clampZoomScale(0, fit.scale)).toBe(fit.scale);
    expect(clampZoomScale(0, 0.5)).toBe(0.08);
  });

  it("centres a 1920x1080 rectangle in a 900x600 viewport at the fit-to-tile scale", () => {
    const result = computeFocusTransform({ x: 0, y: 0, w: 1920, h: 1080 }, 900, 600);
    expect(result.scale).toBeCloseTo(0.44375, 5);
    expect(result.x).toBeCloseTo(24, 5);
    expect(result.y).toBeCloseTo(60.375, 5);
  });

  it("does not upscale a rectangle smaller than the viewport past 1:1", () => {
    const result = computeFocusTransform({ x: 0, y: 0, w: 100, h: 100 }, 900, 600);
    expect(result.scale).toBe(1);
    expect(result.x).toBeCloseTo(400, 5);
    expect(result.y).toBeCloseTo(250, 5);
  });

  it("centres a rectangle with a non-zero origin correctly", () => {
    const result = computeFocusTransform({ x: 100, y: 50, w: 800, h: 600 }, 500, 400);
    expect(result.scale).toBeCloseTo(0.565, 5);
    expect(result.x).toBeCloseTo(-32.5, 5);
    expect(result.y).toBeCloseTo(2.25, 5);
  });

  it("clamps the scale above the zoom ceiling instead of applying it, and still centres at the clamped scale", () => {
    // A tile much larger than the viewport wants a scale far above any reasonable zoom ceiling.
    const rect = { x: 0, y: 0, w: 40, h: 40 };
    const viewportWidth = 900;
    const viewportHeight = 600;
    const rawScale = computeFocusScale(rect, viewportWidth, viewportHeight);
    const fitScale = 0.2;
    const ceiling = Math.max(fitScale * 3, 0.8);

    expect(rawScale).toBeGreaterThan(ceiling);

    const clamped = clampZoomScale(rawScale, fitScale);
    expect(clamped).toBe(ceiling);
    expect(clamped).toBeLessThan(rawScale);
  });
});

describe("toViewportPoint", () => {
  it("maps a client point to layout coordinates when the viewport is not visually scaled", () => {
    const point = toViewportPoint(340, 260, { left: 100, top: 60, scaleX: 1, scaleY: 1 });
    expect(point).toEqual({ x: 240, y: 200 });
  });

  it("undoes an ancestor's entrance scale so the zoom anchor stays on the same world point", () => {
    // A dialog mid-entrance renders its 900x600 viewport at 90%: the box starts 10px further in
    // and every client pixel covers 0.9 layout pixels.
    const frame = { left: 55, top: 35, scaleX: 0.9, scaleY: 0.9 };
    const point = toViewportPoint(55 + 450 * 0.9, 35 + 300 * 0.9, frame);
    expect(point.x).toBeCloseTo(450, 10);
    expect(point.y).toBeCloseTo(300, 10);
  });

  it("handles a viewport scaled differently on each axis", () => {
    const point = toViewportPoint(100, 100, { left: 0, top: 0, scaleX: 2, scaleY: 0.5 });
    expect(point).toEqual({ x: 50, y: 200 });
  });
});
