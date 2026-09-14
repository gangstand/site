"use client";

import { useTranslation } from "@/shared/lib/language";

export function LanguageToggle() {
  const { lang, toggleLanguage, t } = useTranslation();

  return (
    <button
      className="absolute right-14 top-0 lg:top-8 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-background text-primary transition-[transform,background-color] duration-100 ease-out hover:bg-border active:scale-[0.98]"
      type="button"
      onClick={toggleLanguage}
      aria-label={t.languageToggleAria}
    >
      <span className="text-xs font-medium uppercase" aria-hidden="true">
        {lang === "ru" ? "EN" : "RU"}
      </span>
    </button>
  );
}
