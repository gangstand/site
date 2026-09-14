import type { HomelabSiteId } from "@/shared/api/homelab-status";
import type { TechKey } from "@/shared/ui/tech-logo";

export type NodeCategory = "external" | "edge" | "compute" | "registry" | "ci" | "monitoring" | "database" | "broker" | "cache";
export type DisplayKind = "card" | "zone" | "anchor";
export type ConnectionKind = "flow" | "pipeline" | "monitoring" | "proxy" | "wireguard" | "vpn";
export type RouteHint = "vpn-bottom" | "vpn-right" | "vertical" | "horizontal" | "edge-wireguard" | "proxy-down" | "pipeline-horizontal" | "pipeline-vertical" | "monitoring-left" | "monitoring-right" | "monitoring-bottom" | "orthogonal";

type EntityDeclaration = {
  id: string;
  title: string;
  category: NodeCategory;
  display: DisplayKind;
  parent?: string;
  role?: string;
  logo?: TechKey;
  status?: HomelabSiteId;
  isProxy?: boolean;
  zone?: { type: "host" | "vm"; label: string; detail: string; privateService?: boolean };
};

type EntityIds<Entities extends readonly EntityDeclaration[]> = Entities[number]["id"];
function defineEntities<const Entities extends readonly EntityDeclaration[]>(entities: Entities & { readonly [Index in keyof Entities]: Entities[Index] extends { parent: infer Parent extends string } ? Parent extends EntityIds<Entities> ? unknown : never : unknown }): Entities {
  return entities;
}

export const HOMELAB_ENTITIES = defineEntities([
  { id: "internet", title: "Интернет", category: "external", display: "card", role: "Клиентский трафик" },
  { id: "github", title: "GitHub", category: "external", display: "card", role: "Git repository · webhook", logo: "github" },
  { id: "proxy", title: "Proxy", category: "edge", display: "zone", role: "Внешний VPS", zone: { type: "host", label: "ВНЕШНИЙ VPS · ГЛАВНЫЙ ХОСТ", detail: "Центр приватной сети WireGuard" } },
  { id: "traefik-edge", title: "Traefik", category: "edge", display: "card", parent: "proxy", role: "внешний reverse-proxy", logo: "traefik", status: "traefik", isProxy: true },
  { id: "proxmox", title: "Proxmox VE", category: "compute", display: "anchor", role: "Гипервизор", logo: "proxmox" },
  { id: "docker", title: "Docker", category: "compute", display: "zone", parent: "proxmox", role: "Развёртывание контейнеров из Harbor", logo: "docker", zone: { type: "vm", label: "VIRTUAL MACHINE", detail: "Контейнеры приложений" } },
  { id: "docker-traefik", title: "Traefik", category: "compute", display: "card", parent: "docker", role: "внутренний reverse-proxy", logo: "traefik", status: "root", isProxy: true },
  { id: "grafana", title: "Grafana", category: "compute", display: "card", parent: "docker", role: "дашборды и метрики", logo: "grafana", status: "grafana" },
  { id: "portainer", title: "Portainer", category: "compute", display: "card", parent: "docker", role: "UI управления Docker", logo: "portainer", status: "portainer" },
  { id: "redisinsight", title: "RedisInsight", category: "compute", display: "card", parent: "docker", role: "GUI для Redis", logo: "redisinsight", status: "redisinsight" },
  { id: "postgres", title: "Postgres", category: "database", display: "zone", parent: "proxmox", role: "Основная БД приложения", logo: "postgresql", zone: { type: "vm", label: "VIRTUAL MACHINE", detail: "Основная БД приложения", privateService: true } },
  { id: "rabbitmq", title: "RabbitMQ", category: "broker", display: "zone", parent: "proxmox", role: "Брокер сообщений", logo: "rabbitmq", zone: { type: "vm", label: "VIRTUAL MACHINE", detail: "Брокер сообщений", privateService: true } },
  { id: "harbor", title: "Harbor", category: "registry", display: "zone", parent: "proxmox", role: "Приватный registry образов", logo: "harbor", status: "harbor", zone: { type: "vm", label: "VIRTUAL MACHINE", detail: "Приватный registry образов" } },
  { id: "jenkins", title: "Jenkins", category: "ci", display: "zone", parent: "proxmox", role: "Сборка и доставка приложений", logo: "jenkins", status: "jenkins", zone: { type: "vm", label: "VIRTUAL MACHINE", detail: "Сборка и доставка приложений" } },
  { id: "redis", title: "Redis", category: "cache", display: "zone", parent: "proxmox", role: "Кэш / in-memory store", logo: "redis", zone: { type: "vm", label: "VIRTUAL MACHINE", detail: "Кэш / in-memory store", privateService: true } },
  { id: "zabbix", title: "Zabbix", category: "monitoring", display: "zone", parent: "proxmox", role: "Мониторинг инфраструктуры", logo: "zabbix", status: "zabbix", zone: { type: "vm", label: "VIRTUAL MACHINE", detail: "Мониторинг инфраструктуры" } },
] as const);

export type NodeId = (typeof HOMELAB_ENTITIES)[number]["id"];
export type HomelabNode = Omit<EntityDeclaration, "id" | "parent"> & { id: NodeId; parent?: NodeId };
export type ZoneNode = HomelabNode & { display: "zone"; zone: NonNullable<EntityDeclaration["zone"]> };
export type CardNode = HomelabNode & { display: "card" };

type ConnectionDeclaration = { id: string; from: NodeId; to: NodeId; label?: string; kind: ConnectionKind; routeHint: RouteHint };
function defineConnections<const Connections extends readonly ConnectionDeclaration[]>(connections: Connections & { readonly [Index in keyof Connections]: Connections[Index] extends { from: infer From; to: infer To } ? From extends NodeId ? To extends NodeId ? unknown : never : never : never }): Connections {
  return connections;
}

export const HOMELAB_CONNECTIONS = defineConnections([
  { id: "vpn-docker", from: "proxy", to: "docker", kind: "vpn", label: "WireGuard · Proxy HOST ↔ Docker CLIENT", routeHint: "vpn-bottom" },
  { id: "vpn-jenkins", from: "proxy", to: "jenkins", kind: "vpn", label: "WireGuard · Proxy HOST ↔ Jenkins CLIENT", routeHint: "vpn-bottom" },
  { id: "vpn-harbor", from: "proxy", to: "harbor", kind: "vpn", label: "WireGuard · Proxy HOST ↔ Harbor CLIENT", routeHint: "vpn-bottom" },
  { id: "vpn-postgres", from: "proxy", to: "postgres", kind: "vpn", label: "WireGuard · Proxy HOST ↔ PostgreSQL CLIENT", routeHint: "vpn-right" },
  { id: "vpn-rabbitmq", from: "proxy", to: "rabbitmq", kind: "vpn", label: "WireGuard · Proxy HOST ↔ RabbitMQ CLIENT", routeHint: "vpn-right" },
  { id: "vpn-redis", from: "proxy", to: "redis", kind: "vpn", label: "WireGuard · Proxy HOST ↔ Redis CLIENT", routeHint: "vpn-bottom" },
  { id: "vpn-zabbix", from: "proxy", to: "zabbix", kind: "vpn", label: "WireGuard · Proxy HOST ↔ Zabbix CLIENT", routeHint: "vpn-bottom" },
  { id: "c1", from: "internet", to: "proxy", label: "HTTPS", kind: "flow", routeHint: "vertical" },
  { id: "c2", from: "traefik-edge", to: "docker-traefik", label: "WireGuard · Traefik edge → Traefik internal", kind: "wireguard", routeHint: "horizontal" },
  { id: "wg-harbor", from: "traefik-edge", to: "harbor", label: "HTTP через WireGuard · Harbor", kind: "wireguard", routeHint: "edge-wireguard" },
  { id: "wg-jenkins", from: "traefik-edge", to: "jenkins", label: "HTTP через WireGuard · Jenkins", kind: "wireguard", routeHint: "edge-wireguard" },
  { id: "wg-zabbix", from: "traefik-edge", to: "zabbix", label: "HTTP через WireGuard · Zabbix UI", kind: "wireguard", routeHint: "edge-wireguard" },
  { id: "p2", from: "docker-traefik", to: "grafana", kind: "proxy", routeHint: "proxy-down" },
  { id: "p3", from: "docker-traefik", to: "portainer", kind: "proxy", routeHint: "proxy-down" },
  { id: "p4", from: "docker-traefik", to: "redisinsight", kind: "proxy", routeHint: "proxy-down" },
  { id: "ci-source", from: "github", to: "jenkins", kind: "pipeline", label: "1. GitHub → Jenkins · запуск сборки", routeHint: "pipeline-horizontal" },
  { id: "ci-publish", from: "jenkins", to: "harbor", kind: "pipeline", label: "2. Jenkins → Harbor · публикация образа", routeHint: "pipeline-horizontal" },
  { id: "ci-deploy", from: "harbor", to: "docker", kind: "pipeline", label: "3. Harbor → Docker · развёртывание образа", routeHint: "pipeline-vertical" },
  { id: "mon-docker", from: "docker", to: "zabbix", kind: "monitoring", label: "Docker by Zabbix agent 2 · Linux by Zabbix agent active", routeHint: "monitoring-bottom" },
  { id: "mon-harbor", from: "harbor", to: "zabbix", kind: "monitoring", label: "Docker by Zabbix agent 2 · Linux by Zabbix agent active", routeHint: "monitoring-bottom" },
  { id: "mon-jenkins", from: "jenkins", to: "zabbix", kind: "monitoring", label: "Linux by Zabbix agent active", routeHint: "monitoring-bottom" },
  { id: "mon-postgres", from: "postgres", to: "zabbix", kind: "monitoring", label: "Linux by Zabbix agent active · PostgreSQL by Zabbix agent 2 active", routeHint: "monitoring-right" },
  { id: "mon-proxmox", from: "proxmox", to: "zabbix", kind: "monitoring", label: "Proxmox VE by HTTP", routeHint: "monitoring-right" },
  { id: "mon-proxy", from: "proxy", to: "zabbix", kind: "monitoring", label: "Linux by Zabbix agent active", routeHint: "monitoring-left" },
  { id: "mon-rabbitmq", from: "rabbitmq", to: "zabbix", kind: "monitoring", label: "Linux by Zabbix agent active · RabbitMQ cluster by Zabbix agent · RabbitMQ node by Zabbix agent", routeHint: "monitoring-right" },
  { id: "mon-redis", from: "redis", to: "zabbix", kind: "monitoring", label: "Linux by Zabbix agent active · Redis by Zabbix agent 2", routeHint: "monitoring-bottom" },
] as const);

export type ConnectionId = (typeof HOMELAB_CONNECTIONS)[number]["id"];
export type HomelabConnection = ConnectionDeclaration & { id: ConnectionId };

const entities: readonly HomelabNode[] = HOMELAB_ENTITIES;
export const nodeById = new Map<NodeId, HomelabNode>(entities.map((node) => [node.id, node]));
export const cardNodes = entities.filter((node): node is CardNode => node.display === "card");
export const zoneNodes = entities.filter((node): node is ZoneNode => node.display === "zone");
export const vmCount = zoneNodes.filter((node) => node.zone.type === "vm").length;
export const networkClientsCount = zoneNodes.filter((node) => node.parent === "proxmox").length;
export const statusByNode = new Map<NodeId, HomelabSiteId>(entities.flatMap((node) => node.status ? [[node.id, node.status] as const] : []));
