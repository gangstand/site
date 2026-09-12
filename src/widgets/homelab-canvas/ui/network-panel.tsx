import { memo } from "react";
import { TechLogo } from "@/shared/ui/tech-logo";
import { HOMELAB_WIREGUARD, HOMELAB_WIREGUARD_ADDRESSES } from "../model/nodes";
import type { HomelabZone } from "../model/layout";
import styles from "./homelab.module.css";

interface NetworkPanelProps {
  zone: HomelabZone;
  clients: HomelabZone[];
  onClose: () => void;
  onEnter: (id: string) => void;
  onLeave: () => void;
}

export const NetworkPanel = memo(function NetworkPanel({ zone, clients, onClose, onEnter, onLeave }: NetworkPanelProps) {
  return (
    <aside id="wireguard-network" className={styles.networkPanel} aria-label="Приватная сеть WireGuard" onPointerEnter={() => onEnter(zone.id)} onPointerLeave={onLeave}>
      <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть сведения о сети">
        ×
      </button>
      <div className={styles.networkPanelHeader}>
        <TechLogo tech="wireguard" size={28} />
        <div>
          <span>WIREGUARD</span>
          <h2>{HOMELAB_WIREGUARD.name}</h2>
        </div>
      </div>
      <div className={styles.networkRole}>
        <strong>{zone.name}</strong>
        <span>{zone.id === "edge" ? "HOST · главный хост" : "CLIENT · участник сети"}</span>
      </div>
      <div className={styles.networkAddress}>
        <span>Внутренний адрес WireGuard</span>
        <code>{HOMELAB_WIREGUARD_ADDRESSES[zone.id] ?? "Не указан"}</code>
      </div>
      <p>{HOMELAB_WIREGUARD.description}</p>
      <div className={styles.networkHostRow}>
        <span>Главный хост</span>
        <strong>
          {HOMELAB_WIREGUARD.host}
          <small>Внешний VPS · WireGuard HOST</small>
        </strong>
      </div>
      <h3>Клиенты приватной сети · {clients.length}</h3>
      <div className={styles.networkMembers}>
        {clients.map((client) => (
          <span key={client.id} className={client.id === zone.id ? styles.networkMemberActive : undefined}>
            {client.logo && <TechLogo tech={client.logo} size={14} />} {client.name}
            <code>{HOMELAB_WIREGUARD_ADDRESSES[client.id] ?? "IP не указан"}</code>
          </span>
        ))}
      </div>
    </aside>
  );
});
