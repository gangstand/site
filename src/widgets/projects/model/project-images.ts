import type { Lang } from "@/shared/config/translations";

export interface ProjectImage {
  src: string;
  alt: Record<Lang, string>;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Add photos from public/projects/<project>/ here. Coordinates and dimensions
// describe their placement on the infinite canvas, in world pixels.
export const PROJECT_IMAGES: Record<string, ProjectImage[]> = {
  "teamtasker.ru": [],
  "swapdog.ru": [],
  "esaul.site": [],
  "swaprat.ru": [],
};
