"use client";

import type { ComponentType } from "react";
import { useTranslation } from "@/shared/lib/language";
import { SwapdogThumbnail } from "./thumbnails/swapdog-thumbnail";
import { TeamtaskerThumbnail } from "./thumbnails/teamtasker-thumbnail";
import { EsaulThumbnail } from "./thumbnails/esaul-thumbnail";

const PROJECT_THUMBNAILS: Record<string, { Component: ComponentType; autoHeight?: boolean }> = {
  "swapdog.ru": { Component: SwapdogThumbnail, autoHeight: true },
  "teamtasker.ru": { Component: TeamtaskerThumbnail, autoHeight: true },
  "esaul.site": { Component: EsaulThumbnail, autoHeight: true },
};

export function Projects() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      {t.projects.map((project) => {
        const thumbnail = PROJECT_THUMBNAILS[project.domain];
        const Thumbnail = thumbnail?.Component;
        return (
          <article key={project.url} className="flex flex-col gap-3">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block space-y-3 transition-opacity hover:opacity-80"
            >
              <div
                aria-hidden="true"
                className={`relative w-full overflow-hidden rounded-[12px] border border-primary/5 bg-primary/5 [container-type:inline-size] ${thumbnail?.autoHeight ? "" : "aspect-square"}`}
              >
                {Thumbnail && <Thumbnail />}
              </div>
            </a>
            <p className="text-xs font-medium text-secondary">{project.name}</p>
            {project.description && <p className="text-sm font-normal">{project.description}</p>}
          </article>
        );
      })}
    </div>
  );
}
