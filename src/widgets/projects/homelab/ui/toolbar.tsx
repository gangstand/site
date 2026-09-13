import { memo } from "react";
import { VIEWS, type View } from "../model/view";
import styles from "./homelab.module.css";

interface ToolbarProps {
  view: View;
  onChangeView: (view: View) => void;
}

export const Toolbar = memo(function Toolbar({ view, onChangeView }: ToolbarProps) {
  return (
    <nav className={styles.navigation} aria-label="Контуры инфраструктуры">
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
