"use client";

import { useRef } from "react";
import { useTranslation } from "@/shared/lib/language";
import { CanvasViewport, canvasCopy, type CanvasHandle } from "@/shared/ui/infinite-canvas";
import type { ProjectImage } from "../model/project";
import styles from "./photo-canvas.module.css";

const copy = {
  ru: {
    label: "Фотографии проекта",
    empty: "Фотографии скоро появятся",
    detail: "Здесь будут фотографии и скриншоты проекта",
  },
  en: {
    label: "Project photos",
    empty: "Photos coming soon",
    detail: "Project photos and screenshots will appear here",
  },
};

export function PhotoCanvas({ images, projectName }: { images: ProjectImage[]; projectName: string }) {
  const { lang } = useTranslation();
  const text = copy[lang];
  const canvasRef = useRef<CanvasHandle>(null);
  const x = images.length ? Math.min(...images.map((image) => image.x)) : 0;
  const y = images.length ? Math.min(...images.map((image) => image.y)) : 0;
  const w = images.length ? Math.max(...images.map((image) => image.x + image.width)) - x : 400;
  const h = images.length ? Math.max(...images.map((image) => image.y + image.height)) - y : 220;

  return (
    <CanvasViewport bounds={{ x, y, w, h }} labels={canvasCopy[lang]} ariaLabel={`${text.label}: ${projectName}`} fitOnMount canvasRef={canvasRef}>
      {images.length ? images.map((image) => (
        <button
          key={image.src}
          type="button"
          aria-label={image.alt[lang]}
          className={styles.photo}
          style={{ left: image.x, top: image.y, width: image.width, height: image.height }}
          onClick={() => canvasRef.current?.focusRect({ x: image.x, y: image.y, w: image.width, h: image.height })}
        >
          <img src={image.src} alt="" width={image.width} height={image.height} draggable={false} decoding="async" className={styles.photoImage} />
        </button>
      )) : (
        <div className={styles.empty}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8" cy="8" r="1.5" /><path d="m3 17 5-5 4 4 4-6 5 7" /></svg>
          <strong>{text.empty}</strong>
          <p>{text.detail}</p>
          <span>{projectName}</span>
        </div>
      )}
    </CanvasViewport>
  );
}
