export type View = "traffic" | "pipeline" | "monitoring" | "vpn" | "all";

export const VIEWS: [View, string][] = [
  ["traffic", "Трафик"],
  ["pipeline", "CI/CD"],
  ["monitoring", "Мониторинг"],
  ["vpn", "WireGuard"],
  ["all", "Все связи"],
];
