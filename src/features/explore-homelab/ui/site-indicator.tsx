import { memo } from "react";
import type { HomelabStatus, HomelabSiteId } from "@/shared/api/homelab-status";
import { SITE_STATUS_LABELS, SITE_URL_LABELS } from "./status-copy";
import styles from "./homelab.module.css";

function siteStatusLabel(site: HomelabSiteId, statuses: HomelabStatus) {
  const status = statuses[site];
  if (!status) return "Проверяем доступность…";
  return SITE_STATUS_LABELS[status.state];
}

export const SiteIndicator = memo(function SiteIndicator({ site, statuses }: { site?: HomelabSiteId; statuses: HomelabStatus }) {
  if (!site) return null;
  const status = statuses[site];
  const label = `${SITE_URL_LABELS[site]} · ${siteStatusLabel(site, statuses)}${status ? ` · Проверено: ${new Date(status.checkedAt).toLocaleTimeString("ru-RU")}` : ""}`;
  return <span className={styles.siteIndicator} data-state={status?.state ?? "pending"} role="img" aria-label={label} title={label} />;
});
