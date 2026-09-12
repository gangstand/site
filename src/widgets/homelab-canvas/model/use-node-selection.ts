"use client";

import { useCallback, useState } from "react";

/** Selected node / selected connection are mutually exclusive: picking one clears the other. */
export function useNodeSelection() {
  const [selected, setSelectedNode] = useState<string | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);

  const setSelected = useCallback((id: string | null) => {
    setSelectedConnection(null);
    setSelectedNode(id);
  }, []);

  const toggleSelected = useCallback((id: string) => {
    setSelectedConnection(null);
    setSelectedNode((prev) => (prev === id ? null : id));
  }, []);

  const selectConnection = useCallback(
    (connection: { id: string; from: string; to: string }) => {
      if (selectedConnection === connection.id) setSelected(null);
      else {
        setSelectedConnection(connection.id);
        setSelectedNode(connection.to);
      }
    },
    [selectedConnection, setSelected],
  );

  return { selected, selectedConnection, setSelected, toggleSelected, selectConnection };
}
