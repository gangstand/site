import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("GET /api/homelab/status", () => {
  it("returns the established complete status payload with no-store caching", async () => {
    const body = { cancel: vi.fn().mockResolvedValue(undefined) };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, body }));
    const { GET } = await import("./route");

    const response = await GET();
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toMatchObject({
      root: { state: "up" },
      portainer: { state: "up" },
      traefik: { state: "up" },
      harbor: { state: "up" },
      jenkins: { state: "up" },
      grafana: { state: "up" },
      zabbix: { state: "up" },
      redisinsight: { state: "up" },
    });
    expect(fetch).toHaveBeenCalledTimes(8);
  });
});
