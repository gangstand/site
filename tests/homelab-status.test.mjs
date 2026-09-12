import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";
import { HOMELAB_SITES, HOMELAB_STATUS_INTERVAL_MS, parseHomelabStatus } from "../src/shared/config/homelab-status.ts";

// Resolve the same alias as tsconfig when exercising the real Next route in Node.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      return nextResolve(new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url).href, context);
    }
    return nextResolve(specifier, context);
  },
});

const checkedAt = "2026-09-12T12:00:00.000Z";
const payload = () => Object.fromEntries(Object.keys(HOMELAB_SITES).map(id => [id, { state: "up", checkedAt }]));

test("status validation accepts supported states and drops unrecognized sites/fields", () => {
  const input = payload();
  input.traefik = { state: "auth", checkedAt, extra: true };
  input.harbor.state = "down";
  input.jenkins.state = "unknown";
  input.unexpected = { state: "up", checkedAt };
  const result = parseHomelabStatus(input);
  assert.equal(Object.keys(result).length, Object.keys(HOMELAB_SITES).length);
  assert.deepEqual(result.traefik, { state: "auth", checkedAt });
  assert.equal(result.harbor.state, "down");
  assert.equal(result.jenkins.state, "unknown");
});

test("malformed or incomplete API responses cannot display a healthy status", () => {
  for (const input of [null, [], {}, "ok", { ...payload(), root: null },
    { ...payload(), root: { state: "healthy", checkedAt } },
    { ...payload(), root: { state: "up", checkedAt: "invalid" } }]) {
    assert.throws(() => parseHomelabStatus(input));
  }
});

test("endpoint deduplicates checks, expires cache, and handles HTTP/network/body errors", async (t) => {
  let now = Date.now();
  t.mock.method(Date, "now", () => now);
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push(url);
    assert.equal(options.cache, "no-store");
    assert.ok(options.signal instanceof AbortSignal);
    if (url === HOMELAB_SITES.harbor) throw new TypeError("Network failure");
    const status = url === HOMELAB_SITES.traefik ? 401 : url === HOMELAB_SITES.jenkins ? 403 : url === HOMELAB_SITES.zabbix ? 503 : 200;
    return {
      ok: status === 200,
      status,
      body: { cancel: async () => { if (url === HOMELAB_SITES.root) throw new Error("Already closed"); } },
    };
  });
  const { GET } = await import("../app/api/homelab/status/route.ts");
  const responses = await Promise.all([GET(), GET(), GET()]);
  const results = await Promise.all(responses.map(response => response.json()));
  assert.equal(calls.length, Object.keys(HOMELAB_SITES).length);
  assert.deepEqual(results[0], results[1]);
  assert.deepEqual(results[0], results[2]);
  assert.equal(results[0].root.state, "up");
  assert.equal(results[0].traefik.state, "auth");
  assert.equal(results[0].jenkins.state, "auth");
  assert.equal(results[0].zabbix.state, "down");
  assert.equal(results[0].harbor.state, "down");
  assert.equal(responses[0].headers.get("Cache-Control"), "no-store");
  await GET();
  assert.equal(calls.length, Object.keys(HOMELAB_SITES).length);
  now += HOMELAB_STATUS_INTERVAL_MS;
  await Promise.all([GET(), GET()]);
  assert.equal(calls.length, Object.keys(HOMELAB_SITES).length * 2);
});
