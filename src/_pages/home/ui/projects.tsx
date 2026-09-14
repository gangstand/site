"use client";

import { useState } from "react";
import { ProjectDetailDialog, detailRenderers } from "./project-detail-dialog";
import { projects } from "../config/projects";
import { projectView } from "../model/project";
import { useTranslation } from "@/shared/lib/language";

export function Projects() {
  const { lang } = useTranslation();
  const [activeId, setActiveId] = useState<string | null>(null);
  const projectViews = projects.map((project) => projectView(project, lang));
  const activeProject = projectViews.find((project) => project.id === activeId);

  return (
    <div className="flex flex-col gap-6">
      {projectViews.map((project) => (
        <article key={project.id} className="flex flex-col gap-3">
          <button
            type="button"
            aria-label={project.name}
            aria-haspopup="dialog"
            aria-expanded={activeId === project.id}
            onClick={() => setActiveId(project.id)}
            className="block w-full cursor-pointer overflow-hidden rounded-[12px] border border-primary/5 bg-primary/5 transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary"
          >
            <img
              src={`/projects/${project.id}/thumbnail.webp`}
              alt=""
              width={project.thumbnail.width}
              height={project.thumbnail.height}
              className="h-auto w-full bg-primary/10"
              style={{ aspectRatio: `${project.thumbnail.width} / ${project.thumbnail.height}` }}
            />
          </button>
          {project.description && <p className="text-sm font-normal">{project.description}</p>}
        </article>
      ))}
      {activeProject && <ProjectDetailDialog key={activeProject.id} project={activeProject} renderDetail={detailRenderers[activeProject.detail.kind]} onClose={() => setActiveId(null)} />}
    </div>
  );
}
