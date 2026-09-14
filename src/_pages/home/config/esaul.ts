import type { ProjectDefinition } from "../model/project";

export const esaul: ProjectDefinition = {
  id: "esaul",
  name: { ru: "ЕСАУЛ", en: "ESAUL" },
  destination: { kind: "external", url: "https://esaul.site" },
  description: {
    ru: "Автоматизация технической поддержки и заявок.",
    en: "Automates technical support and ticket workflows.",
  },
  images: [],
  thumbnail: { kind: "image", size: { width: 994, height: 896 } },
  detail: { kind: "photos" },
};
