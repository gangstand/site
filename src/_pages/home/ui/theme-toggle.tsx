"use client";

import { flushSync } from "react-dom";
import { useTheme } from "@/shared/lib/theme";
import { useTranslation } from "@/shared/lib/language";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  function handleClick() {
    if (!document.startViewTransition) {
      toggleTheme();
      return;
    }
    document.startViewTransition(() => {
      flushSync(() => {
        toggleTheme();
      });
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={theme === "light" ? t.themeToDark : t.themeToLight}
      className="absolute right-0 top-0 lg:top-8 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-background text-primary transition-[transform,background-color] duration-100 ease-out hover:bg-border active:scale-[0.98]"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <g className="origin-[12px_12px] transition-[transform,opacity] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] [html.light-theme_&]:rotate-90 [html.light-theme_&]:scale-50 [html.light-theme_&]:opacity-0">
          <circle cx="12" cy="12" r="3.5"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>
        </g>
        <g className="origin-[12px_12px] -rotate-[70deg] scale-50 opacity-0 transition-[transform,opacity] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] [html.light-theme_&]:rotate-0 [html.light-theme_&]:scale-100 [html.light-theme_&]:opacity-100">
          <path d="M20 13a8 8 0 0 1-9-9 8 8 0 1 0 9 9Z" />
        </g>
      </svg>
    </button>
  );
}
