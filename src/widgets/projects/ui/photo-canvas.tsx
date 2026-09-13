"use client";

import { useTranslation } from "@/shared/lib/language";
import { InfiniteCanvas } from "@/widgets/homelab-canvas";
import type { ProjectImage } from "../model/project-images";
import styles from "./photo-canvas.module.css";

const copy = {
  ru: {
    label: "Фотографии проекта",
    keyboard: "Стрелки — перемещение, плюс и минус — масштаб, 0 — показать всё.",
    empty: "Фотографии скоро появятся",
    detail: "Здесь будут фотографии и скриншоты проекта",
    controls: { hint: "Перетаскивайте полотно", zoomHint: "· Ctrl + колесо — масштаб", zoomOut: "Уменьшить", zoomIn: "Увеличить", fit: "Всё полотно", fitLabel: "Показать всё полотно" },
  },
  en: {
    label: "Project photos",
    keyboard: "Arrow keys to pan, plus and minus to zoom, 0 to fit all.",
    empty: "Photos coming soon",
    detail: "Project photos and screenshots will appear here",
    controls: { hint: "Drag to pan", zoomHint: "· Ctrl + scroll to zoom", zoomOut: "Zoom out", zoomIn: "Zoom in", fit: "Fit all", fitLabel: "Fit all content" },
  },
};

export function PhotoCanvas({ images, projectName }: { images: ProjectImage[]; projectName: string }) {
  const { lang } = useTranslation();
  const text = copy[lang];
  const x = images.length ? Math.min(...images.map((image) => image.x)) : 0;
  const y = images.length ? Math.min(...images.map((image) => image.y)) : 0;
  const w = images.length ? Math.max(...images.map((image) => image.x + image.width)) - x : 400;
  const h = images.length ? Math.max(...images.map((image) => image.y + image.height)) - y : 220;

  return (
    <InfiniteCanvas bounds={{ x, y, w, h }} ariaLabel={`${text.label}: ${projectName}. ${text.keyboard}`} controls={text.controls}>
      {images.length ? images.map((image) => (
        <img key={image.src} src={image.src} alt={image.alt[lang]} width={image.width} height={image.height} draggable={false} decoding="async" className={styles.photo} style={{ left: image.x, top: image.y, width: image.width, height: image.height }} />
      )) : (
        <div className={styles.empty}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8" cy="8" r="1.5" /><path d="m3 17 5-5 4 4 4-6 5 7" /></svg>
          <strong>{text.empty}</strong>
          <p>{text.detail}</p>
          <span>{projectName}</span>
        </div>
      )}
    </InfiniteCanvas>
  );
}
