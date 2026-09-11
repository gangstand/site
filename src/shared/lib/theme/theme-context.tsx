"use client";

import { createContext, use, useCallback, useState, type ReactNode } from "react";
import { setCookie } from "@/shared/lib/cookies";

export type ThemeMode = "light" | "dark";

const THEME_COOKIE = "theme";

interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggleTheme: () => {},
});

export function ThemeProvider({ children, initialTheme }: { children: ReactNode; initialTheme: ThemeMode }) {
  const value = useThemeContextProvider(initialTheme);
  return <ThemeContext value={value}>{children}</ThemeContext>;
}

function useThemeContextProvider(initialTheme: ThemeMode): ThemeContextValue {
  const [theme, setTheme] = useState<ThemeMode>(initialTheme);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    const nextTheme: ThemeMode = theme === "light" ? "dark" : "light";

    root.classList.remove(nextTheme === "light" ? "dark-theme" : "light-theme");
    root.classList.add(nextTheme === "light" ? "light-theme" : "dark-theme");

    const iconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (iconLink) iconLink.href = nextTheme === "light" ? "/favicon-light.png" : "/favicon-dark.png";

    setCookie(THEME_COOKIE, nextTheme);
    setTheme(nextTheme);
  }, [theme]);

  return { theme, toggleTheme };
}

export function useTheme() {
  return use(ThemeContext);
}
