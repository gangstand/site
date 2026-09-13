"use client";

import { useState } from "react";
import { ProjectDetailDialog } from "./project-detail-dialog";
import { projects } from "../model/projects";
import { projectName } from "../model/project";
import { useTranslation } from "@/shared/lib/language";

export function Projects() {
  const { lang } = useTranslation();
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeProject = projects.find((project) => project.id === activeId);

  return (
    <div className="flex flex-col gap-6">
      {projects.map((project) => (
        <article key={project.id} className="flex flex-col gap-3">
          <button
            type="button"
            aria-label={projectName(project, lang)}
            aria-haspopup="dialog"
            aria-expanded={activeId === project.id}
            onClick={() => setActiveId(project.id)}
            className="block w-full cursor-pointer overflow-hidden rounded-[12px] border border-primary/5 bg-primary/5 transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary"
          >
            {project.thumbnail === false ? (
              <div className="h-[300px] w-full bg-primary/10 sm:h-[500px]" />
            ) : (
              <img
                src={`/projects/${project.id}/thumbnail.webp`}
                alt=""
                width={project.thumbnailSize?.width}
                height={project.thumbnailSize?.height}
                className="h-auto w-full bg-primary/10"
                style={{ aspectRatio: project.thumbnailSize ? `${project.thumbnailSize.width} / ${project.thumbnailSize.height}` : "1 / 1" }}
              />
            )}
          </button>
          {project.description[lang] && <p className="text-sm font-normal">{project.description[lang]}</p>}
        </article>
      ))}
      {activeProject && <ProjectDetailDialog key={activeProject.id} project={activeProject} onClose={() => setActiveId(null)} />}
    </div>
  );
}
