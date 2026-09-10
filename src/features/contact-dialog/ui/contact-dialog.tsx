"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { socialLinks } from "@/shared/config/contacts";
import { ContactIcon } from "@/shared/ui/contact-icon";
import { useTranslation } from "@/shared/lib/language";

const contactRowClass =
  "flex w-full cursor-pointer items-center gap-4 rounded-2xl px-2 pt-[9px] pb-[7px] text-left transition-colors hover:bg-primary/5";

interface ContactDialogProps {
  emailAction: ReactNode;
}

export function ContactDialog({ emailAction }: ContactDialogProps) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const id = useId();

  function openDialog() {
    dialogRef.current?.showModal();
    setOpen(true);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.code !== "KeyC" || event.repeat || event.isComposing || event.defaultPrevented ||
        event.ctrlKey || event.metaKey || event.altKey || event.shiftKey ||
        document.querySelector("dialog[open]") ||
        (event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable]:not([contenteditable='false'])"))
      ) return;

      event.preventDefault();
      dialogRef.current?.showModal();
      setOpen(true);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        className="relative mt-2 flex h-10 w-full cursor-pointer items-center justify-center rounded-[10px] bg-button font-medium text-button-text transition-[transform,background-color,color,opacity] duration-100 ease-out hover:opacity-85 active:scale-[0.99]"
        type="button"
        onClick={openDialog}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={id}
        aria-keyshortcuts="C"
      >
        {t.contactsButton}
        <kbd className="absolute right-2 flex h-6 w-6 items-center justify-center rounded-lg border border-current border-b-[3px] font-sans text-[11px] opacity-30 max-lg:hidden" aria-hidden="true">C</kbd>
      </button>
      <dialog
        ref={dialogRef}
        id={id}
        className="m-auto w-[min(300px,calc(100%-64px))] max-h-[calc(100dvh-48px)] rounded-[20px] border border-border bg-background pt-4 pr-3 pb-3 pl-3 text-primary shadow-lg open:animate-dialog-enter backdrop:bg-black/80"
        aria-labelledby={`${id}-title`}
        onClose={() => { setOpen(false); buttonRef.current?.focus({ preventScroll: true }); }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
            event.currentTarget.close();
          }
        }}
      >
        <div className="flex flex-col gap-2">
          <h2 id={`${id}-title`} className="pl-2 text-sm font-semibold leading-6 tracking-[-0.01em]">{t.contactsHeading}</h2>
          <div className="flex flex-col">
            {emailAction}
            {socialLinks.map((link) => (
              <a className={contactRowClass} key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center opacity-30"><ContactIcon name={link.label} /></span>
                <span className="flex flex-1 flex-col gap-0.5">
                  <span className="text-xs font-normal leading-none text-secondary">{link.label}</span>
                  <span className="text-sm font-normal leading-6 text-primary">{link.handle}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
        <button
          className="absolute right-3 top-3 grid cursor-pointer place-items-center rounded-full bg-primary/5 p-1.5 text-primary/80 transition-colors hover:bg-primary/10"
          type="button"
          aria-label={t.closeDialog}
          onClick={() => dialogRef.current?.close()}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg>
        </button>
      </dialog>
    </>
  );
}
