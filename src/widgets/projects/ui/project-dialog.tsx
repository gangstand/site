"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { useTranslation } from "@/shared/lib/language";
import styles from "./project-dialog.module.css";

interface ProjectDialogProps {
  title: string;
  category: string;
  intro: string;
  detailsLabel: string;
  canvasLabel: string;
  children: ReactNode;
  canvas: ReactNode;
  headerAction?: ReactNode;
  onClose: () => void;
}

export function ProjectDialog({ title, category, intro, detailsLabel, canvasLabel, children, canvas, headerAction, onClose }: ProjectDialogProps) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();

  useEffect(() => {
    const dialog = ref.current!;
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, []);

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
          <p className={styles.eyebrow}>{category}</p>
          <h2 id={`${id}-title`}>{title}</h2>
        </div>
        <div className={styles.headerActions}>
          {headerAction}
          <button autoFocus type="button" className={styles.close} aria-label={t.closeDialog} onClick={() => ref.current?.close()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg>
          </button>
        </div>
      </header>
      <div className={styles.body}>
        <div className={styles.details} tabIndex={0} role="region" aria-label={detailsLabel}>
          <p id={`${id}-intro`} className={styles.intro}>{intro}</p>
          {children}
        </div>
        <section className={styles.canvasSection} aria-label={canvasLabel}>
          <div className={styles.canvas}>{canvas}</div>
        </section>
      </div>
    </dialog>
  );
}
