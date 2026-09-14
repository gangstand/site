import type { HomelabSiteId, HomelabStatusSnapshot, SiteStatus } from "@/shared/api/homelab-status";

export const HOMELAB_PROBE_SITES: Record<HomelabSiteId, string> = {
  root: "https://gangstand.tech",
  portainer: "https://portainer.gangstand.tech",
  traefik: "https://traefik.gangstand.tech",
  harbor: "https://harbor.gangstand.tech",
  jenkins: "https://jenkins.gangstand.tech",
  grafana: "https://grafana.gangstand.tech",
  zabbix: "https://zabbix.gangstand.tech",
  redisinsight: "https://redis.gangstand.tech",
};

export const PROBE_CACHE_TTL_MS = 30_000;

async function checkSite(url: string): Promise<SiteStatus> {
  let state: SiteStatus["state"] = "down";
  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(5_000),
    });
    state = response.ok ? "up" : [401, 403].includes(response.status) ? "auth" : "down";
    await response.body?.cancel().catch(() => {});
  } catch {
    state = "down";
  }
  return { state, checkedAt: new Date().toISOString() };
}

let cache: { statuses: HomelabStatusSnapshot; expiresAt: number } | undefined;
let pending: Promise<HomelabStatusSnapshot> | undefined;

export async function getHomelabStatus(): Promise<HomelabStatusSnapshot> {
  if (cache && cache.expiresAt > Date.now()) return cache.statuses;
  pending ??= Promise.all(Object.entries(HOMELAB_PROBE_SITES).map(async ([id, url]) =>
    [id, await checkSite(url)] as const,
  )).then((entries) => {
    const statuses = Object.fromEntries(entries) as HomelabStatusSnapshot;
    cache = { statuses, expiresAt: Date.now() + PROBE_CACHE_TTL_MS };
    return statuses;
  }).finally(() => { pending = undefined; });
  return pending;
}
