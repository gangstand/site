"use client";

import type { ProjectEntry } from "@/shared/config/translations";
import { useTranslation } from "@/shared/lib/language";
import { PROJECT_IMAGES } from "../model/project-images";
import { PhotoCanvas } from "./photo-canvas";
import { ProjectDialog } from "./project-dialog";
import styles from "./project-dialog.module.css";

export function WebsiteProjectDialog({ project, onClose }: { project: ProjectEntry; onClose: () => void }) {
  const { lang } = useTranslation();
  const text = lang === "ru"
    ? { about: "О проекте", pending: "Текст в разработке", canvas: "Фотографии проекта", visit: "Перейти на сайт" }
    : { about: "About the project", pending: "Project write-up in progress", canvas: "Project photos", visit: "Visit website" };

  return (
    <ProjectDialog
      title={project.name}
      category={project.domain}
      intro={project.description}
      detailsLabel={text.about}
      canvasLabel={`${text.canvas}: ${project.name}`}
      canvas={<PhotoCanvas images={PROJECT_IMAGES[project.domain] ?? []} projectName={project.name} />}
      headerAction={<a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>{text.visit} <span aria-hidden="true">↗</span></a>}
      onClose={onClose}
    >
      <section><h3>{text.about}</h3><p>{text.pending}</p></section>
    </ProjectDialog>
  );
}
