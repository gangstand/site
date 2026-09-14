import type { Box, Point } from "./layout";

const contains = (outer: Box, inner: Box) => outer !== inner && inner.x >= outer.x && inner.y >= outer.y && inner.x + inner.w <= outer.x + outer.w && inner.y + inner.h <= outer.y + outer.h;
const clearAgainst = (obstacles: Box[]) => (a: Point, b: Point) => !obstacles.some((box) => {
  const left = box.x - 12, right = box.x + box.w + 12, top = box.y - 12, bottom = box.y + box.h + 12;
  return a.x === b.x ? a.x > left && a.x < right && Math.max(a.y, b.y) > top && Math.min(a.y, b.y) < bottom : a.y > top && a.y < bottom && Math.max(a.x, b.x) > left && Math.min(a.x, b.x) < right;
});
const simplify = (points: Point[]) => points.filter((point, index, all) => !index || index === all.length - 1 || !((all[index - 1].x === point.x && point.x === all[index + 1].x) || (all[index - 1].y === point.y && point.y === all[index + 1].y)));

export function routeOrthogonal(from: Box, to: Box, obstacles: Box[]): Point[] {
  const horizontal = Math.abs(from.x - to.x) > Math.abs(from.y - to.y);
  const sign = Math.sign(horizontal ? to.x - from.x : to.y - from.y);
  const startEdge = horizontal ? { x: from.x + (sign > 0 ? from.w : 0), y: from.y + from.h / 2 } : { x: from.x + from.w / 2, y: from.y + (sign > 0 ? from.h : 0) };
  const endEdge = horizontal ? { x: to.x + (sign > 0 ? 0 : to.w), y: to.y + to.h / 2 } : { x: to.x + to.w / 2, y: to.y + (sign > 0 ? 0 : to.h) };
  const start = { x: startEdge.x + (horizontal ? sign * 24 : 0), y: startEdge.y + (horizontal ? 0 : sign * 24) };
  const end = { x: endEdge.x - (horizontal ? sign * 24 : 0), y: endEdge.y - (horizontal ? 0 : sign * 24) };
  const clear = clearAgainst(obstacles.filter((box) => !(contains(box, from) || contains(box, to))));
  const candidates = [[startEdge, start, { x: end.x, y: start.y }, end, endEdge], [startEdge, start, { x: start.x, y: end.y }, end, endEdge]];
  const valid = candidates.filter((points) => points.every((point, index) => !index || clear(points[index - 1], point)));
  if (valid.length) return simplify(valid.sort((left, right) => length(left) - length(right))[0]);
  throw new Error("No orthogonal route available");
}

const length = (points: Point[]) => points.reduce((sum, point, index) => index ? sum + Math.abs(point.x - points[index - 1].x) + Math.abs(point.y - points[index - 1].y) : sum, 0);
export const svgPath = (points: Point[]) => points.map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`).join(" ");
