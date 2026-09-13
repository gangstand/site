import type { ComponentType } from "react";
import type { Lang } from "@/shared/config/translations";

export interface ProjectImage {
  src: string;
  alt: Record<Lang, string>;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ProjectDefinition {
  id: string;
  name: string | Record<Lang, string>;
  domain: string;
  url: string;
  description: Record<Lang, string>;
  images: ProjectImage[];
  canvas?: { component: ComponentType; label: Record<Lang, string> };
}

export function projectName(project: ProjectDefinition, lang: Lang) {
  return typeof project.name === "string" ? project.name : project.name[lang];
}
