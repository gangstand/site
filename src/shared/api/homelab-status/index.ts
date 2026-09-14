export const HOMELAB_SITE_IDS = [
  "root",
  "portainer",
  "traefik",
  "harbor",
  "jenkins",
  "grafana",
  "zabbix",
  "redisinsight",
] as const;

export type HomelabSiteId = (typeof HOMELAB_SITE_IDS)[number];
export type SiteStatusState = "up" | "auth" | "down" | "unknown";

export interface SiteStatus {
  state: SiteStatusState;
  checkedAt: string;
}

export type HomelabStatus = Partial<Record<HomelabSiteId, SiteStatus>>;
export type HomelabStatusSnapshot = Record<HomelabSiteId, SiteStatus>;

export function parseHomelabStatus(value: unknown): HomelabStatusSnapshot {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid homelab status");

  const result = {} as HomelabStatusSnapshot;
  for (const id of HOMELAB_SITE_IDS) {
    const status = (value as Record<string, unknown>)[id];
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
