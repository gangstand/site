"use client";

import dynamic from "next/dynamic";
import type { ProjectEntry } from "@/shared/config/translations";
import { useTranslation } from "@/shared/lib/language";
import { ProjectDialog } from "./project-dialog";
import styles from "./project-dialog.module.css";

const HomelabCanvas = dynamic(
  () => import("@/widgets/homelab-canvas").then((module) => module.HomelabCanvas),
  { loading: () => <div className={styles.loading} role="status">Loading Homelab…</div> },
);

export function HomelabDialog({ project, onClose }: { project: ProjectEntry; onClose: () => void }) {
  const { lang } = useTranslation();
  const text = lang === "ru"
    ? { about: "О проекте", pending: "Текст в разработке", canvas: "Карта инфраструктуры" }
    : { about: "About the project", pending: "Project write-up in progress", canvas: "Infrastructure map" };

  return (
    <ProjectDialog
      title={project.name}
      category={project.domain}
      intro={project.description}
      detailsLabel={text.about}
      canvasLabel={text.canvas}
      canvas={<HomelabCanvas embedded />}
      onClose={onClose}
    >
      <section><h3>{text.about}</h3><p>{text.pending}</p></section>
    </ProjectDialog>
  );
}
