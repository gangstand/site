"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "@/shared/lib/language";
import { CanvasViewport, canvasCopy, type CanvasBounds, type CanvasHandle } from "@/shared/ui/infinite-canvas";
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

/** Indices of the photos overlapping `rect`, in canvas coordinates. */
function coveredBy(images: ProjectImage[], rect: CanvasBounds): number[] {
  const covered: number[] = [];
  for (let index = 0; index < images.length; index++) {
    const image = images[index];
    if (image.x < rect.x + rect.w && image.x + image.width > rect.x && image.y < rect.y + rect.h && image.y + image.height > rect.y) {
      covered.push(index);
    }
  }
  return covered;
}

function sameMembership(a: number[] | null, b: number[]): boolean {
  return a !== null && a.length === b.length && a.every((value, index) => value === b[index]);
}

export function PhotoCanvas({ images, projectName }: { images: ProjectImage[]; projectName: string }) {
  const { lang } = useTranslation();
  const text = copy[lang];
  const canvasRef = useRef<CanvasHandle>(null);
  const x = images.length ? Math.min(...images.map((image) => image.x)) : 0;
  const y = images.length ? Math.min(...images.map((image) => image.y)) : 0;
  const w = images.length ? Math.max(...images.map((image) => image.x + image.width)) - x : 400;
  const h = images.length ? Math.max(...images.map((image) => image.y + image.height)) - y : 220;

  // Which photos carry their picture. Starts as all of them: every project opens fitted, where
  // the whole set is on screen anyway, so the first camera narrows this rather than filling it.
  const [drawn, setDrawn] = useState<number[] | null>(null);
  const drawnRef = useRef<number[] | null>(null);
  const decoded = useRef(new Set<string>());
  const preparing = useRef(0);

  const handleVisibleRect = useCallback((rect: CanvasBounds) => {
    const covered = coveredBy(images, rect);
    // The camera reports every frame; only a change of membership is worth a render.
    if (sameMembership(drawnRef.current, covered)) return;
    drawnRef.current = covered;
    setDrawn(covered);
  }, [images]);

  /** Warms the decoded copy of a photo the camera is heading for, without delaying the camera. */
  const prepare = useCallback((src: string) => {
    if (decoded.current.has(src)) return;
    const token = ++preparing.current;
    const image = new Image();
    image.src = src;
    image
      .decode()
      .then(() => {
        // A later activation has taken over; this result is stale and its photo may be gone.
        if (token !== preparing.current) return;
        decoded.current.add(src);
      })
      .catch(() => {
        // A photo that cannot be loaded or decoded stays an empty frame; the canvas carries on.
      });
  }, []);

  const visible = useMemo(() => (drawn === null ? null : new Set(drawn)), [drawn]);

  return (
    <CanvasViewport
      bounds={{ x, y, w, h }}
      labels={canvasCopy[lang]}
      ariaLabel={`${text.label}: ${projectName}`}
      fitOnMount
      canvasRef={canvasRef}
      onVisibleRectChange={handleVisibleRect}
    >
      {images.length ? images.map((image, index) => (
        <button
          key={image.src}
          type="button"
          aria-label={image.alt[lang]}
          className={styles.photo}
          style={{ left: image.x, top: image.y, width: image.width, height: image.height }}
          onClick={() => {
            prepare(image.src);
            canvasRef.current?.focusRect({ x: image.x, y: image.y, w: image.width, h: image.height });
          }}
        >
          {/* Only the picture comes and goes with the camera — the control itself stays mounted,
              so tile geometry, tab order, focus and an in-flight pointer capture are untouched. */}
          {visible === null || visible.has(index) ? (
            <img src={image.src} alt="" width={image.width} height={image.height} draggable={false} decoding="async" className={styles.photoImage} />
          ) : null}
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
