import { describe, expect, it } from "vitest";
import { HOMELAB_SITE_IDS, parseHomelabStatus } from ".";

const snapshot = Object.fromEntries(HOMELAB_SITE_IDS.map((id) => [id, { state: "up", checkedAt: "2026-09-14T00:00:00.000Z" }]));

describe("Homelab status contract", () => {
  it("accepts a complete valid snapshot", () => {
    expect(parseHomelabStatus(snapshot)).toEqual(snapshot);
  });

  it("rejects incomplete and malformed snapshots", () => {
    const { root: _, ...missing } = snapshot;
    expect(() => parseHomelabStatus(missing)).toThrow("Missing status: root");
    expect(() => parseHomelabStatus({ ...snapshot, root: { state: "invalid", checkedAt: "now" } })).toThrow("Invalid status: root");
  });
});
