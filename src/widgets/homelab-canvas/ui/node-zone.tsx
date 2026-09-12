import { memo } from "react";
import { TechLogo } from "@/shared/ui/tech-logo";
import { HOMELAB_SITE_BY_NODE, type HomelabStatus } from "@/shared/config/homelab-status";
import type { HomelabZone } from "../model/layout";
import { SiteIndicator } from "./site-indicator";
import styles from "./homelab.module.css";

interface NodeZoneProps {
  zone: HomelabZone;
  isDestination: boolean;
  selectedVmId: string | null;
  statuses: HomelabStatus;
  networkExpanded: boolean;
  networkClientsCount: number;
  onSelectNode: (id: string, keyboard: boolean) => void;
  onEnterNetwork: (id: string) => void;
  onLeaveNetwork: () => void;
  onFocusNetwork: (id: string) => void;
  onBlurNetwork: () => void;
  onToggleNetwork: (id: string) => void;
}

export const NodeZone = memo(function NodeZone({
  zone: z,
  isDestination,
  selectedVmId,
  statuses,
  networkExpanded,
  networkClientsCount,
  onSelectNode,
  onEnterNetwork,
  onLeaveNetwork,
  onFocusNetwork,
  onBlurNetwork,
  onToggleNetwork,
}: NodeZoneProps) {
  const isVm = z.label === "VIRTUAL MACHINE";
  const vmId = z.id.replace("-vm", "");
  return (
    <section
      className={`${styles.zone} ${z.id === "edge" ? styles.networkHost : styles.networkClient}`}
      data-destination={isDestination}
      style={{ left: z.x, top: z.y, width: z.w, height: z.h }}
      aria-label={z.name}
    >
      {isVm && (
        <button
          type="button"
          className={styles.vmSelect}
          aria-label={`Выделить VM ${z.name}`}
          aria-pressed={selectedVmId === vmId}
          onClick={(e) => {
            e.stopPropagation();
            onSelectNode(vmId, e.detail === 0);
          }}
        />
      )}
      <SiteIndicator site={HOMELAB_SITE_BY_NODE[z.id]} statuses={statuses} />
      {["redis-vm", "postgres-vm", "rabbitmq-vm"].includes(z.id) && (
        <span className={styles.siteIndicator} data-state="unknown" role="img" aria-label={`${z.name} · доступность приватного сервиса не проверяется`} title="Доступность приватного сервиса не проверяется" />
      )}
      <div className={styles.zoneLabel}>{z.label}</div>
      <div className={styles.zoneIdentity}>
        {z.logo && <TechLogo tech={z.logo} size={24} />}
        <h2>{z.name}</h2>
      </div>
      <p>{z.detail}</p>
      {(z.id === "edge" || isVm) && (
        <button
          type="button"
          className={`${styles.wgBadge} ${z.id === "edge" ? styles.wgHost : ""}`}
          data-canvas-control
          aria-label={`WireGuard · ${z.name} · ${z.id === "edge" ? "главный хост" : "клиент"}. Показать приватную сеть`}
          aria-expanded={networkExpanded}
          aria-controls={networkExpanded ? "wireguard-network" : undefined}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerEnter={(e) => {
            if (e.pointerType !== "touch") onEnterNetwork(z.id);
          }}
          onPointerLeave={onLeaveNetwork}
          onFocus={() => onFocusNetwork(z.id)}
          onBlur={onBlurNetwork}
          onClick={(e) => {
            e.stopPropagation();
            onToggleNetwork(z.id);
          }}
        >
          <TechLogo tech="wireguard" size={20} />
        </button>
      )}
      {z.id === "edge" && <span className={styles.hostCaption}>Центральный хост · {networkClientsCount} клиентов</span>}
    </section>
  );
});
