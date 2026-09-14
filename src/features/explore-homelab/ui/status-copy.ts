import type { HomelabSiteId, SiteStatusState } from "@/shared/api/homelab-status";

export const SITE_URL_LABELS: Record<HomelabSiteId, string> = {
  root: "https://gangstand.tech",
  portainer: "https://portainer.gangstand.tech",
  traefik: "https://traefik.gangstand.tech",
  harbor: "https://harbor.gangstand.tech",
  jenkins: "https://jenkins.gangstand.tech",
  grafana: "https://grafana.gangstand.tech",
  zabbix: "https://zabbix.gangstand.tech",
  redisinsight: "https://redis.gangstand.tech",
};

export const SITE_STATUS_LABELS: Record<SiteStatusState, string> = {
  up: "Сайт доступен",
  auth: "Сайт отвечает · доступ ограничен авторизацией или правами",
  down: "Сайт недоступен или отвечает с ошибкой",
  unknown: "Не удалось выполнить проверку",
};
