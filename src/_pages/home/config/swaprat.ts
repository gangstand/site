import type { ProjectDefinition } from "../model/project";

export const swaprat: ProjectDefinition = {
  id: "swaprat",
  name: "SwapRat",
  destination: { kind: "external", url: "https://swaprat.ru/" },
  description: {
    ru: "Система контроля и аудита в ресторане.",
    en: "Restaurant control and audit system.",
  },
  images: [],
  thumbnail: { width: 1000, height: 819 },
  detail: { kind: "photos" },
};
