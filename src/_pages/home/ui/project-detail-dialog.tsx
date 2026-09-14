"use client";

import type { ReactNode } from "react";
import type { ProjectView } from "../model/project";
import { useTranslation } from "@/shared/lib/language";
import { HomelabCanvas } from "@/features/explore-homelab";
import { PhotoCanvas } from "./photo-canvas";
import { ProjectDialog } from "./project-dialog";
import styles from "./project-dialog.module.css";

type DetailRenderer = (project: ProjectView) => ReactNode;

export const detailRenderers: Record<ProjectView["detail"]["kind"], DetailRenderer> = {
  photos: (project) => <PhotoCanvas images={project.images} projectName={project.name} />,
  homelab: () => <HomelabCanvas embedded />,
};

export function ProjectDetailDialog({ project, renderDetail, onClose }: { project: ProjectView; renderDetail: DetailRenderer; onClose: () => void }) {
  const { t, lang } = useTranslation();
  const text = lang === "ru" ? { visit: "Перейти на сайт" } : { visit: "Visit website" };

  return (
    <ProjectDialog
      title={project.name}
      intro={project.description}
      detailsLabel={t.projectAbout}
      canvasLabel={project.detail.canvasLabel}
      canvas={renderDetail(project)}
      headerAction={project.destination?.kind === "external" && (
        <a href={project.destination.url} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>{text.visit} <span aria-hidden="true">↗</span></a>
      )}
      onClose={onClose}
    >
      <section><h3>{t.projectAbout}</h3><p>{t.projectPending}</p></section>
    </ProjectDialog>
  );
}
