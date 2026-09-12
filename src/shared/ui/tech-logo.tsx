import {
  siDebian,
  siDocker,
  siErlang,
  siGrafana,
  siGithub,
  siHarbor,
  siJenkins,
  siNextdotjs,
  siNginx,
  siPhp,
  siPortainer,
  siProxmox,
  siPostgresql,
  siRabbitmq,
  siRedis,
  siTraefikproxy,
  siWireguard,
  type SimpleIcon,
} from "simple-icons/icons";

export type TechKey =
  | "github"
  | "proxmox"
  | "docker"
  | "traefik"
  | "grafana"
  | "portainer"
  | "redis"
  | "redisinsight"
  | "nextjs"
  | "harbor"
  | "postgresql"
  | "nginx"
  | "jenkins"
  | "php"
  | "rabbitmq"
  | "erlang"
  | "wireguard"
  | "debian"
  | "zabbix";

interface LogoDef {
  viewBox: string;
  paths: { d: string; fill: string }[];
  color: string;
}

function fromSimpleIcon(icon: SimpleIcon): LogoDef {
  return { viewBox: "0 0 24 24", paths: [{ d: icon.path, fill: `#${icon.hex}` }], color: `#${icon.hex}` };
}

// Official Zabbix wordmark (Wikimedia Commons, "Zabbix logo square.svg"),
// cropped to the red bar the logo actually occupies within its square canvas.
const ZABBIX_LOGO: LogoDef = {
  viewBox: "0 147.86762 400.83 104.99",
  color: "#D40000",
  paths: [
    { d: "m 0,147.86762 h 400.83 v 104.99 H 0 Z m 0,0", fill: "#D40000" },
    {
      d: "M 17.14,163.86762 H 75.1 v 7.53 l -46.65,57.15 h 47.79 v 8.31 H 16 v -7.53 l 46.65,-57.15 H 17.14 Z m 98.3,9.73 -13.54,36.33 h 27.13 z m -5.64,-9.73 h 11.32 l 28.12,72.99 h -10.38 l -6.71,-18.72 H 98.88 l -6.72,18.72 H 81.63 Z m 60.14,38.13 v 26.74 h 16.01 c 5.37,0 9.35,-1.1 11.94,-3.3 2.59,-2.2 3.88,-5.57 3.88,-10.09 0,-4.56 -1.29,-7.93 -3.88,-10.1 -2.59,-2.16 -6.57,-3.25 -11.94,-3.25 z m 0,-30.02 v 22 h 14.78 c 4.88,0 8.51,-0.91 10.9,-2.71 2.39,-1.81 3.58,-4.57 3.58,-8.28 0,-3.68 -1.2,-6.44 -3.58,-8.26 -2.39,-1.82 -6.02,-2.74 -10.9,-2.74 h -14.78 z m -9.98,-8.11 h 25.5 c 7.61,0 13.48,1.56 17.59,4.69 4.12,3.13 6.17,7.58 6.17,13.35 0,4.46 -1.05,8.02 -3.16,10.66 -2.11,2.64 -5.21,4.29 -9.29,4.94 4.91,1.04 8.72,3.21 11.44,6.52 2.72,3.31 4.08,7.44 4.08,12.39 0,6.52 -2.24,11.55 -6.72,15.11 -4.48,3.55 -10.86,5.33 -19.12,5.33 h -26.49 z m 78.32,38.13 v 26.74 h 16.02 c 5.37,0 9.35,-1.1 11.93,-3.3 2.59,-2.2 3.88,-5.57 3.88,-10.09 0,-4.56 -1.29,-7.93 -3.88,-10.1 -2.59,-2.16 -6.57,-3.25 -11.93,-3.25 z m 0,-30.02 v 22 h 14.78 c 4.88,0 8.51,-0.91 10.9,-2.71 2.39,-1.81 3.58,-4.57 3.58,-8.28 0,-3.68 -1.19,-6.44 -3.58,-8.26 -2.39,-1.82 -6.02,-2.74 -10.9,-2.74 h -14.78 z m -9.98,-8.11 h 25.5 c 7.61,0 13.48,1.56 17.59,4.69 4.12,3.13 6.18,7.58 6.18,13.35 0,4.46 -1.05,8.02 -3.16,10.66 -2.11,2.64 -5.21,4.29 -9.29,4.94 4.91,1.04 8.72,3.21 11.44,6.52 2.72,3.31 4.08,7.44 4.08,12.39 0,6.52 -2.24,11.55 -6.72,15.11 -4.48,3.55 -10.86,5.33 -19.12,5.33 h -26.5 z m 97.24,0 h 10.98 l 17.35,26.21 17.52,-26.21 H 382 l -22.84,34.19 25.68,38.8 h -10.98 l -20.21,-30.54 -20.41,30.54 h -10.61 l 25.74,-38.52 z m -28.91,0 h 9.98 v 72.99 h -9.98 z m 0,0",
      fill: "#ffffff",
    },
  ],
};

export const LOGOS: Record<TechKey, LogoDef> = {
  github: fromSimpleIcon(siGithub),
  proxmox: fromSimpleIcon(siProxmox),
  docker: fromSimpleIcon(siDocker),
  traefik: fromSimpleIcon(siTraefikproxy),
  grafana: fromSimpleIcon(siGrafana),
  portainer: fromSimpleIcon(siPortainer),
  // Redis official mark in the original Redis red.
  redis: { viewBox: "0 0 24 24", paths: [{ d: siRedis.path, fill: "#DC382D" }], color: "#DC382D" },
  redisinsight: { viewBox: "0 0 24 24", paths: [{ d: siRedis.path, fill: "#DC382D" }], color: "#DC382D" },
  // Next.js's mark is pure black — swap to the current text color so it
  // stays visible on this page's dark theme (and still works in light mode).
  nextjs: { viewBox: "0 0 24 24", paths: [{ d: siNextdotjs.path, fill: "var(--primary)" }], color: "var(--primary)" },
  harbor: fromSimpleIcon(siHarbor),
  postgresql: fromSimpleIcon(siPostgresql),
  nginx: fromSimpleIcon(siNginx),
  jenkins: fromSimpleIcon(siJenkins),
  php: fromSimpleIcon(siPhp),
  rabbitmq: fromSimpleIcon(siRabbitmq),
  erlang: fromSimpleIcon(siErlang),
  wireguard: fromSimpleIcon(siWireguard),
  debian: fromSimpleIcon(siDebian),
  zabbix: ZABBIX_LOGO,
};

export function TechLogo({ tech, size = 14, className }: { tech: TechKey; size?: number; className?: string }) {
  const def = LOGOS[tech];
  const isWide = def.viewBox === ZABBIX_LOGO.viewBox;
  return (
    <svg
      viewBox={def.viewBox}
      width={isWide ? size * 2.2 : size}
      height={size}
      className={className}
      data-tech={tech}
      role="img"
      aria-hidden="true"
    >
      {tech === "redis" ? <image href="/redis-logo.svg" width="24" height="24" preserveAspectRatio="xMidYMid meet"/> : def.paths.map((p) => (
        <path key={p.d.slice(0, 24)} d={p.d} style={{ fill: p.fill }} />
      ))}
    </svg>
  );
}
