import { memo } from "react";
import { TechLogo } from "@/shared/ui/tech-logo";
import { HOMELAB_SITE_BY_NODE, type HomelabStatus } from "@/shared/config/homelab-status";
import type { LayoutNode } from "../model/layout";
import { SiteIndicator } from "./site-indicator";
import styles from "./homelab.module.css";

interface NodeCardProps {
  node: LayoutNode;
  statuses: HomelabStatus;
  selected: boolean;
  dimmed: boolean;
  onSelect: (id: string, keyboard: boolean) => void;
}

export const NodeCard = memo(function NodeCard({ node, statuses, selected, dimmed, onSelect }: NodeCardProps) {
  const logo = node.logo ?? node.services.find((s) => s.logo)?.logo;
  return (
    <button
      className={`${styles.card} ${selected ? styles.selected : ""} ${node.isProxy ? styles.proxyCard : ""} ${node.isVm ? styles.vmCard : ""}`}
      style={{ left: node.x, top: node.y, width: node.w, height: node.h, opacity: dimmed ? 0.25 : 1 }}
      aria-pressed={selected}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id, e.detail === 0);
      }}
    >
      <SiteIndicator site={HOMELAB_SITE_BY_NODE[node.id]} statuses={statuses} />
      <span className={styles.icon}>{logo ? <TechLogo tech={logo} size={23} /> : <span>{node.category === "external" ? "↗" : "⌘"}</span>}</span>
      <span className={styles.cardText}>
        <strong>{node.title}</strong>
        <span>{node.role}</span>
      </span>
      {node.isVm && <span className={styles.vmTag}>▣ VIRTUAL MACHINE</span>}
      {node.isProxy && <span className={styles.cardTag}>REVERSE PROXY</span>}
    </button>
  );
});
