import type { ProjectDefinition } from "../model/project";

export const swapdog: ProjectDefinition = {
  id: "swapdog",
  name: "SwapDog",
  destination: { kind: "external", url: "https://swapdog.ru" },
  description: {
    ru: "Автоматический обмен документами между iiko и ЭДО.",
    en: "Automated document exchange between iiko and EDI.",
  },
  images: [],
  thumbnail: { kind: "image", size: { width: 994, height: 885 } },
  detail: { kind: "photos" },
};
