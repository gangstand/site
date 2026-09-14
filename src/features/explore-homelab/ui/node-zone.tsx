import { memo } from "react";
import { TechLogo } from "@/shared/ui/tech-logo";
import type { HomelabStatus } from "@/shared/api/homelab-status";
import type { LayoutNode } from "../model/layout";
import type { NodeId, ZoneNode } from "../model/nodes";
import { SiteIndicator } from "./site-indicator";
import styles from "./homelab.module.css";

interface NodeZoneProps {
  zone: ZoneNode & LayoutNode;
  isDestination: boolean;
  selectedZoneId: NodeId | null;
  statuses: HomelabStatus;
  networkClientsCount: number;
  onSelectNode: (id: NodeId) => void;
}

export const NodeZone = memo(function NodeZone({
  zone: z,
  isDestination,
  selectedZoneId,
  statuses,
  networkClientsCount,
  onSelectNode,
}: NodeZoneProps) {
  return (
    <section
      className={`${styles.zone} ${z.zone.type === "host" ? styles.networkHost : styles.networkClient}`}
      data-destination={isDestination}
      style={{ left: z.x, top: z.y, width: z.w, height: z.h }}
      aria-label={z.title}
    >
      <button
        type="button"
        className={styles.zoneSelect}
        aria-label={z.zone.type === "host" ? `Выделить хост ${z.title}` : `Выделить VM ${z.title}`}
        aria-pressed={selectedZoneId === z.id}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode(z.id);
        }}
      />
      <SiteIndicator site={z.status} statuses={statuses} />
      {z.zone.privateService && (
        <span className={styles.siteIndicator} data-state="unknown" role="img" aria-label={`${z.title} · доступность приватного сервиса не проверяется`} title="Доступность приватного сервиса не проверяется" />
      )}
      <div className={styles.zoneLabel}>{z.zone.label}</div>
      <div className={styles.zoneIdentity}>
        {z.logo && <TechLogo tech={z.logo} size={24} />}
        <h2>{z.title}</h2>
      </div>
      <p>{z.zone.detail}</p>
      {z.zone.type === "host" && <span className={styles.hostCaption}>Центральный хост · {networkClientsCount} клиентов</span>}
    </section>
  );
});
