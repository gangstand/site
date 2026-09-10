"use client";

import { Profile } from "@/widgets/profile";
import { Projects } from "@/widgets/projects";
import { Footer } from "@/widgets/footer";
import { useTranslation } from "@/shared/lib/language";

export function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      <a
        className="fixed top-3 left-3 z-20 -translate-y-[160%] bg-background p-3 focus:translate-y-0"
        href="#main"
      >
        {t.skipToContent}
      </a>
      <main
        id="main"
        className="mx-auto flex min-h-svh w-full max-w-[1200px] flex-col items-center gap-10 px-6 py-8 lg:flex-row lg:items-start lg:justify-center lg:gap-20 lg:px-8 lg:py-0"
      >
        <Profile />
        <section aria-labelledby="projects-heading" className="min-w-0 w-full max-w-[448px] flex flex-col lg:w-[600px] lg:max-w-[600px] lg:flex-none lg:min-h-svh lg:pt-8">
          <h2 id="projects-heading" className="sr-only">{t.projectsHeading}</h2>
          <Projects />
          <Footer />
        </section>
      </main>
    </>
  );
}
