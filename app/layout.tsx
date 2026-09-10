import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { LanguageProvider } from "@/shared/lib/language";
import { translations } from "@/shared/config/translations";

const SITE_URL = "https://gangstand.tech";
const title = `${translations.ru.name} — Python Backend разработчик`;
const description = translations.ru.bio;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s — ${translations.ru.name}` },
  description,
  keywords: ["Никита Кульпинов", "Python", "Backend разработчик", "DevOps", "AI", "портфолио"],
  authors: [{ name: translations.ru.name, url: SITE_URL }],
  creator: translations.ru.name,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "profile",
    firstName: "Никита",
    lastName: "Кульпинов",
    title,
    description,
    url: SITE_URL,
    siteName: translations.ru.name,
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" suppressHydrationWarning className="scroll-smooth scroll-pt-8 motion-reduce:scroll-auto">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var theme=localStorage.getItem('theme');if(theme==='light'||theme==='dark')document.documentElement.dataset.theme=theme;var lang=localStorage.getItem('lang');if(lang==='en'){document.documentElement.dataset.lang=lang;document.documentElement.lang=lang}}catch{}` }} />
      </head>
      <body className={`${GeistSans.variable} bg-background text-primary font-sans text-sm leading-[1.4] antialiased`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
