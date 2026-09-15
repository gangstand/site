export interface ColumnLayoutTile {
  width: number;
  height: number;
}

export interface ColumnLayoutPosition {
  x: number;
  y: number;
}

/**
 * Places tiles of a shared width into `columns` equal-width columns, each tile going
 * into whichever column is currently shortest. Input order is preserved positionally
 * (it becomes reading order within each column), not visually row-by-row.
 */
export function packColumns(tiles: ColumnLayoutTile[], columns: number, gap: number): ColumnLayoutPosition[] {
  const columnHeights = new Array(columns).fill(0) as number[];

  return tiles.map((tile) => {
    const columnIndex = columnHeights.indexOf(Math.min(...columnHeights));
    const x = columnIndex * (tile.width + gap);
    const y = columnHeights[columnIndex];
    columnHeights[columnIndex] = y + tile.height + gap;
    return { x, y };
  });
}
