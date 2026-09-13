import type { TechKey } from "@/shared/ui/tech-logo";

type NodeCategory =
  | "external"
  | "edge"
  | "compute"
  | "registry"
  | "ci"
  | "monitoring"
  | "database"
  | "broker"
  | "cache";

export interface HomelabNode {
  id: string;
  title: string;
  category: NodeCategory;
  logo?: TechKey;
  isProxy?: boolean;
  isVm?: boolean;
  role?: string;
}

export type ConnectionKind = "flow" | "pipeline" | "monitoring" | "proxy" | "wireguard" | "vpn";

interface HomelabConnection {
  id: string;
  from: string;
  to: string;
  label?: string;
  kind: ConnectionKind;
}

export const HOMELAB_NODES: HomelabNode[] = [
  { id: "docker", title: "Docker", category: "compute", logo: "docker", isVm: true, role: "Развёртывание контейнеров из Harbor" },
  {
    id: "internet",
    title: "Интернет",
    category: "external",
    role: "Клиентский трафик",
  },
  {
    id: "github",
    title: "GitHub",
    category: "external",
    role: "Git repository · webhook",
    logo: "github",
  },

  {
    id: "traefik-edge",
    title: "Traefik",
    category: "edge",
    role: "внешний reverse-proxy",
    logo: "traefik",
    isProxy: true,
  },

  {
    id: "docker-traefik",
    title: "Traefik",
    category: "compute",
    role: "внутренний reverse-proxy",
    logo: "traefik",
    isProxy: true,
  },
  {
    id: "grafana",
    title: "Grafana",
    category: "compute",
    role: "дашборды и метрики",
    logo: "grafana",
  },
  {
    id: "portainer",
    title: "Portainer",
    category: "compute",
    role: "UI управления Docker",
    logo: "portainer",
  },
  {
    id: "redisinsight",
    title: "RedisInsight",
    category: "compute",
    role: "GUI для Redis",
    logo: "redisinsight",
  },

  { id: "harbor", title: "Harbor", category: "registry", role: "Приватный registry образов", logo: "harbor", isVm: true },
  { id: "jenkins", title: "Jenkins", category: "ci", role: "Сборка и доставка приложений", logo: "jenkins", isVm: true },
  { id: "zabbix", title: "Zabbix", category: "monitoring", role: "Мониторинг инфраструктуры", logo: "zabbix", isVm: true },

  {
    id: "postgres",
    isVm: true,
    title: "Postgres",
    category: "database",
    role: "Основная БД приложения",
  },
  {
    id: "rabbitmq",
    isVm: true,
    title: "RabbitMQ",
    category: "broker",
    role: "Брокер сообщений",
  },
  {
    id: "redis",
    isVm: true,
    title: "Redis",
    category: "cache",
    role: "Кэш / in-memory store",
  },
];

export const HOMELAB_CONNECTIONS: HomelabConnection[] = [
  { id: "vpn-docker", from: "proxy", to: "docker", kind: "vpn", label: "WireGuard · Proxy HOST ↔ Docker CLIENT" },
  { id: "vpn-jenkins", from: "proxy", to: "jenkins", kind: "vpn", label: "WireGuard · Proxy HOST ↔ Jenkins CLIENT" },
  { id: "vpn-harbor", from: "proxy", to: "harbor", kind: "vpn", label: "WireGuard · Proxy HOST ↔ Harbor CLIENT" },
  { id: "vpn-postgres", from: "proxy", to: "postgres", kind: "vpn", label: "WireGuard · Proxy HOST ↔ PostgreSQL CLIENT" },
  { id: "vpn-rabbitmq", from: "proxy", to: "rabbitmq", kind: "vpn", label: "WireGuard · Proxy HOST ↔ RabbitMQ CLIENT" },
  { id: "vpn-redis", from: "proxy", to: "redis", kind: "vpn", label: "WireGuard · Proxy HOST ↔ Redis CLIENT" },
  { id: "vpn-zabbix", from: "proxy", to: "zabbix", kind: "vpn", label: "WireGuard · Proxy HOST ↔ Zabbix CLIENT" },
  { id: "c1", from: "internet", to: "proxy", label: "HTTPS", kind: "flow" },
  { id: "c2", from: "traefik-edge", to: "docker-traefik", label: "WireGuard · Traefik edge → Traefik internal", kind: "wireguard" },
  { id: "wg-harbor", from: "traefik-edge", to: "harbor", label: "HTTP через WireGuard · Harbor", kind: "wireguard" },
  { id: "wg-jenkins", from: "traefik-edge", to: "jenkins", label: "HTTP через WireGuard · Jenkins", kind: "wireguard" },
  { id: "wg-zabbix", from: "traefik-edge", to: "zabbix", label: "HTTP через WireGuard · Zabbix UI", kind: "wireguard" },
  { id: "wg-rabbitmq", from: "traefik-edge", to: "rabbitmq", label: "HTTP через WireGuard · RabbitMQ Management UI", kind: "wireguard" },
  { id: "p2", from: "docker-traefik", to: "grafana", kind: "proxy" },
  { id: "p3", from: "docker-traefik", to: "portainer", kind: "proxy" },
  { id: "p4", from: "docker-traefik", to: "redisinsight", kind: "proxy" },

  { id: "ci-source", from: "github", to: "jenkins", kind: "pipeline", label: "1. GitHub → Jenkins · запуск сборки" },
  { id: "ci-publish", from: "jenkins", to: "harbor", kind: "pipeline", label: "2. Jenkins → Harbor · публикация образа" },
  { id: "ci-deploy", from: "harbor", to: "docker", kind: "pipeline", label: "3. Harbor → Docker · развёртывание образа" },

  { id: "mon-docker", from: "docker", to: "zabbix", kind: "monitoring", label: "Docker by Zabbix agent 2 · Linux by Zabbix agent active" },
  { id: "mon-harbor", from: "harbor", to: "zabbix", kind: "monitoring", label: "Docker by Zabbix agent 2 · Linux by Zabbix agent active" },
  { id: "mon-jenkins", from: "jenkins", to: "zabbix", kind: "monitoring", label: "Linux by Zabbix agent active" },
  { id: "mon-postgres", from: "postgres", to: "zabbix", kind: "monitoring", label: "Linux by Zabbix agent active · PostgreSQL by Zabbix agent 2 active" },
  { id: "mon-proxmox", from: "proxmox", to: "zabbix", kind: "monitoring", label: "Proxmox VE by HTTP" },
  { id: "mon-proxy", from: "proxy", to: "zabbix", kind: "monitoring", label: "Linux by Zabbix agent active" },
  { id: "mon-rabbitmq", from: "rabbitmq", to: "zabbix", kind: "monitoring", label: "Linux by Zabbix agent active · RabbitMQ cluster by Zabbix agent · RabbitMQ node by Zabbix agent" },
  { id: "mon-redis", from: "redis", to: "zabbix", kind: "monitoring", label: "Linux by Zabbix agent active · Redis by Zabbix agent 2" },
];
