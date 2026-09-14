"use client";

import { useCallback, useState } from "react";
import type { ConnectionId, NodeId } from "./nodes";

export type HomelabSelection = { type: "node"; nodeId: NodeId } | { type: "connection"; connectionId: ConnectionId; nodeId: NodeId } | null;

export function nextSelection(
  current: HomelabSelection,
  action: { type: "select-node"; nodeId: NodeId | null } | { type: "toggle-node"; nodeId: NodeId } | { type: "select-connection"; connection: { id: ConnectionId; to: NodeId } } | { type: "clear" },
): HomelabSelection {
  switch (action.type) {
    case "select-node": return action.nodeId ? { type: "node", nodeId: action.nodeId } : null;
    case "toggle-node": return current?.type === "node" && current.nodeId === action.nodeId ? null : { type: "node", nodeId: action.nodeId };
    case "select-connection": return current?.type === "connection" && current.connectionId === action.connection.id ? null : { type: "connection", connectionId: action.connection.id, nodeId: action.connection.to };
    case "clear": return null;
  }
}

export function useNodeSelection() {
  const [selection, setSelection] = useState<HomelabSelection>(null);
  const selectNode = useCallback((nodeId: NodeId | null) => setSelection((current) => nextSelection(current, { type: "select-node", nodeId })), []);
  const toggleNode = useCallback((nodeId: NodeId) => setSelection((current) => nextSelection(current, { type: "toggle-node", nodeId })), []);
  const selectConnection = useCallback((connection: { id: ConnectionId; to: NodeId }) => setSelection((current) => nextSelection(current, { type: "select-connection", connection })), []);

  return { selection, selectNode, toggleNode, selectConnection, clearSelection: () => setSelection((current) => nextSelection(current, { type: "clear" })) };
}
