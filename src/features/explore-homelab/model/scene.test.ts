import { describe, expect, it } from "vitest";
import { scene } from "./connections";
import { geometry } from "./layout";
import { HOMELAB_CONNECTIONS, HOMELAB_ENTITIES, nodeById, statusByNode, vmCount } from "./nodes";
import type { NodeId } from "./nodes";

const validNodeId: NodeId = "docker";
// @ts-expect-error Node IDs must come from the canonical topology.
const invalidNodeId: NodeId = "docker-vm";
void validNodeId;
void invalidNodeId;

describe("Homelab topology", () => {
  it("has unique identities, resolved relationships, and complete geometry", () => {
    expect(new Set(HOMELAB_ENTITIES.map((entity) => entity.id)).size).toBe(HOMELAB_ENTITIES.length);
    for (const entity of HOMELAB_ENTITIES) {
      expect(geometry[entity.id]).toBeDefined();
      const node = nodeById.get(entity.id);
      if (node?.parent) expect(nodeById.has(node.parent)).toBe(true);
    }
    for (const connection of HOMELAB_CONNECTIONS) {
      expect(nodeById.has(connection.from)).toBe(true);
      expect(nodeById.has(connection.to)).toBe(true);
    }
    expect(statusByNode.get("harbor")).toBe("harbor");
    expect(vmCount).toBe(7);
  });
});

describe("Homelab scene", () => {
  it("preserves every routed connection path", () => {
    expect(scene.connections.map(({ id, d }) => ({ id, d }))).toMatchSnapshot();
  });

  it("contains every projected node and routed point", () => {
    const { bounds } = scene;
    const contains = (x: number, y: number) => x >= bounds.x && y >= bounds.y && x <= bounds.x + bounds.w && y <= bounds.y + bounds.h;
    for (const node of Object.values(geometry)) {
      expect(contains(node.x, node.y)).toBe(true);
      expect(contains(node.x + node.w, node.y + node.h)).toBe(true);
    }
    for (const connection of scene.connections) for (const point of connection.points) expect(contains(point.x, point.y)).toBe(true);
  });
});
