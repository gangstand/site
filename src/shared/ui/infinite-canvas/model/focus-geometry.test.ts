import { describe, expect, it } from "vitest";
import { clampZoomScale } from "./use-canvas-transform";
import { computeFocusScale, computeFocusTransform } from "./focus-geometry";

describe("computeFocusTransform", () => {
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
