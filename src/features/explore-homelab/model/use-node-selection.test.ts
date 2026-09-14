import { describe, expect, it } from "vitest";
import { nextSelection } from "./use-node-selection";

describe("Homelab selection", () => {
  it("keeps node and connection selection mutually exclusive", () => {
    const node = nextSelection(null, { type: "select-node", nodeId: "docker" });
    expect(node).toEqual({ type: "node", nodeId: "docker" });

    const connection = nextSelection(node, { type: "select-connection", connection: { id: "ci-deploy", to: "docker" } });
    expect(connection).toEqual({ type: "connection", connectionId: "ci-deploy", nodeId: "docker" });
    expect(nextSelection(connection, { type: "select-connection", connection: { id: "ci-deploy", to: "docker" } })).toBeNull();
    expect(nextSelection(node, { type: "toggle-node", nodeId: "docker" })).toBeNull();
    expect(nextSelection(connection, { type: "clear" })).toBeNull();
  });

  it("toggles the proxy zone like any other node", () => {
    const proxy = nextSelection(null, { type: "toggle-node", nodeId: "proxy" });
    expect(proxy).toEqual({ type: "node", nodeId: "proxy" });
    expect(nextSelection(proxy, { type: "toggle-node", nodeId: "proxy" })).toBeNull();

    const connection = nextSelection(null, { type: "select-connection", connection: { id: "vpn-docker", to: "docker" } });
    expect(nextSelection(connection, { type: "toggle-node", nodeId: "proxy" })).toEqual({ type: "node", nodeId: "proxy" });
  });
});
