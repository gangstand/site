"use client";

import { useCallback, useMemo, useState } from "react";
import { connections, byId } from "../model/connections";
import { nodes as HOMELAB_NODES, zones as HOMELAB_ZONES } from "../model/layout";
import { useSiteStatus } from "../model/use-site-status";
import { useNodeSelection } from "../model/use-node-selection";
import { useNetworkPanel } from "../model/use-network-panel";
import type { View } from "../model/view";
import { Toolbar } from "./toolbar";
import { HypervisorSection } from "./hypervisor-section";
import { NodeZone } from "./node-zone";
import { ConnectionsLayer } from "./connections-layer";
import { NodeCard } from "./node-card";
import { NetworkPanel } from "./network-panel";
import { InspectorPanel } from "./inspector-panel";
import { CanvasViewport } from "./canvas-viewport";
import styles from "./homelab.module.css";

const NETWORK_CLIENTS = HOMELAB_ZONES.filter((z) => z.label === "VIRTUAL MACHINE");
const CARD_NODES = HOMELAB_NODES.filter((node) => !node.isVm);
const ALL_NODE_IDS = HOMELAB_NODES.map((n) => n.id);
const NO_INSPECTOR = new Set(["traefik-edge", "docker-traefik", "portainer", "grafana", "redisinsight", "redis", "github", "internet"]);

export function HomelabCanvas() {
  const statuses = useSiteStatus();
  const { selected, selectedConnection, setSelected, toggleSelected, selectConnection } = useNodeSelection();
  const { activeNetworkId, setFocusedNetwork, enterNetwork, leaveNetwork, closeNetwork, toggleNetwork } = useNetworkPanel();
  const [view, setView] = useState<View>("traffic");

  const handleChangeView = useCallback(
    (next: View) => {
      setView(next);
      setSelected(null);
    },
    [setSelected],
  );

  const handleBlurNetwork = useCallback(() => setFocusedNetwork(null), [setFocusedNetwork]);
  const handleCloseInspector = useCallback(() => setSelected(null), [setSelected]);

  const networkZone = HOMELAB_ZONES.find((z) => z.id === activeNetworkId);

  const visible = useMemo(
    () => connections.filter((c) => view === "all" || (view === "traffic" ? c.kind === "flow" || c.kind === "proxy" || c.kind === "wireguard" : c.kind === view)),
    [view],
  );
  const selectedRoute = useMemo(() => visible.find((c) => c.id === selectedConnection), [visible, selectedConnection]);
  const related = useMemo(
    () =>
      new Set(
        selectedRoute
          ? [selectedRoute.from, selectedRoute.to]
          : selected
            ? [selected, ...visible.filter((c) => c.from === selected || c.to === selected).flatMap((c) => [c.from, c.to])]
            : ALL_NODE_IDS,
      ),
    [selectedRoute, selected, visible],
  );
  const active = useMemo(() => (selected ? (byId.get(selected) ?? null) : null), [selected]);
  const relations = useMemo(() => (active ? visible.filter((c) => c.from === active.id || c.to === active.id) : []), [active, visible]);

  return (
    <main
      className={styles.shell}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          closeNetwork();
          setSelected(null);
        }
      }}
    >
      <Toolbar statuses={statuses} view={view} onChangeView={handleChangeView} />
      <CanvasViewport onClearSelection={handleCloseInspector}>
        <HypervisorSection />
        {HOMELAB_ZONES.map((z) => (
          <NodeZone
            key={z.id}
            zone={z}
            isDestination={selectedRoute?.to === (z.id === "edge" ? "proxy" : z.id.replace("-vm", ""))}
            selectedVmId={selected}
            statuses={statuses}
            networkExpanded={networkZone?.id === z.id}
            networkClientsCount={NETWORK_CLIENTS.length}
            onSelectNode={toggleSelected}
            onEnterNetwork={enterNetwork}
            onLeaveNetwork={leaveNetwork}
            onFocusNetwork={setFocusedNetwork}
            onBlurNetwork={handleBlurNetwork}
            onToggleNetwork={toggleNetwork}
          />
        ))}
        <ConnectionsLayer visible={visible} selected={selected} selectedConnection={selectedConnection} onSelectConnection={selectConnection} />
        {CARD_NODES.map((node) => (
          <NodeCard key={node.id} node={node} statuses={statuses} selected={selected === node.id} dimmed={!related.has(node.id)} onSelect={toggleSelected} />
        ))}
      </CanvasViewport>
      {networkZone && <NetworkPanel zone={networkZone} clients={NETWORK_CLIENTS} onClose={closeNetwork} onEnter={enterNetwork} onLeave={leaveNetwork} />}
      {active && !selectedConnection && !active.isVm && !NO_INSPECTOR.has(active.id) && (
        <InspectorPanel node={active} view={view} relations={relations} statuses={statuses} onClose={handleCloseInspector} onSelectRelation={setSelected} />
      )}
    </main>
  );
}
