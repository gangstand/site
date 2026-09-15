import { describe, expect, it } from "vitest";
import { packColumns } from "./column-layout";

function overlaps(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
) {
  return a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
}

describe("packColumns", () => {
  const heights = [640, 210, 480, 90, 520, 300, 150, 900, 60, 410, 230, 340];
  const width = 1000;
  const gap = 20;
  const tiles = heights.map((height) => ({ width, height }));

  it("places no two tiles overlapping", () => {
    const positions = packColumns(tiles, 4, gap);
    const rects = positions.map((position, index) => ({ ...position, width: tiles[index].width, height: tiles[index].height }));

    for (let i = 0; i < rects.length; i += 1) {
      for (let j = i + 1; j < rects.length; j += 1) {
        expect(overlaps(rects[i], rects[j])).toBe(false);
      }
    }
  });

  it("keeps columns balanced within one tile's height of each other", () => {
    const columns = 4;
    const positions = packColumns(tiles, columns, gap);

    const columnBottoms = new Array(columns).fill(0);
    positions.forEach((position, index) => {
      const columnIndex = position.x / (width + gap);
      const bottom = position.y + tiles[index].height + gap;
      columnBottoms[columnIndex] = Math.max(columnBottoms[columnIndex], bottom);
    });

    const spread = Math.max(...columnBottoms) - Math.min(...columnBottoms);
    expect(spread).toBeLessThanOrEqual(Math.max(...heights) + gap);
  });

  it("places tiles into the currently shortest column", () => {
    const positions = packColumns(tiles, 3, gap);
    expect(positions).toHaveLength(tiles.length);
    for (const position of positions) {
      expect(position.x).toBeGreaterThanOrEqual(0);
      expect(position.y).toBeGreaterThanOrEqual(0);
    }
  });
});
