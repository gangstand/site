"use client";

import type { ReactNode } from "react";
import { LanguageProvider, type Lang } from "@/shared/lib/language";
import { ThemeProvider, type ThemeMode } from "@/shared/lib/theme";

export function AppProviders({ children, lang, theme }: { children: ReactNode; lang: Lang; theme: ThemeMode }) {
  return (
    <ThemeProvider initialTheme={theme}>
      <LanguageProvider initialLang={lang}>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
