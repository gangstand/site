import { memo } from "react";
import { HOMELAB_SITES, SITE_STATUS_LABELS, type HomelabStatus, type HomelabSiteId } from "@/shared/config/homelab-status";
import styles from "./homelab.module.css";

export function siteStatusLabel(site: HomelabSiteId, statuses: HomelabStatus) {
  const status = statuses[site];
  if (!status) return "Проверяем доступность…";
  return SITE_STATUS_LABELS[status.state];
}

export const SiteIndicator = memo(function SiteIndicator({ site, statuses }: { site?: HomelabSiteId; statuses: HomelabStatus }) {
  if (!site) return null;
  const status = statuses[site];
  const label = `${HOMELAB_SITES[site]} · ${siteStatusLabel(site, statuses)}${status ? ` · Проверено: ${new Date(status.checkedAt).toLocaleTimeString("ru-RU")}` : ""}`;
  return <span className={styles.siteIndicator} data-state={status?.state ?? "pending"} role="img" aria-label={label} title={label} />;
});
