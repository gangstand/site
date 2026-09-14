import { memo } from "react";
import { TechLogo } from "@/shared/ui/tech-logo";
import type { HomelabStatus } from "@/shared/api/homelab-status";
import type { LayoutNode } from "../model/layout";
import type { NodeId } from "../model/nodes";
import { SiteIndicator } from "./site-indicator";
import styles from "./homelab.module.css";

interface NodeCardProps {
  node: LayoutNode;
  statuses: HomelabStatus;
  selected: boolean;
  dimmed: boolean;
  onSelect: (id: NodeId) => void;
}

export const NodeCard = memo(function NodeCard({ node, statuses, selected, dimmed, onSelect }: NodeCardProps) {
  const logo = node.logo;
  return (
    <button
      className={`${styles.card} ${selected ? styles.selected : ""} ${node.isProxy ? styles.proxyCard : ""}`}
      style={{ left: node.x, top: node.y, width: node.w, height: node.h, opacity: dimmed ? 0.25 : 1 }}
      aria-pressed={selected}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
    >
      <SiteIndicator site={node.status} statuses={statuses} />
      <span className={styles.icon}>{logo ? <TechLogo tech={logo} size={23} /> : <span>{node.category === "external" ? "↗" : "⌘"}</span>}</span>
      <span className={styles.cardText}>
        <strong>{node.title}</strong>
        <span>{node.role}</span>
      </span>
      {node.isProxy && <span className={styles.cardTag}>REVERSE PROXY</span>}
    </button>
  );
});
