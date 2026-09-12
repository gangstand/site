import { memo } from "react";
import { useTheme } from "@/shared/lib/theme/theme-context";
import { byId, type HomelabConnectionRoute } from "../model/connections";
import styles from "./homelab.module.css";

// Tuned per theme: the dark-mode palette is too pale to read against a white canvas.
const DARK_COLORS = { flow: "#8aaed5", proxy: "#8aaed5", pipeline: "#bba0e8", monitoring: "#d2b379", wireguard: "#78cbbb", vpn: "#62d9b4" } as const;
const LIGHT_COLORS = { flow: "#3d6fa8", proxy: "#3d6fa8", pipeline: "#7c5fc4", monitoring: "#a9791a", wireguard: "#1f8a72", vpn: "#2fa16b" } as const;

interface ConnectionsLayerProps {
  visible: HomelabConnectionRoute[];
  selected: string | null;
  selectedConnection: string | null;
  onSelectConnection: (connection: HomelabConnectionRoute, keyboard: boolean) => void;
}

export const ConnectionsLayer = memo(function ConnectionsLayer({ visible, selected, selectedConnection, onSelectConnection }: ConnectionsLayerProps) {
  const { theme } = useTheme();
  const COLORS = theme === "light" ? LIGHT_COLORS : DARK_COLORS;
  return (
    <svg className={styles.connections} width="1620" height="1260" role="group" aria-label="Связи инфраструктуры. Нажмите на линию, чтобы выделить её назначение.">
      {visible.map((c) => (
        <g key={c.id} data-dimmed={selectedConnection ? selectedConnection !== c.id : Boolean(selected && c.from !== selected && c.to !== selected)} opacity={selectedConnection ? (selectedConnection === c.id ? 1 : 0.12) : selected && c.from !== selected && c.to !== selected ? 0.1 : 0.8}>
          <title>{c.label ?? c.kind}</title>
          <path
            d={c.d}
            fill="none"
            stroke={COLORS[c.kind]}
            strokeWidth={c.kind === "pipeline" ? "2.5" : "1.8"}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={c.kind === "monitoring" || c.kind === "flow" || c.kind === "proxy" || c.kind === "wireguard" ? "3 6" : undefined}
          />
          <path
            className={styles.connectionTraffic}
            d={c.d}
            fill="none"
            stroke={COLORS[c.kind]}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="10 80"
          />
          {selectedConnection === c.id && <path d={c.d} fill="none" stroke="#e8ddff" strokeWidth="3" strokeOpacity=".5" strokeLinejoin="round" strokeLinecap="round" />}
          <path
            className={styles.connectionHit}
            d={c.d}
            fill="none"
            stroke="transparent"
            strokeWidth="18"
            vectorEffect="non-scaling-stroke"
            role="button"
            tabIndex={0}
            aria-pressed={selectedConnection === c.id}
            aria-label={`${byId.get(c.from)?.title} → ${byId.get(c.to)?.title}. ${c.label ?? "Выделить связь"}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectConnection(c, e.detail === 0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                onSelectConnection(c, true);
              }
            }}
          />
        </g>
      ))}
    </svg>
  );
});
