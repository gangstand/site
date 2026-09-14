import { HOMELAB_ENTITIES, type NodeId, type ZoneNode } from "./nodes";

export type Point = { x: number; y: number };
export type Box = { x: number; y: number; w: number; h: number };
export type Geometry = Record<NodeId, Box>;

const GUTTER = 60;
const VM_W = 290;
const VM_H = 116;
const columns = Array.from({ length: 4 }, (_, index) => 390 + index * (VM_W + GUTTER));
const dockerX = columns[0];
const dockerY = 90;
const dockerW = columns[2] + VM_W - columns[0];
const dockerH = VM_H * 2 + GUTTER;
const bottomY = dockerY + dockerH + GUTTER;
const dockerInnerColumns = Array.from({ length: 4 }, (_, index) => dockerX + (dockerW - (220 * 4 + 20 * 3)) / 2 + index * 240);
const dockerInnerY = dockerY + 140;

export const hypervisor = { x: 360, y: -30, w: columns[3] + VM_W - 330, h: bottomY + VM_H + 65 };
export const layoutMetrics = {
  dockerY,
  dockerH,
  vpnLeftX: -100,
  monitoringBusY: hypervisor.y + hypervisor.h + 45,
  monitoringRightX: hypervisor.x + hypervisor.w + 45,
  trafficBusY: hypervisor.y + hypervisor.h + 75,
  vpnRightX: hypervisor.x + hypervisor.w + 75,
  vpnBusY: hypervisor.y + hypervisor.h + 105,
  dockerVpnX: columns[0] + VM_W + GUTTER / 2 - 12,
};

export const geometry: Geometry = {
  internet: { x: 35, y: dockerY - (GUTTER + (VM_H - 94) / 2) - 94, w: 220, h: 94 },
  github: { x: 35, y: bottomY + (VM_H - 94) / 2, w: 220, h: 94 },
  proxy: { x: 0, y: dockerY, w: VM_W, h: dockerH },
  "traefik-edge": { x: 35, y: dockerInnerY, w: 220, h: 94 },
  proxmox: hypervisor,
  docker: { x: dockerX, y: dockerY, w: dockerW, h: dockerH },
  "docker-traefik": { x: dockerInnerColumns[0], y: dockerInnerY, w: 220, h: 94 },
  grafana: { x: dockerInnerColumns[2], y: dockerInnerY, w: 220, h: 94 },
  portainer: { x: dockerInnerColumns[1], y: dockerInnerY, w: 220, h: 94 },
  redisinsight: { x: dockerInnerColumns[3], y: dockerInnerY, w: 220, h: 94 },
  postgres: { x: columns[3], y: dockerY, w: VM_W, h: VM_H },
  rabbitmq: { x: columns[3], y: dockerY + VM_H + GUTTER, w: VM_W, h: VM_H },
  harbor: { x: columns[1], y: bottomY, w: VM_W, h: VM_H },
  jenkins: { x: columns[0], y: bottomY, w: VM_W, h: VM_H },
  redis: { x: columns[2], y: bottomY, w: VM_W, h: VM_H },
  zabbix: { x: columns[3], y: bottomY, w: VM_W, h: VM_H },
};

const entityIds = new Set(HOMELAB_ENTITIES.map((entity) => entity.id));
for (const id of Object.keys(geometry)) if (!entityIds.has(id as NodeId)) throw new Error(`Geometry references unknown node: ${id}`);
for (const entity of HOMELAB_ENTITIES) if (!geometry[entity.id]) throw new Error(`Missing geometry for node: ${entity.id}`);

export type LayoutNode = import("./nodes").HomelabNode & Box;
export const layoutNodes: LayoutNode[] = HOMELAB_ENTITIES.map((node) => ({ ...node, ...geometry[node.id] }));
export const layoutNodeById = new Map<NodeId, LayoutNode>(layoutNodes.map((node) => [node.id, node]));

export function getLayoutNode(id: NodeId): LayoutNode {
  const node = layoutNodeById.get(id);
  if (!node) throw new Error(`Missing projected node: ${id}`);
  return node;
}

export function getZoneLayoutNode(id: ZoneNode["id"]): ZoneNode & Box {
  const node = getLayoutNode(id);
  if (node.display !== "zone" || !node.zone) throw new Error(`Node is not a zone: ${id}`);
  return { ...node, display: "zone", zone: node.zone };
}
