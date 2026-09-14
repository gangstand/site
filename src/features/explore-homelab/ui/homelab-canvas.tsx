"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "@/shared/lib/language";
import { canvasCopy } from "@/shared/ui/infinite-canvas";
import { scene } from "../model/connections";
import { getLayoutNode, getZoneLayoutNode, layoutNodes } from "../model/layout";
import { cardNodes, networkClientsCount, zoneNodes } from "../model/nodes";
import { useSiteStatus } from "../model/use-site-status";
import { useNodeSelection } from "../model/use-node-selection";
import type { View } from "../model/view";
import { CanvasViewport, type CanvasInteractionState } from "@/shared/ui/infinite-canvas";
import { Toolbar } from "./toolbar";
import { HypervisorSection } from "./hypervisor-section";
import { NodeZone } from "./node-zone";
import { ConnectionsLayer } from "./connections-layer";
import { NodeCard } from "./node-card";
import styles from "./homelab.module.css";

export function HomelabCanvas({ embedded = false }: { embedded?: boolean } = {}) {
  const { lang } = useTranslation();
  const Shell = embedded ? "div" : "main";
  const statuses = useSiteStatus();
  const { selection, selectNode, toggleNode, selectConnection, clearSelection } = useNodeSelection();
  const [view, setView] = useState<View>("all");
  const [interaction, setInteraction] = useState<CanvasInteractionState>({ isPanning: false, isInteracting: false, isDetailView: false });

  const handleChangeView = useCallback(
    (next: View) => {
      setView(next);
      clearSelection();
    },
    [clearSelection],
  );

  const handleClearSelection = useCallback(() => clearSelection(), [clearSelection]);

  const visible = useMemo(
    () => scene.connections.filter((c) => view === "all" || (view === "traffic" ? c.kind === "flow" || c.kind === "proxy" || c.kind === "wireguard" : c.kind === view)),
    [view],
  );
  const selectedConnection = selection?.type === "connection" ? selection.connectionId : null;
  const selectedNode = selection?.nodeId ?? null;
  const selectedRoute = useMemo(() => visible.find((c) => c.id === selectedConnection), [visible, selectedConnection]);
  const related = useMemo(
    () =>
      new Set(
        selectedRoute
          ? [selectedRoute.from, selectedRoute.to]
            : selectedNode
              ? [selectedNode, ...visible.filter((c) => c.from === selectedNode || c.to === selectedNode).flatMap((c) => [c.from, c.to])]
              : layoutNodes.map((node) => node.id),
      ),
    [selectedRoute, selectedNode, visible],
  );

  return (
    <Shell
      className={styles.shell}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          if (selection) e.preventDefault();
          clearSelection();
        }
      }}
    >
      <Toolbar view={view} onChangeView={handleChangeView} />
      <CanvasViewport
        bounds={scene.bounds}
        labels={canvasCopy[lang]}
        className={`${interaction.isInteracting ? styles.canvasInteracting : ""} ${interaction.isDetailView ? styles.canvasDetailView : ""}`}
        onInteractionChange={setInteraction}
        ariaLabel={lang === "ru" ? "Карта инфраструктуры. Escape — снять выделение" : "Infrastructure map. Escape to clear selection"}
        onClearSelection={handleClearSelection}
        fitOnMount={embedded}
      >
        <HypervisorSection />
        {zoneNodes.map((zone) => (
          <NodeZone
            key={zone.id}
            zone={getZoneLayoutNode(zone.id)}
            isDestination={selectedRoute?.to === zone.id}
            selectedZoneId={selectedNode}
            statuses={statuses}
            networkClientsCount={networkClientsCount}
            onSelectNode={toggleNode}
          />
        ))}
        <ConnectionsLayer visible={visible} nodeById={scene.nodeById} svg={scene.svg} selected={selectedNode} selectedConnection={selectedConnection} onSelectConnection={selectConnection} />
        {cardNodes.map((node) => (
          <NodeCard key={node.id} node={{ ...node, ...getLayoutNode(node.id) }} statuses={statuses} selected={selectedNode === node.id} dimmed={!related.has(node.id)} onSelect={toggleNode} />
        ))}
      </CanvasViewport>
    </Shell>
  );
}
