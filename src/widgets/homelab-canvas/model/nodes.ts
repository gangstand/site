import type { TechKey } from "@/shared/ui/tech-logo";

export type NodeCategory =
  | "external"
  | "edge"
  | "compute"
  | "registry"
  | "ci"
  | "monitoring"
  | "database"
  | "broker"
  | "cache";

export interface HomelabService {
  name: string;
  detail?: string;
  logo?: TechKey;
}

export interface HomelabBadge {
  label: string;
  logo?: TechKey;
}

export interface HomelabNode {
  id: string;
  title: string;
  category: NodeCategory;
  logo?: TechKey;
  /** Marks a service as the reverse-proxy fronting the other blocks in its group. */
  isProxy?: boolean;
  /** A dedicated virtual machine inside Proxmox. */
  isVm?: boolean;
  role?: string;
  os?: string;
  services: HomelabService[];
  badges: HomelabBadge[];
  notes?: string[];
}

export type ConnectionKind = "flow" | "pipeline" | "monitoring" | "proxy" | "wireguard" | "vpn";

export interface HomelabConnection {
  id: string;
  from: string;
  to: string;
  label?: string;
  kind: ConnectionKind;
}

export const HOMELAB_NODES: HomelabNode[] = [
  { id: "docker", title: "Docker", category: "compute", logo: "docker", isVm: true, role: "Развёртывание контейнеров из Harbor", services: [], badges: [] },
  {
    id: "internet",
    title: "Интернет",
    category: "external",
    role: "Клиентский трафик",
    services: [],
    badges: [{ label: "HTTPS" }],
  },
  {
    id: "github",
    title: "GitHub",
    category: "external",
    role: "Git repository · webhook",
    logo: "github",
    services: [],
    badges: [{ label: "Git" }],
  },

  // ── Proxy (edge VPS) — split into its actual OS-level services ──
  {
    id: "traefik-edge",
    title: "Traefik",
    category: "edge",
    role: "внешний reverse-proxy",
    logo: "traefik",
    isProxy: true,
    notes: ["HTTPS и TLS завершаются на VPS; к домашним сервисам идёт HTTP внутри WireGuard.", "Dashboard Traefik обслуживается на VPS через api@internal и защищён Basic Auth."],
    services: [],
    badges: [],
  },

  // ── Docker-host — reverse-proxy + the 4 containers it fronts ──
  {
    id: "docker-traefik",
    title: "Traefik",
    category: "compute",
    role: "внутренний reverse-proxy",
    logo: "traefik",
    isProxy: true,
    services: [],
    badges: [],
  },
  {
    id: "grafana",
    title: "Grafana",
    category: "compute",
    role: "дашборды и метрики",
    logo: "grafana",
    services: [],
    badges: [],
  },
  {
    id: "portainer",
    title: "Portainer",
    category: "compute",
    role: "UI управления Docker",
    logo: "portainer",
    services: [],
    badges: [],
  },
  {
    id: "redisinsight",
    notes: ["Доступ через внешний и внутренний Traefik. Basic Auth применяется на VPS."],
    title: "RedisInsight",
    category: "compute",
    role: "GUI для Redis",
    logo: "redisinsight",
    services: [],
    badges: [],
  },

  // Dedicated Proxmox VMs, intentionally shown without internal services.
  { id: "harbor", title: "Harbor", category: "registry", role: "Приватный registry образов", logo: "harbor", isVm: true, services: [], badges: [] },
  { id: "jenkins", title: "Jenkins", category: "ci", role: "Сборка и доставка приложений", logo: "jenkins", isVm: true, services: [], badges: [] },
  { id: "zabbix", title: "Zabbix", category: "monitoring", role: "Мониторинг инфраструктуры", logo: "zabbix", isVm: true, services: [], badges: [] },

  // ── Data layer — unchanged single-service hosts ──
  {
    id: "postgres",
    isVm: true,
    title: "Postgres",
    category: "database",
    role: "Основная БД приложения",
    os: "Debian",
    services: [{ name: "postgresql", detail: "только приватная сеть", logo: "postgresql" }],
    badges: [{ label: "PostgreSQL", logo: "postgresql" }],
  },
  {
    id: "rabbitmq",
    isVm: true,
    title: "RabbitMQ",
    category: "broker",
    role: "Брокер сообщений",
    os: "Debian",
    services: [
      { name: "rabbitmq-server", logo: "rabbitmq" },
      { name: "epmd", logo: "erlang" },
    ],
    badges: [
      { label: "RabbitMQ", logo: "rabbitmq" },
      { label: "Erlang/OTP", logo: "erlang" },
    ],
  },
  {
    id: "redis",
    isVm: true,
    title: "Redis",
    category: "cache",
    role: "Кэш / in-memory store",
    os: "Debian",
    services: [{ name: "redis-server", detail: "только приватная сеть", logo: "redis" }],
    badges: [{ label: "Redis", logo: "redis" }],
  },
];

export const HOMELAB_WIREGUARD = {
  name: "Приватная сеть",
  host: "Proxy",
  description: "Внутренний трафик между Proxy и VM передаётся по зашифрованным туннелям WireGuard.",
};

export const HOMELAB_WIREGUARD_ADDRESSES: Record<string, string> = {
  edge: "10.100.0.1",
  docker: "10.100.0.2",
  "harbor-vm": "10.100.0.3",
  "jenkins-vm": "10.100.0.4",
  "zabbix-vm": "10.100.0.5",
  "postgres-vm": "10.100.0.6",
  "rabbitmq-vm": "10.100.0.7",
  "redis-vm": "10.100.0.8",
};

export const HOMELAB_CONNECTIONS: HomelabConnection[] = [
  { id: "vpn-docker", from: "proxy", to: "docker", kind: "vpn", label: "WireGuard · Proxy HOST ↔ Docker CLIENT" },
  { id: "vpn-jenkins", from: "proxy", to: "jenkins", kind: "vpn", label: "WireGuard · Proxy HOST ↔ Jenkins CLIENT" },
  { id: "vpn-harbor", from: "proxy", to: "harbor", kind: "vpn", label: "WireGuard · Proxy HOST ↔ Harbor CLIENT" },
  { id: "vpn-postgres", from: "proxy", to: "postgres", kind: "vpn", label: "WireGuard · Proxy HOST ↔ PostgreSQL CLIENT" },
  { id: "vpn-rabbitmq", from: "proxy", to: "rabbitmq", kind: "vpn", label: "WireGuard · Proxy HOST ↔ RabbitMQ CLIENT" },
  { id: "vpn-redis", from: "proxy", to: "redis", kind: "vpn", label: "WireGuard · Proxy HOST ↔ Redis CLIENT" },
  { id: "vpn-zabbix", from: "proxy", to: "zabbix", kind: "vpn", label: "WireGuard · Proxy HOST ↔ Zabbix CLIENT" },
  // ── Traffic — mirrors the Traefik routers: HTTPS terminates on the edge
  // VPS, then every request is forwarded to its home-network target over
  // WireGuard. Internal Traefik further fans out to the Docker containers.
  { id: "c1", from: "internet", to: "proxy", label: "HTTPS", kind: "flow" },
  { id: "c2", from: "traefik-edge", to: "docker-traefik", label: "WireGuard · Traefik edge → Traefik internal", kind: "wireguard" },
  { id: "wg-harbor", from: "traefik-edge", to: "harbor", label: "HTTP через WireGuard · Harbor", kind: "wireguard" },
  { id: "wg-jenkins", from: "traefik-edge", to: "jenkins", label: "HTTP через WireGuard · Jenkins", kind: "wireguard" },
  { id: "wg-zabbix", from: "traefik-edge", to: "zabbix", label: "HTTP через WireGuard · Zabbix UI", kind: "wireguard" },
  { id: "wg-rabbitmq", from: "traefik-edge", to: "rabbitmq", label: "HTTP через WireGuard · RabbitMQ Management UI", kind: "wireguard" },
  { id: "p2", from: "docker-traefik", to: "grafana", kind: "proxy" },
  { id: "p3", from: "docker-traefik", to: "portainer", kind: "proxy" },
  { id: "p4", from: "docker-traefik", to: "redisinsight", kind: "proxy" },

  // ── CI/CD ──
  { id: "ci-source", from: "github", to: "jenkins", kind: "pipeline", label: "1. GitHub → Jenkins · запуск сборки" },
  { id: "ci-publish", from: "jenkins", to: "harbor", kind: "pipeline", label: "2. Jenkins → Harbor · публикация образа" },
  { id: "ci-deploy", from: "harbor", to: "docker", kind: "pipeline", label: "3. Harbor → Docker · развёртывание образа" },

  // ── Monitoring — everything reports to the Zabbix engine ──
  { id: "mon-docker", from: "docker", to: "zabbix", kind: "monitoring", label: "Docker by Zabbix agent 2 · Linux by Zabbix agent active" },
  { id: "mon-harbor", from: "harbor", to: "zabbix", kind: "monitoring", label: "Docker by Zabbix agent 2 · Linux by Zabbix agent active" },
  { id: "mon-jenkins", from: "jenkins", to: "zabbix", kind: "monitoring", label: "Linux by Zabbix agent active" },
  { id: "mon-postgres", from: "postgres", to: "zabbix", kind: "monitoring", label: "Linux by Zabbix agent active · PostgreSQL by Zabbix agent 2 active" },
  { id: "mon-proxmox", from: "proxmox", to: "zabbix", kind: "monitoring", label: "Proxmox VE by HTTP" },
  { id: "mon-proxy", from: "proxy", to: "zabbix", kind: "monitoring", label: "Linux by Zabbix agent active" },
  { id: "mon-rabbitmq", from: "rabbitmq", to: "zabbix", kind: "monitoring", label: "Linux by Zabbix agent active · RabbitMQ cluster by Zabbix agent · RabbitMQ node by Zabbix agent" },
  { id: "mon-redis", from: "redis", to: "zabbix", kind: "monitoring", label: "Linux by Zabbix agent active · Redis by Zabbix agent 2" },
];
