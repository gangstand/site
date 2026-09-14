import { geometry, layoutMetrics, type Box, type Point } from "./layout";
import { HOMELAB_CONNECTIONS, nodeById, type HomelabConnection } from "./nodes";
import { routeOrthogonal, svgPath } from "./router";

export type HomelabConnectionRoute = HomelabConnection & { points: Point[]; d: string; labelX: number; labelY: number };

const centerBottom = (box: Box) => ({ x: box.x + box.w / 2, y: box.y + box.h });
const centerRight = (box: Box) => ({ x: box.x + box.w, y: box.y + box.h / 2 });
const centerLeft = (box: Box) => ({ x: box.x, y: box.y + box.h / 2 });

function route(connection: HomelabConnection): Point[] {
  const from = geometry[connection.from], to = geometry[connection.to], metrics = layoutMetrics;
  switch (connection.routeHint) {
    case "vpn-bottom": {
      const start = { x: from.x, y: from.y + from.h / 2 - 24 }, x = connection.to === "docker" ? metrics.dockerVpnX : to.x + to.w / 2 - 24;
      return [start, { x: metrics.vpnLeftX, y: start.y }, { x: metrics.vpnLeftX, y: metrics.vpnBusY }, { x, y: metrics.vpnBusY }, { x, y: to.y + to.h }];
    }
    case "vpn-right": {
      const start = { x: from.x, y: from.y + from.h / 2 - 24 }, y = to.y + to.h / 2 - 18;
      return [start, { x: metrics.vpnLeftX, y: start.y }, { x: metrics.vpnLeftX, y: metrics.vpnBusY }, { x: metrics.vpnRightX, y: metrics.vpnBusY }, { x: metrics.vpnRightX, y }, { x: to.x + to.w, y }];
    }
    case "vertical": return [{ x: from.x + from.w / 2, y: from.y + from.h }, { x: to.x + to.w / 2, y: to.y }];
    case "horizontal": return [centerRight(from), centerLeft(to)];
    case "edge-wireguard": {
      const start = centerRight(from), x = to.x + to.w / 2 + 24;
      return [{ x: geometry.proxy.x, y: start.y }, { x: -75, y: start.y }, { x: -75, y: metrics.trafficBusY }, { x, y: metrics.trafficBusY }, { x, y: to.y + to.h }];
    }
    case "proxy-down": {
      const start = centerBottom(from), end = centerBottom(to), y = from.y + from.h + 20;
      return [start, { x: start.x, y }, { x: end.x, y }, end];
    }
    case "pipeline-horizontal": return [centerRight(from), centerLeft(to)];
    case "pipeline-vertical": return [{ x: from.x + from.w / 2, y: from.y }, { x: from.x + from.w / 2, y: to.y + to.h }];
    case "monitoring-left": {
      const start = centerLeft(from), end = centerBottom(to);
      return [start, { x: -50, y: start.y }, { x: -50, y: metrics.monitoringBusY }, { x: end.x, y: metrics.monitoringBusY }, end];
    }
    case "monitoring-right": {
      const y = connection.from === "proxmox" ? from.y + 65 : from.y + from.h / 2, end = centerBottom(to);
      return [{ x: from.x + from.w, y }, { x: metrics.monitoringRightX, y }, { x: metrics.monitoringRightX, y: metrics.monitoringBusY }, { x: end.x, y: metrics.monitoringBusY }, end];
    }
    case "monitoring-bottom": {
      const start = { x: connection.from === "docker" ? layoutMetrics.dockerVpnX + 12 : from.x + from.w / 2, y: from.y + from.h }, end = centerBottom(to);
      return [start, { x: start.x, y: metrics.monitoringBusY }, { x: end.x, y: metrics.monitoringBusY }, end];
    }
    case "orthogonal": return routeOrthogonal(from, to, Object.values(geometry));
  }
}

export function projectScene() {
  const connections: HomelabConnectionRoute[] = HOMELAB_CONNECTIONS.map((connection) => {
    const points = route(connection), first = points[0], last = points[points.length - 1];
    return { ...connection, points, d: svgPath(points), labelX: (first.x + last.x) / 2 + (first.x === last.x ? 16 : 0), labelY: (first.y + last.y) / 2 + (first.x === last.x ? 4 : -12) };
  });
  const points = connections.flatMap((connection) => connection.points);
  const minX = Math.min(...Object.values(geometry).map((box) => box.x), ...points.map((point) => point.x), layoutMetrics.vpnLeftX - 30);
  const minY = Math.min(...Object.values(geometry).map((box) => box.y), ...points.map((point) => point.y), -90);
  const maxX = Math.max(...Object.values(geometry).map((box) => box.x + box.w), ...points.map((point) => point.x), layoutMetrics.vpnRightX + 30);
  const maxY = Math.max(...Object.values(geometry).map((box) => box.y + box.h), ...points.map((point) => point.y), layoutMetrics.vpnBusY + 30);
  return { connections, nodeById, bounds: { x: minX, y: minY, w: maxX - minX, h: maxY - minY }, svg: { width: maxX - minX, height: maxY - minY } };
}

export const scene = projectScene();
