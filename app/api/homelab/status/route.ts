import { HOMELAB_SITES, HOMELAB_STATUS_INTERVAL_MS, type HomelabStatus, type SiteStatus } from "@/shared/config/homelab-status";

export const runtime = "nodejs";

let cache: { statuses: HomelabStatus; expiresAt: number } | undefined;
let pending: Promise<HomelabStatus> | undefined;

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
    // Releasing the body must not turn an already received HTTP status into "down".
    await response.body?.cancel().catch(() => {});
  } catch {
    state = "down";
  }
  return { state, checkedAt: new Date().toISOString() };
}

export async function GET() {
  if (cache && cache.expiresAt > Date.now()) {
    return Response.json(cache.statuses, { headers: { "Cache-Control": "no-store" } });
  }
  pending ??= Promise.all(Object.entries(HOMELAB_SITES).map(async ([id, url]) =>
    [id, await checkSite(url)] as const,
  )).then(entries => {
    const statuses = Object.fromEntries(entries);
    cache = { statuses, expiresAt: Date.now() + HOMELAB_STATUS_INTERVAL_MS };
    return statuses;
  }).finally(() => { pending = undefined; });
  const statuses = await pending;
  return Response.json(statuses, { headers: { "Cache-Control": "no-store" } });
}
