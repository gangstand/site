export const HOMELAB_SITES = {
  root: "https://gangstand.tech",
  portainer: "https://portainer.gangstand.tech",
  traefik: "https://traefik.gangstand.tech",
  harbor: "https://harbor.gangstand.tech",
  jenkins: "https://jenkins.gangstand.tech",
  grafana: "https://grafana.gangstand.tech",
  zabbix: "https://zabbix.gangstand.tech",
  redisinsight: "https://redis.gangstand.tech",
} as const;

export type HomelabSiteId = keyof typeof HOMELAB_SITES;
export const HOMELAB_STATUS_INTERVAL_MS = 30_000;

export const HOMELAB_SITE_BY_NODE: Partial<Record<string, HomelabSiteId>> = {
  "traefik-edge": "traefik",
  "docker-traefik": "root",
  portainer: "portainer", grafana: "grafana", redisinsight: "redisinsight",
  "harbor-vm": "harbor", "jenkins-vm": "jenkins",
  "zabbix-vm": "zabbix",
  harbor: "harbor", jenkins: "jenkins", zabbix: "zabbix",
};

export interface SiteStatus {
  state: "up" | "auth" | "down" | "unknown";
  checkedAt: string;
}

export type HomelabStatus = Partial<Record<HomelabSiteId, SiteStatus>>;

/** Only known sites and valid states/timestamps can reach status indicators. */
export function parseHomelabStatus(value: unknown): HomelabStatus {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid homelab status");
  const result: HomelabStatus = {};
  for (const id of Object.keys(HOMELAB_SITES) as HomelabSiteId[]) {
    const status: unknown = (value as Record<string, unknown>)[id];
    if (!status || typeof status !== "object") throw new Error(`Missing status: ${id}`);
    const { state, checkedAt } = status as Record<string, unknown>;
    if ((state !== "up" && state !== "auth" && state !== "down" && state !== "unknown") ||
      typeof checkedAt !== "string" || !Number.isFinite(Date.parse(checkedAt))) {
      throw new Error(`Invalid status: ${id}`);
    }
    result[id] = { state, checkedAt };
  }
  return result;
}

export const SITE_STATUS_LABELS = {
  up: "Сайт доступен",
  auth: "Сайт отвечает · доступ ограничен авторизацией или правами",
  down: "Сайт недоступен или отвечает с ошибкой",
  unknown: "Не удалось выполнить проверку",
};
