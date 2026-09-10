"use client";

import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from "react";
import { translations, type Lang } from "@/shared/config/translations";

interface LanguageContextValue {
  lang: Lang;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ru");

  useLayoutEffect(() => {
    // The inline bootstrap script in <head> already applies a saved language
    // preference to <html> before hydration — read it back here, synchronously
    // and before paint, so a returning English-preferring visitor never sees
    // a flash of the Russian default (which the server always renders, since
    // this is a static export with no per-request personalization).
    if (document.documentElement.dataset.lang === "en") setLang("en");
  }, []);

  function toggleLanguage() {
    const next: Lang = lang === "ru" ? "en" : "ru";
    document.documentElement.dataset.lang = next;
    document.documentElement.lang = next;
    try {
      localStorage.setItem("lang", next);
    } catch {
      // Language switching must still work when browser storage is unavailable.
    }
    setLang(next);
  }

  return <LanguageContext.Provider value={{ lang, toggleLanguage }}>{children}</LanguageContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslation must be used within LanguageProvider");
  return { t: translations[ctx.lang], lang: ctx.lang, toggleLanguage: ctx.toggleLanguage };
}
