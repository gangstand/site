"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "@/shared/lib/language";
import { CloseButton } from "@/shared/ui/close-button";
import styles from "./project-dialog.module.css";

const MIN_DETAILS_RATIO = 0.2;
const MAX_DETAILS_RATIO = 0.5;
const DEFAULT_DETAILS_RATIO = 1 / 3;
const RESIZE_STEP = 24;

interface ProjectDialogProps {
  title: string;
  intro: string;
  detailsLabel: string;
  canvasLabel: string;
  children: ReactNode;
  canvas: ReactNode;
  headerAction?: ReactNode;
  onClose: () => void;
}

export function ProjectDialog({ title, intro, detailsLabel, canvasLabel, children, canvas, headerAction, onClose }: ProjectDialogProps) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const [detailsWidth, setDetailsWidth] = useState<number | null>(null);
  const [resizing, setResizing] = useState(false);

  const clampWidth = useCallback((width: number) => {
    const bodyWidth = bodyRef.current?.getBoundingClientRect().width ?? width / MIN_DETAILS_RATIO;
    const min = Math.round(bodyWidth * MIN_DETAILS_RATIO);
    const max = Math.round(bodyWidth * MAX_DETAILS_RATIO);
    return Math.min(max, Math.max(min, width));
  }, []);

  const currentWidth = useCallback(
    () => detailsWidth ?? detailsRef.current?.getBoundingClientRect().width ?? 0,
    [detailsWidth],
  );

  useEffect(() => {
    const bodyEl = bodyRef.current;
    if (!bodyEl) return;
    const observer = new ResizeObserver(() => setDetailsWidth((w) => (w === null ? w : clampWidth(w))));
    observer.observe(bodyEl);
    return () => observer.disconnect();
  }, [clampWidth]);

  useLayoutEffect(() => {
    const dialog = ref.current!;
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    const bodyWidth = bodyRef.current?.getBoundingClientRect().width ?? 0;
    if (bodyWidth > 0) setDetailsWidth(clampWidth(Math.round(bodyWidth * DEFAULT_DETAILS_RATIO)));
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [clampWidth]);

  function startResize(startX: number) {
    setResizing(true);
    const startWidth = currentWidth();
    const onMove = (event: PointerEvent) => setDetailsWidth(clampWidth(startWidth + (event.clientX - startX)));
    const onUp = () => {
      setResizing(false);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-intro`}
      onClose={(event) => { if (!event.currentTarget.open) onClose(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
          event.currentTarget.close();
        }
      }}
    >
      <header className={styles.header}>
        <div>
          <h2 id={`${id}-title`}>{title}</h2>
        </div>
        <div className={styles.headerActions}>
          {headerAction}
          <CloseButton autoFocus label={t.closeDialog} onClick={() => ref.current?.close()} />
        </div>
      </header>
      <div
        ref={bodyRef}
        className={styles.body}
        style={detailsWidth !== null ? ({ "--details-w": `${detailsWidth}px` } as React.CSSProperties) : undefined}
      >
        <div ref={detailsRef} className={styles.details} tabIndex={0} role="region" aria-label={detailsLabel}>
          <p id={`${id}-intro`} className={styles.intro}>{intro}</p>
          {children}
        </div>
        <div
          className={styles.resizer}
          role="separator"
          aria-orientation="vertical"
          aria-label={detailsLabel}
          aria-valuenow={Math.round(currentWidth())}
          data-active={resizing}
          tabIndex={0}
          onPointerDown={(event) => { event.preventDefault(); startResize(event.clientX); }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") { event.preventDefault(); setDetailsWidth(clampWidth(currentWidth() - RESIZE_STEP)); }
            if (event.key === "ArrowRight") { event.preventDefault(); setDetailsWidth(clampWidth(currentWidth() + RESIZE_STEP)); }
          }}
        />
        <section className={styles.canvasSection} aria-label={canvasLabel}>
          <div className={styles.canvas}>{canvas}</div>
        </section>
      </div>
    </dialog>
  );
}
