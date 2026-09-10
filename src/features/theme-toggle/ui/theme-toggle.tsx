"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { useTranslation } from "@/shared/lib/language";

export function ThemeToggle() {
  const { t } = useTranslation();
  const [light, setLight] = useState(false);
  const transitioning = useRef(false);

  useEffect(() => {
    setLight(document.documentElement.dataset.theme === "light");
  }, []);

  function toggleTheme(event: MouseEvent<HTMLButtonElement>) {
    if (transitioning.current) return;

    const root = document.documentElement;
    const next = root.dataset.theme !== "light";
    const updateTheme = () => {
      root.dataset.theme = next ? "light" : "dark";
      try {
        localStorage.setItem("theme", root.dataset.theme);
      } catch {
        // Theme switching must still work when browser storage is unavailable.
      }
      // Commit the React icon together with the theme before the new snapshot.
      flushSync(() => setLight(next));
    };

    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      updateTheme();
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    // clientWidth/Height (layout viewport) rather than innerWidth/Height (visual
    // viewport): on mobile the latter shrinks/grows as the address bar shows or
    // hides, which could leave the circle short of covering the real screen.
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const radius = Math.ceil(Math.hypot(Math.max(x, viewportWidth - x), Math.max(y, viewportHeight - y)));

    root.style.setProperty("--theme-x", `${x}px`);
    root.style.setProperty("--theme-y", `${y}px`);
    root.style.setProperty("--theme-radius", `${radius}px`);

    transitioning.current = true;
    const transition = document.startViewTransition(updateTheme);
    transition.finished.finally(() => {
      transitioning.current = false;
      root.style.removeProperty("--theme-x");
      root.style.removeProperty("--theme-y");
      root.style.removeProperty("--theme-radius");
    });
  }

  return (
    <button
      className="absolute right-0 top-0 lg:top-8 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-background text-primary transition-[transform,background-color] duration-100 ease-out hover:bg-border active:scale-[0.98]"
      type="button"
      onClick={toggleTheme}
      aria-label={light ? t.themeToDark : t.themeToLight}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <g className="origin-[12px_12px] transition-[transform,opacity] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] [html[data-theme=light]_&]:rotate-90 [html[data-theme=light]_&]:scale-50 [html[data-theme=light]_&]:opacity-0">
          <circle cx="12" cy="12" r="3.5"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>
        </g>
        <g className="origin-[12px_12px] -rotate-[70deg] scale-50 opacity-0 transition-[transform,opacity] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] [html[data-theme=light]_&]:rotate-0 [html[data-theme=light]_&]:scale-100 [html[data-theme=light]_&]:opacity-100">
          <path d="M20 13a8 8 0 0 1-9-9 8 8 0 1 0 9 9Z" />
        </g>
      </svg>
    </button>
  );
}
