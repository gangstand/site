import type { ProjectDefinition } from "../model/project";

export const teamtasker: ProjectDefinition = {
  id: "teamtasker",
  name: "TeamTasker",
  destination: { kind: "external", url: "https://teamtasker.ru" },
  description: {
    ru: "Управление задачами, командой и финансами в одном приложении.",
    en: "Task, team, and finance management in one app.",
  },
  images: [],
  thumbnail: { width: 994, height: 787 },
  detail: { kind: "photos" },
};
