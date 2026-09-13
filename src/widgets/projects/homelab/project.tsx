import type { ProjectDefinition } from "../model/project";
import { HomelabCanvas } from "./ui/homelab-canvas";

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
  thumbnail: false,
  canvas: {
    component: EmbeddedHomelab,
    label: { ru: "Карта инфраструктуры", en: "Infrastructure map" },
  },
};
