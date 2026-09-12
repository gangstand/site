import { memo } from "react";
import { HOMELAB_SITE_BY_NODE, HOMELAB_SITES, type HomelabStatus } from "@/shared/config/homelab-status";
import type { LayoutNode } from "../model/layout";
import { byId, type HomelabConnectionRoute } from "../model/connections";
import type { View } from "../model/view";
import { siteStatusLabel } from "./site-indicator";
import styles from "./homelab.module.css";

interface InspectorPanelProps {
  node: LayoutNode;
  view: View;
  relations: HomelabConnectionRoute[];
  statuses: HomelabStatus;
  onClose: () => void;
  onSelectRelation: (id: string) => void;
}

export const InspectorPanel = memo(function InspectorPanel({ node, view, relations, statuses, onClose, onSelectRelation }: InspectorPanelProps) {
  const site = HOMELAB_SITE_BY_NODE[node.id];
  return (
    <aside className={styles.inspector} aria-label="Подробности сервиса">
      <button className={styles.close} onClick={onClose} aria-label="Закрыть подробности">
        ×
      </button>
      <div className={styles.eyebrow}>{node.isVm ? "PROXMOX / VIRTUAL MACHINE" : "SERVICE DETAILS"}</div>
      <h2>{node.title}</h2>
      <p>{node.role}</p>
      {node.isProxy && <span className={styles.proxy}>REVERSE PROXY</span>}
      {node.id === "zabbix" && (view === "monitoring" || view === "all") && (
        <p>Линии показывают поступление метрик в Zabbix. Proxmox опрашивается по HTTP. Самоконтроль Zabbix: Linux by Zabbix agent · Zabbix server health.</p>
      )}
      <h3>Связи в выбранном контуре</h3>
      {relations.map((c) => (
        <button className={styles.relation} key={c.id} onClick={() => onSelectRelation(c.from === node.id ? c.to : c.from)}>
          <span>
            {c.from === node.id ? "→" : "←"} {byId.get(c.from === node.id ? c.to : c.from)?.title}
          </span>
          <small>{c.label ?? (c.kind === "proxy" ? "Reverse proxy" : c.kind === "pipeline" ? "Образы" : c.kind === "monitoring" ? "Мониторинг" : "Соединение")}</small>
        </button>
      ))}
      {relations.length === 0 && <p>В этом контуре связи не показаны.</p>}
      {node.services.length > 0 && <p className={styles.serviceList}>{node.services.map((s) => s.name).join(" · ")}</p>}
      {node.notes?.map((note) => <p key={note}>{note}</p>)}
      {site && (
        <p>
          {HOMELAB_SITES[site]}
          <br />
          {siteStatusLabel(site, statuses)}
        </p>
      )}
      <small className={styles.note}>Доступность публичных сайтов проверяется сервером каждые 30 секунд. Ответ с запросом авторизации подтверждает доступность сайта, но не состояние приложения за авторизацией.</small>
    </aside>
  );
});
