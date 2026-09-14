import type { ProjectDefinition } from "../model/project";

export const homelab: ProjectDefinition = {
  id: "homelab",
  name: "HomeLab",
  description: {
    ru: "Личная инфраструктура на гипервизоре.",
    en: "Personal infrastructure on a hypervisor.",
  },
  images: [],
  thumbnail: { width: 994, height: 644 },
  detail: {
    kind: "homelab",
    label: { ru: "Карта инфраструктуры", en: "Infrastructure map" },
  },
};
