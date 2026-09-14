"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { translations } from "@/shared/config";
import { setCookie } from "@/shared/lib/cookies";
import { LANG_COOKIE, nextLang, type Lang } from "./locale";

interface LanguageContextValue {
  lang: Lang;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children, initialLang }: { children: ReactNode; initialLang: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang);

  function toggleLanguage() {
    const next = nextLang(lang);
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
