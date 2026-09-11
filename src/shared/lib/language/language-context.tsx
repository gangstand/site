"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { translations, type Lang } from "@/shared/config/translations";
import { setCookie } from "@/shared/lib/cookies";

const LANG_COOKIE = "lang";

interface LanguageContextValue {
  lang: Lang;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children, initialLang }: { children: ReactNode; initialLang: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang);

  function toggleLanguage() {
    const next: Lang = lang === "ru" ? "en" : "ru";
    document.documentElement.lang = next;
    document.title = translations[next].pageTitle;
    setCookie(LANG_COOKIE, next);
    setLang(next);
  }

  return <LanguageContext.Provider value={{ lang, toggleLanguage }}>{children}</LanguageContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslation must be used within LanguageProvider");
  return { t: translations[ctx.lang], lang: ctx.lang, toggleLanguage: ctx.toggleLanguage };
}
