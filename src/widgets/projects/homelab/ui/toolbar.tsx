import { memo } from "react";
import type { HomelabStatus } from "@/shared/config/homelab-status";
import { VIEWS, type View } from "../model/view";
import { SiteIndicator } from "./site-indicator";
import styles from "./homelab.module.css";

interface ToolbarProps {
  statuses: HomelabStatus;
  view: View;
  onChangeView: (view: View) => void;
}

export const Toolbar = memo(function Toolbar({ statuses, view, onChangeView }: ToolbarProps) {
  return (
    <nav className={styles.navigation} aria-label="Контуры инфраструктуры">
      <a href="/" className={styles.siteAvailability}>
        <SiteIndicator site="root" statuses={statuses} />
        <span>gangstand.tech</span>
      </a>
      <div className={styles.tabs}>
        {VIEWS.map(([id, label]) => (
          <button key={id} aria-pressed={view === id} onClick={() => onChangeView(id)}>
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
});
