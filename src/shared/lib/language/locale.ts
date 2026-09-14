export const LANGUAGES = ["ru", "en"] as const;

export type Lang = (typeof LANGUAGES)[number];
export type Localized<T> = Record<Lang, T>;

export const DEFAULT_LANG: Lang = "ru";
export const LANG_COOKIE = "lang";

export function parseLang(value: string | undefined): Lang {
  return value === "en" ? "en" : DEFAULT_LANG;
}

export function nextLang(lang: Lang): Lang {
  return lang === "ru" ? "en" : "ru";
}
