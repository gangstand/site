"use client";

import { createContext, use, useCallback, useRef, useState, type ReactNode } from "react";
import { setCookie } from "@/shared/lib/cookies";

export type ThemeMode = "light" | "dark";

const THEME_COOKIE = "theme";
const EASTER_EGG_CLICK_COUNT = 10;

interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  avatarEasterEgg: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggleTheme: () => {},
  avatarEasterEgg: false,
});

export function ThemeProvider({ children, initialTheme }: { children: ReactNode; initialTheme: ThemeMode }) {
  const value = useThemeContextProvider(initialTheme);
  return <ThemeContext value={value}>{children}</ThemeContext>;
}

function useThemeContextProvider(initialTheme: ThemeMode): ThemeContextValue {
  const [theme, setTheme] = useState<ThemeMode>(initialTheme);
  const [avatarEasterEgg, setAvatarEasterEgg] = useState(false);
  const clickCountRef = useRef(0);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    const nextTheme: ThemeMode = theme === "light" ? "dark" : "light";

    root.classList.remove(nextTheme === "light" ? "dark-theme" : "light-theme");
    root.classList.add(nextTheme === "light" ? "light-theme" : "dark-theme");

    const iconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (iconLink) iconLink.href = nextTheme === "light" ? "/favicon-light.png" : "/favicon-dark.png";

    setCookie(THEME_COOKIE, nextTheme);
    setTheme(nextTheme);

    if (nextTheme === "light") {
      setAvatarEasterEgg(false);
    }

    clickCountRef.current += 1;
    if (clickCountRef.current >= EASTER_EGG_CLICK_COUNT) {
      clickCountRef.current = 0;
      if (nextTheme === "dark") setAvatarEasterEgg(true);
    }
  }, [theme]);

  return { theme, toggleTheme, avatarEasterEgg };
}

export function useTheme() {
  return use(ThemeContext);
}
