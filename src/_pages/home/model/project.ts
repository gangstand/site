import type { Lang } from "@/shared/lib/language";

export interface ProjectImage {
  src: string;
  alt: Record<Lang, string>;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ProjectDestination = { kind: "external"; url: string };

export type ProjectThumbnail =
  | { kind: "image"; size: { width: number; height: number } }
  | { kind: "placeholder" };

export type ProjectDetail =
  | { kind: "photos" }
  | { kind: "homelab"; label: Record<Lang, string> };

export interface ProjectDefinition {
  id: string;
  name: string | Record<Lang, string>;
  destination?: ProjectDestination;
  description: Record<Lang, string>;
  images: ProjectImage[];
  thumbnail: ProjectThumbnail;
  detail: ProjectDetail;
}

export type ProjectView = Omit<ProjectDefinition, "name" | "description" | "detail"> & {
  name: string;
  description: string;
  detail: { kind: "photos"; canvasLabel: string } | { kind: "homelab"; canvasLabel: string };
};

export function projectView(project: ProjectDefinition, lang: Lang): ProjectView {
  const name = typeof project.name === "string" ? project.name : project.name[lang];
  const detail = project.detail.kind === "homelab"
    ? { kind: "homelab" as const, canvasLabel: project.detail.label[lang] }
    : {
        kind: "photos" as const,
        canvasLabel: `${lang === "ru" ? "Фотографии проекта" : "Project photos"}: ${name}`,
      };

  return { ...project, name, description: project.description[lang], detail };
}
