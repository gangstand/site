import { HOMELAB_NODES, type HomelabNode, type ConnectionKind } from './nodes';

export type LayoutNode = HomelabNode & { x: number; y: number; w: number; h: number };

const GUTTER = 60;
const VM_W = 290;
const VM_H = 116;
const COL = Array.from({ length: 4 }, (_, index) => 390 + index * (VM_W + GUTTER));
const DOCKER_X = COL[0];
const DOCKER_Y = 90;
const DOCKER_W = COL[2] + VM_W - COL[0];
const STACK_H = VM_H;
const STACK_GUTTER = GUTTER;
const DOCKER_H = STACK_H * 2 + STACK_GUTTER;
const BOTTOM_Y = DOCKER_Y + DOCKER_H + GUTTER;

export const hypervisor = { x: 360, y: -30, w: COL[3] + VM_W - 360 + 30, h: BOTTOM_Y + VM_H + 35 - -30 };

export const zones = [
  { id: 'edge', label: 'ВНЕШНИЙ VPS · ГЛАВНЫЙ ХОСТ', name: 'Proxy', detail: 'Центр приватной сети WireGuard', x: 0, y: DOCKER_Y, w: VM_W, h: DOCKER_H },
  { id: 'docker', label: 'VIRTUAL MACHINE', name: 'Docker', detail: 'Контейнеры приложений', logo: 'docker' as const, x: DOCKER_X, y: DOCKER_Y, w: DOCKER_W, h: DOCKER_H },
  { id: 'postgres-vm', label: 'VIRTUAL MACHINE', name: 'Postgres', detail: 'Основная БД приложения', logo: 'postgresql' as const, x: COL[3], y: DOCKER_Y, w: VM_W, h: STACK_H },
  { id: 'rabbitmq-vm', label: 'VIRTUAL MACHINE', name: 'RabbitMQ', detail: 'Брокер сообщений', logo: 'rabbitmq' as const, x: COL[3], y: DOCKER_Y + STACK_H + STACK_GUTTER, w: VM_W, h: STACK_H },
  { id: 'harbor-vm', label: 'VIRTUAL MACHINE', name: 'Harbor', detail: 'Приватный registry образов', logo: 'harbor' as const, x: COL[1], y: BOTTOM_Y, w: VM_W, h: VM_H },
  { id: 'jenkins-vm', label: 'VIRTUAL MACHINE', name: 'Jenkins', detail: 'Сборка и доставка приложений', logo: 'jenkins' as const, x: COL[0], y: BOTTOM_Y, w: VM_W, h: VM_H },
  { id: 'redis-vm', label: 'VIRTUAL MACHINE', name: 'Redis', detail: 'Кэш / in-memory store', logo: 'redis' as const, x: COL[2], y: BOTTOM_Y, w: VM_W, h: VM_H },
  { id: 'zabbix-vm', label: 'VIRTUAL MACHINE', name: 'Zabbix', detail: 'Мониторинг инфраструктуры', logo: 'zabbix' as const, x: COL[3], y: BOTTOM_Y, w: VM_W, h: VM_H },
];

export type HomelabZone = (typeof zones)[number];

const DOCKER_INNER_COL = Array.from({ length: 4 }, (_, index) =>
  DOCKER_X + (DOCKER_W - (220 * 4 + 20 * 3)) / 2 + index * 240);
const DOCKER_INNER_Y = DOCKER_Y + 140;
const CARD_H = 94;
const EXTERNAL_GAP = GUTTER + (VM_H - CARD_H) / 2;
const positions: Record<string, [number, number]> = {
  internet: [35, DOCKER_Y - EXTERNAL_GAP - CARD_H],
  github: [35, BOTTOM_Y + (VM_H - CARD_H) / 2],
  'traefik-edge': [35, DOCKER_INNER_Y],
  'docker-traefik': [DOCKER_INNER_COL[0], DOCKER_INNER_Y], grafana: [DOCKER_INNER_COL[2], DOCKER_INNER_Y],
  portainer: [DOCKER_INNER_COL[1], DOCKER_INNER_Y], redisinsight: [DOCKER_INNER_COL[3], DOCKER_INNER_Y],
};
const vmZone: Record<string, string> = {
  docker: 'docker',
  postgres: 'postgres-vm', rabbitmq: 'rabbitmq-vm', redis: 'redis-vm',
  harbor: 'harbor-vm', jenkins: 'jenkins-vm', zabbix: 'zabbix-vm',
};
const zoneById = new Map(zones.map(z => [z.id, z]));

export const nodes: LayoutNode[] = HOMELAB_NODES.map(node => {
  if (node.isVm) {
    const zone = zoneById.get(vmZone[node.id])!;
    return { ...node, x: zone.x, y: zone.y, w: zone.w, h: zone.h };
  }
  const [x, y] = positions[node.id];
  return { ...node, x, y, w: 220, h: CARD_H };
});

export const monitoringAnchors: LayoutNode[] = [
  { ...zones[0], id: 'proxy', title: 'Proxy', category: 'edge', role: 'Внешний VPS' },
  { id: 'proxmox', title: 'Proxmox VE', category: 'compute', role: 'Гипервизор', logo: 'proxmox', ...hypervisor },
];
const MONITORING_BUS_Y = hypervisor.y + hypervisor.h + 45;
const MONITORING_RIGHT_X = hypervisor.x + hypervisor.w + 45;
const TRAFFIC_BUS_Y = MONITORING_BUS_Y + 30;
const TRAFFIC_RIGHT_X = hypervisor.x + hypervisor.w + 20;
const VPN_RIGHT_X = MONITORING_RIGHT_X + 30;
const VPN_LEFT_X = -100;
const VPN_BUS_Y = TRAFFIC_BUS_Y + 30;
export const bounds = { x: VPN_LEFT_X - 30, y: -90, w: VPN_RIGHT_X - VPN_LEFT_X + 60, h: VPN_BUS_Y + 90 + 30 };

type Point = { x: number; y: number };
type Box = { x: number; y: number; w: number; h: number };
const obstacles: Box[] = [...nodes, { x: 0, y: 380, w: 290, h: 250 }];
const clearAgainst = (list: Box[]) => (a: Point, b: Point) => !list.some(n => {
  const l = n.x - 12, r = n.x + n.w + 12, t = n.y - 12, d = n.y + n.h + 12;
  return a.x === b.x ? a.x > l && a.x < r && Math.max(a.y, b.y) > t && Math.min(a.y, b.y) < d
    : a.y > t && a.y < d && Math.max(a.x, b.x) > l && Math.min(a.x, b.x) < r;
});
const contains = (outer: Box, inner: Box) =>
  outer !== inner && inner.x >= outer.x && inner.y >= outer.y && inner.x + inner.w <= outer.x + outer.w && inner.y + inner.h <= outer.y + outer.h;

export function route(from: LayoutNode, to: LayoutNode, kind?: ConnectionKind): Point[] {
  if (kind === 'vpn') {
    const start = { x: from.x, y: from.y + from.h / 2 - 24 };
    const points = [start, { x: VPN_LEFT_X, y: start.y }, { x: VPN_LEFT_X, y: VPN_BUS_Y }];
    if (to.id === 'postgres' || to.id === 'rabbitmq') {
      const y = to.y + to.h / 2 - 18;
      return [...points, { x: VPN_RIGHT_X, y: VPN_BUS_Y }, { x: VPN_RIGHT_X, y }, { x: to.x + to.w, y }];
    }
    const x = to.id === 'docker' ? COL[0] + VM_W + GUTTER / 2 - 12 : to.x + to.w / 2 - 24;
    return [...points, { x, y: VPN_BUS_Y }, { x, y: to.y + to.h }];
  }
  if (from.id === 'internet' && to.id === 'proxy') {
    const x = from.x + from.w / 2;
    return [{ x, y: from.y + from.h }, { x, y: to.y }];
  }
  if (from.id === 'traefik-edge') {
    const start = { x: from.x + from.w, y: from.y + from.h / 2 };
    if (to.id === 'docker-traefik') return [start, { x: to.x, y: to.y + to.h / 2 }];
    const corridorX = -75;
    const corridorY = TRAFFIC_BUS_Y;
    const points = [{ x: zones[0].x, y: start.y }, { x: corridorX, y: start.y }, { x: corridorX, y: corridorY }];
    if (to.id === 'rabbitmq') {
      const x = TRAFFIC_RIGHT_X;
      const y = to.y + to.h / 2;
      return [...points, { x, y: corridorY }, { x, y }, { x: to.x + to.w, y }];
    }
    const x = to.x + to.w / 2 + 24;
    return [...points, { x, y: corridorY }, { x, y: to.y + to.h }];
  }
  if (from.id === 'docker-traefik' && kind === 'proxy') {
    const x = from.x + from.w / 2;
    const targetX = to.x + to.w / 2;
    const y = DOCKER_Y + DOCKER_H - 28;
    return [{ x, y: from.y + from.h }, { x, y }, { x: targetX, y }, { x: targetX, y: to.y + to.h }];
  }
  if (kind === 'monitoring' && to.id === 'zabbix') {
    const targetX = to.x + to.w / 2;
    const end = [{ x: targetX, y: MONITORING_BUS_Y }, { x: targetX, y: to.y + to.h }];
    if (from.id === 'proxy' || from.id === 'traefik-edge') {
      const y = from.y + from.h / 2;
      return [{ x: from.x, y }, { x: -50, y }, { x: -50, y: MONITORING_BUS_Y }, ...end];
    }
    if (['proxmox', 'postgres', 'rabbitmq'].includes(from.id)) {
      const y = from.id === 'proxmox' ? from.y + 65 : from.y + from.h / 2;
      return [{ x: from.x + from.w, y }, { x: MONITORING_RIGHT_X, y }, { x: MONITORING_RIGHT_X, y: MONITORING_BUS_Y }, ...end];
    }
    const x = from.id === 'docker' ? COL[0] + VM_W + GUTTER / 2 : from.x + from.w / 2;
    return [{ x, y: from.y + from.h }, { x, y: MONITORING_BUS_Y }, ...end];
  }
  if (from.id === 'docker-traefik' && ['grafana', 'portainer', 'redisinsight'].includes(to.id)) {
    const busY = from.y + from.h + 20;
    const x1 = from.x + from.w / 2;
    const x2 = to.x + to.w / 2;
    return [{ x: x1, y: from.y + from.h }, { x: x1, y: busY }, { x: x2, y: busY }, { x: x2, y: to.y + to.h }];
  }
  if ((from.id === 'github' && to.id === 'jenkins') || (from.id === 'jenkins' && to.id === 'harbor')) {
    return [{ x: from.x + from.w, y: from.y + from.h / 2 }, { x: to.x, y: to.y + to.h / 2 }];
  }
  if (from.id === 'harbor' && to.id === 'docker') {
    const x = from.x + from.w / 2;
    return [{ x, y: from.y }, { x, y: to.y + to.h }];
  }
  const horizontal = Math.abs(from.x - to.x) > Math.abs(from.y - to.y);
  const sign = horizontal ? Math.sign(to.x - from.x) : Math.sign(to.y - from.y);
  const a = horizontal ? { x: from.x + (sign > 0 ? from.w : 0), y: from.y + from.h / 2 } : { x: from.x + from.w / 2, y: from.y + (sign > 0 ? from.h : 0) };
  const b = horizontal ? { x: to.x + (sign > 0 ? 0 : to.w), y: to.y + to.h / 2 } : { x: to.x + to.w / 2, y: to.y + (sign > 0 ? 0 : to.h) };
  const start = { x: a.x + (horizontal ? sign * 24 : 0), y: a.y + (horizontal ? 0 : sign * 24) };
  const end = { x: b.x - (horizontal ? sign * 24 : 0), y: b.y - (horizontal ? 0 : sign * 24) };

  const localObstacles = obstacles.filter(n => !(contains(n, from) || contains(n, to)));
  const clear = clearAgainst(localObstacles);

  const segmentLength = (p: Point, q: Point) => Math.abs(p.x - q.x) + Math.abs(p.y - q.y);
  const segmentClear = (p: Point, q: Point) => clear(p, q);
  const candidates: Point[][] = [
    [a, start, { x: end.x, y: start.y }, end, b],
    [a, start, { x: start.x, y: end.y }, end, b],
  ];
  const valid = candidates.filter(points => points.every((point, index) => index === 0 || segmentClear(points[index - 1], point)));
  if (valid.length) {
    valid.sort((left, right) => left.reduce((sum, p, i) => i ? sum + segmentLength(left[i - 1], p) : 0, 0) - right.reduce((sum, p, i) => i ? sum + segmentLength(right[i - 1], p) : 0, 0));
    return valid[0].filter((p, i, all) => !i || i === all.length - 1 || !((all[i - 1].x === p.x && p.x === all[i + 1].x) || (all[i - 1].y === p.y && p.y === all[i + 1].y)));
  }

  const xs = [...new Set([start.x, end.x, ...localObstacles.flatMap(n => [n.x - 24, n.x + n.w + 24])])].sort((a,b) => a-b);
  const ys = [...new Set([start.y, end.y, ...localObstacles.flatMap(n => [n.y - 24, n.y + n.h + 24])])].sort((a,b) => a-b);
  const key = (x: number, y: number) => y * xs.length + x;
  const source = key(xs.indexOf(start.x), ys.indexOf(start.y));
  const target = key(xs.indexOf(end.x), ys.indexOf(end.y));
  const dist = new Map<number, number>([[source, 0]]), prev = new Map<number, number>();
  const pending = new Set([source]);
  while (pending.size) {
    let current = -1, best = Infinity;
    for (const id of pending) if (dist.get(id)! < best) { current = id; best = dist.get(id)!; }
    pending.delete(current);
    if (current === target) break;
    const x = current % xs.length, y = Math.floor(current / xs.length);
    for (const [nx, ny] of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]]) {
      if (nx < 0 || ny < 0 || nx >= xs.length || ny >= ys.length) continue;
      const p = { x: xs[x], y: ys[y] }, q = { x: xs[nx], y: ys[ny] };
      if (!clear(p,q)) continue;
      const id = key(nx,ny), cost = best + Math.abs(p.x-q.x) + Math.abs(p.y-q.y);
      if (cost < (dist.get(id) ?? Infinity)) { dist.set(id,cost); prev.set(id,current); pending.add(id); }
    }
  }
  if (!dist.has(target)) throw new Error(`No route: ${from.id} → ${to.id}`);
  const points: Point[] = [b];
  for (let id: number | undefined = target; id !== undefined; id = prev.get(id)) points.push({ x: xs[id % xs.length], y: ys[Math.floor(id / xs.length)] });
  points.push(a);
  return points.reverse().filter((p,i,all) => !i || i === all.length-1 || !((all[i-1].x === p.x && p.x === all[i+1].x) || (all[i-1].y === p.y && p.y === all[i+1].y)));
}

export function path(points: Point[]) { return points.map((p,i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' '); }
