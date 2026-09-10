"use client";

import { useTranslation } from "@/shared/lib/language";

export function Projects() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      {t.projects.map((project) => (
        <article key={project.url} className="flex flex-col gap-3">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block space-y-3 transition-opacity hover:opacity-80"
          >
            <div
              aria-hidden="true"
              className="relative w-full overflow-hidden rounded-[12px] border border-primary/5 bg-primary/5 aspect-square"
            />
            <h3 className="text-sm font-normal leading-[140%] tracking-[-0.01em] text-primary">{project.name}</h3>
          </a>
          <p className="text-sm font-normal">{project.description}</p>
        </article>
      ))}
    </div>
  );
}
