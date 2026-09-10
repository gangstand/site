"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { email } from "@/shared/config/contacts";
import { ContactIcon } from "@/shared/ui/contact-icon";
import { useTranslation } from "@/shared/lib/language";

function legacyCopy(text: string) {
  // A native <dialog> opened via showModal() makes the rest of the document
  // inert, so an element appended to document.body can never receive focus
  // while a dialog is open — the textarea must live inside the open dialog
  // itself for select()/execCommand("copy") to have anything to act on.
  const container = document.querySelector<HTMLElement>("dialog[open]") ?? document.body;
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  container.appendChild(textarea);
  textarea.focus();
  textarea.select();
  const ok = document.execCommand("copy");
  container.removeChild(textarea);
  if (!ok) throw new Error("execCommand copy failed");
}

type CopyStatus = "idle" | "copied" | "error";

interface CopyEmailProps {
  className?: string;
  showAddress?: boolean;
}

export function CopyEmail({ className, showAddress = false }: CopyEmailProps) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<CopyStatus>("idle");
  const wrapRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (status === "idle") return;
    const timeout = window.setTimeout(() => setStatus("idle"), 2500);
    return () => window.clearTimeout(timeout);
  }, [status]);

  const label = status === "copied" ? t.copyEmailCopiedLabel : status === "error" ? t.copyEmailErrorText : t.copyEmailIdleLabel;

  useLayoutEffect(() => {
    if (showAddress) return;
    const wrap = wrapRef.current;
    const text = textRef.current;
    if (!wrap || !text) return;
    wrap.style.width = `${text.getBoundingClientRect().width}px`;
    // Depends on the rendered text itself (label), not just status — a
    // language switch changes the text at the same status and must resize
    // the wrapper too, or the underline below it keeps the old text's width.
  }, [label, showAddress]);

  async function copyEmail() {
    try {
      // navigator.clipboard only exists in a secure context (HTTPS or
      // localhost) — on a plain-HTTP LAN address (e.g. testing from a phone)
      // it is undefined, so fall back to the legacy execCommand technique,
      // which has no such restriction.
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        legacyCopy(email);
      }
      setStatus("copied");
    } catch {
      try {
        legacyCopy(email);
        setStatus("copied");
      } catch {
        setStatus("error");
      }
    }
  }

  if (showAddress) {
    return (
      <button className={className} type="button" onClick={copyEmail} aria-label={t.copyEmailAria}>
        <span className="relative flex h-6 w-6 shrink-0 items-center justify-center opacity-30">
          <span className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${status === "copied" ? "scale-[0.7] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none"}`}>
            <ContactIcon name="Email" />
          </span>
          <span className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${status === "copied" ? "scale-100 opacity-100 blur-none" : "scale-[0.7] opacity-0 blur-[4px]"}`}>
            <ContactIcon name="Copied" />
          </span>
        </span>
        <span className="flex flex-1 flex-col gap-0.5 text-left">
          <span className="text-xs font-normal leading-none text-secondary">{t.copyEmailFieldLabel}</span>
          <span className="text-sm font-normal leading-6 text-primary">{status === "error" ? t.copyEmailErrorText : email}</span>
        </span>
        <span className="sr-only" aria-live="polite">{status === "copied" ? t.copyEmailAnnounceCopied : status === "error" ? t.copyEmailErrorText : ""}</span>
      </button>
    );
  }

  return (
    <button className={className} type="button" onClick={copyEmail} aria-label={t.copyEmailAriaWithAddress(email)}>
      <span ref={wrapRef} className="relative inline-block overflow-hidden align-top transition-[width] duration-300 ease-out" aria-live="polite">
        <span
          ref={textRef}
          key={label}
          className="inline-block whitespace-nowrap transition-[transform,opacity] duration-300 ease-out starting:scale-95 starting:opacity-0"
        >
          {label}
        </span>
      </span>
    </button>
  );
}
