"use client";

import { projectName, type ProjectDefinition } from "../model/project";
import { useTranslation } from "@/shared/lib/language";
import { PhotoCanvas } from "./photo-canvas";
import { ProjectDialog } from "./project-dialog";
import styles from "./project-dialog.module.css";

export function ProjectDetailDialog({ project, onClose }: { project: ProjectDefinition; onClose: () => void }) {
  const { t, lang } = useTranslation();
  const name = projectName(project, lang);
  const Canvas = project.canvas?.component;
  const external = /^https?:\/\//.test(project.url);
  const text = lang === "ru"
    ? { photos: "Фотографии проекта", visit: "Перейти на сайт" }
    : { photos: "Project photos", visit: "Visit website" };

  return (
    <ProjectDialog
      title={name}
      intro={project.description[lang]}
      detailsLabel={t.projectAbout}
      canvasLabel={project.canvas?.label[lang] ?? `${text.photos}: ${name}`}
      canvas={Canvas ? <Canvas /> : <PhotoCanvas images={project.images} projectName={name} />}
      headerAction={external && (
        <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>{text.visit} <span aria-hidden="true">↗</span></a>
      )}
      onClose={onClose}
    >
      <section><h3>{t.projectAbout}</h3><p>{t.projectPending}</p></section>
    </ProjectDialog>
  );
}
