export type View = "traffic" | "pipeline" | "monitoring" | "vpn" | "all";

export const HOMELAB_MOBILE_QUERY = "(max-width: 700px), (max-width: 1000px) and (pointer: coarse)";

export const VIEWS: [View, string][] = [
  ["traffic", "Трафик"],
  ["pipeline", "CI/CD"],
  ["monitoring", "Мониторинг"],
  ["vpn", "WireGuard"],
  ["all", "Все связи"],
];
