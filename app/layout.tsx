import type { Metadata } from "next";
import { cookies } from "next/headers";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { AppProviders } from "@/_app/providers";
import type { ThemeMode } from "@/shared/lib/theme";
import { translations } from "@/shared/config";
import { parseLang, type Lang } from "@/shared/lib/language";

const SITE_URL = "https://gangstand.tech";

async function getPreferences(): Promise<{ lang: Lang; theme: ThemeMode }> {
  const store = await cookies();
  const lang: Lang = parseLang(store.get("lang")?.value);
  const theme: ThemeMode = store.get("theme")?.value === "light" ? "light" : "dark";
  return { lang, theme };
}

export async function generateMetadata(): Promise<Metadata> {
  const { lang, theme } = await getPreferences();
  const t = translations[lang];

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.pageTitle, template: `%s — ${t.name}` },
    description: t.bio,
    keywords: ["Никита Кульпинов", "Python", "Backend разработчик", "DevOps", "AI", "портфолио"],
    authors: [{ name: translations.ru.name, url: SITE_URL }],
    creator: translations.ru.name,
    icons: { icon: theme === "light" ? "/favicon-light.png" : "/favicon-dark.png" },
    alternates: { canonical: "/" },
    robots: { index: true, follow: true },
    openGraph: {
      type: "profile",
      firstName: "Никита",
      lastName: "Кульпинов",
      title: t.pageTitle,
      description: t.bio,
      url: SITE_URL,
      siteName: translations.ru.name,
      locale: lang === "en" ? "en_US" : "ru_RU",
    },
    twitter: {
      card: "summary_large_image",
      title: t.pageTitle,
      description: t.bio,
    },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { lang, theme } = await getPreferences();

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${theme === "light" ? "light-theme" : "dark-theme"} scroll-smooth scroll-pt-8 motion-reduce:scroll-auto`}
    >
      <body className={`${GeistSans.variable} bg-background text-primary font-sans text-sm leading-[1.4] antialiased`}>
        <AppProviders lang={lang} theme={theme}>{children}</AppProviders>
      </body>
    </html>
  );
}
