import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { LanguageProvider } from "@/shared/lib/language";

export const metadata: Metadata = {
  title: "Никита Кульпинов",
  description: "Личный сайт Никиты Кульпинова.",
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
