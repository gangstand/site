"use client";

import dynamic from "next/dynamic";
import type { ProjectDefinition } from "../model/project";
import styles from "../ui/project-dialog.module.css";

const HomelabCanvas = dynamic(
  () => import("./ui/homelab-canvas").then((module) => module.HomelabCanvas),
  { loading: () => <div className={styles.loading} role="status">Loading Homelab…</div> },
);

function EmbeddedHomelab() {
  return <HomelabCanvas embedded />;
}

export const homelab: ProjectDefinition = {
  id: "homelab",
  name: "HomeLab",
  domain: "homelab",
  url: "/homelab",
  description: {
    ru: "Личная инфраструктура на гипервизоре.",
    en: "Personal infrastructure on a hypervisor.",
  },
  images: [],
  canvas: {
    component: EmbeddedHomelab,
    label: { ru: "Карта инфраструктуры", en: "Infrastructure map" },
  },
};
