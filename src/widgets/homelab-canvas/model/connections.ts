import { HOMELAB_CONNECTIONS } from "./nodes";
import { nodes as HOMELAB_NODES, monitoringAnchors, path, route } from "./layout";

export const byId = new Map([...HOMELAB_NODES, ...monitoringAnchors].map((n) => [n.id, n]));

export const connections = HOMELAB_CONNECTIONS.map((c) => {
  const points = route(byId.get(c.from)!, byId.get(c.to)!, c.kind);
  const first = points[0],
    last = points[points.length - 1];
  return {
    ...c,
    d: path(points),
    labelX: (first.x + last.x) / 2 + (first.x === last.x ? 16 : 0),
    labelY: (first.y + last.y) / 2 + (first.x === last.x ? 4 : -12),
  };
});

export type HomelabConnectionRoute = (typeof connections)[number];
