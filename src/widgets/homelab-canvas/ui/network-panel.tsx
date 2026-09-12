import { memo, useEffect, useRef, useSyncExternalStore } from "react";
import { TechLogo } from "@/shared/ui/tech-logo";
import { HOMELAB_WIREGUARD, HOMELAB_WIREGUARD_ADDRESSES } from "../model/nodes";
import type { HomelabZone } from "../model/layout";
import { HOMELAB_MOBILE_QUERY } from "../model/view";
import styles from "./homelab.module.css";

const getMobileSnapshot = () => window.matchMedia(HOMELAB_MOBILE_QUERY).matches;
const getServerSnapshot = () => false;
function subscribeMobile(onChange: () => void) {
  const query = window.matchMedia(HOMELAB_MOBILE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

interface NetworkPanelProps {
  zone: HomelabZone;
  clients: HomelabZone[];
  onClose: () => void;
  onEnter: (id: string) => void;
  onLeave: () => void;
}

export const NetworkPanel = memo(function NetworkPanel({ zone, clients, onClose, onEnter, onLeave }: NetworkPanelProps) {
  const isMobile = useSyncExternalStore(subscribeMobile, getMobileSnapshot, getServerSnapshot);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!isMobile) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => dialog.close();
  }, [isMobile]);

  const content = (
    <>
      <div className={styles.networkPanelTop}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть сведения о сети">
          ×
        </button>
        <div className={styles.networkPanelHeader}>
          <TechLogo tech="wireguard" size={28} />
          <div>
            <span>WIREGUARD</span>
            <h2 id="wireguard-title">{HOMELAB_WIREGUARD.name}</h2>
          </div>
        </div>
      </div>
      <div className={styles.networkPanelBody}>
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
            {client.logo && <TechLogo tech={client.logo} size={14} />}
            <span>{client.name}</span>
            <code>{HOMELAB_WIREGUARD_ADDRESSES[client.id] ?? "IP не указан"}</code>
          </span>
        ))}
      </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <dialog
        ref={dialogRef}
        id="wireguard-network"
        className={`${styles.networkPanel} ${styles.networkSheet}`}
        aria-labelledby="wireguard-title"
        onCancel={(e) => { e.preventDefault(); onClose(); }}
        onClick={(e) => {
          if (e.target !== e.currentTarget) return;
          const rect = e.currentTarget.getBoundingClientRect();
          if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) onClose();
        }}
      >
        {content}
      </dialog>
    );
  }

  return (
    <aside id="wireguard-network" className={styles.networkPanel} aria-labelledby="wireguard-title" onPointerEnter={() => onEnter(zone.id)} onPointerLeave={onLeave}>
      {content}
    </aside>
  );
});
