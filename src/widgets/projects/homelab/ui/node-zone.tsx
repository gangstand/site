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
  networkClientsCount: number;
  onSelectNode: (id: string) => void;
}

export const NodeZone = memo(function NodeZone({
  zone: z,
  isDestination,
  selectedVmId,
  statuses,
  networkClientsCount,
  onSelectNode,
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
            onSelectNode(vmId);
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
      {z.id === "edge" && <span className={styles.hostCaption}>Центральный хост · {networkClientsCount} клиентов</span>}
    </section>
  );
});
