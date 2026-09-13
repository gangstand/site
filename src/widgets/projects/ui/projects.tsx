"use client";

import { useState, type ComponentType } from "react";
import { HomelabDialog } from "./homelab-dialog";
import { WebsiteProjectDialog } from "./website-project-dialog";
import { useTranslation } from "@/shared/lib/language";
import { SwapdogThumbnail } from "./thumbnails/swapdog-thumbnail";
import { TeamtaskerThumbnail } from "./thumbnails/teamtasker-thumbnail";
import { EsaulThumbnail } from "./thumbnails/esaul-thumbnail";
import { HomelabThumbnail } from "./thumbnails/homelab-thumbnail";
import { SwapratThumbnail } from "./thumbnails/swaprat-thumbnail";

const PROJECT_THUMBNAILS: Record<string, { Component: ComponentType; autoHeight?: boolean }> = {
  homelab: { Component: HomelabThumbnail, autoHeight: true },
  "swapdog.ru": { Component: SwapdogThumbnail, autoHeight: true },
  "teamtasker.ru": { Component: TeamtaskerThumbnail, autoHeight: true },
  "esaul.site": { Component: EsaulThumbnail, autoHeight: true },
  "swaprat.ru": { Component: SwapratThumbnail, autoHeight: true },
};

export function Projects() {
  const { t } = useTranslation();
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const activeProject = t.projects.find((project) => project.domain === activeDomain);

  return (
    <div className="flex flex-col gap-6">
      {t.projects.map((project) => {
        const thumbnail = PROJECT_THUMBNAILS[project.domain];
        const Thumbnail = thumbnail?.Component;
        return (
          <article key={project.url} className="flex flex-col gap-3">
              <button
                type="button"
                aria-label={project.name}
                aria-haspopup="dialog"
                aria-expanded={activeDomain === project.domain}
                onClick={() => setActiveDomain(project.domain)}
                className="block w-full cursor-pointer overflow-hidden rounded-[12px] border border-primary/5 bg-primary/5 transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary"
              >
                {Thumbnail && <Thumbnail />}
              </button>
            {project.description && <p className="text-sm font-normal">{project.description}</p>}
          </article>
        );
      })}
      {activeProject && (activeProject.domain === "homelab"
        ? <HomelabDialog project={activeProject} onClose={() => setActiveDomain(null)} />
        : <WebsiteProjectDialog key={activeProject.domain} project={activeProject} onClose={() => setActiveDomain(null)} />)}
    </div>
  );
}
