"use client";

import type { ComponentType } from "react";
import { useTranslation } from "@/shared/lib/language";
import { SwapdogThumbnail } from "./thumbnails/swapdog-thumbnail";

const PROJECT_THUMBNAILS: Record<string, ComponentType> = {
  "swapdog.ru": SwapdogThumbnail,
};

export function Projects() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      {t.projects.map((project) => {
        const Thumbnail = PROJECT_THUMBNAILS[project.domain];
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
                className="relative w-full overflow-hidden rounded-[12px] border border-primary/5 bg-primary/5 aspect-square [container-type:inline-size]"
              >
                {Thumbnail && <Thumbnail />}
              </div>
            </a>
            <p className="text-sm font-normal">{project.description}</p>
          </article>
        );
      })}
    </div>
  );
}
