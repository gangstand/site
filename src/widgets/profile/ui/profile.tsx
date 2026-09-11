"use client";

import { ThemeToggle } from "@/features/theme-toggle";
import { LanguageToggle } from "@/features/language-toggle";
import { ContactDialog } from "@/features/contact-dialog";
import { CopyEmail } from "@/features/copy-email";
import { useTranslation } from "@/shared/lib/language";
import { useTheme } from "@/shared/lib/theme";

export function Profile() {
  const { t } = useTranslation();
  const { avatarEasterEgg } = useTheme();
  const [college, university] = t.education;

  return (
    <aside className="relative w-full max-w-[448px] lg:sticky lg:top-0 lg:w-[300px] lg:max-w-none lg:flex-none lg:self-start lg:py-8 lg:pb-[60px]">
      <ThemeToggle />
      <LanguageToggle />
      <div className="avatar-mask relative mt-12 mb-4 h-[338px] w-[298px] mx-auto overflow-hidden rounded-[8px] bg-background lg:mt-20 lg:mx-0 lg:h-[169px] lg:w-[149px]">
        {avatarEasterEgg ? (
          <img
            src="/avatar-easter-egg.webp"
            alt={t.avatarEasterEggAlt}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <>
            <img
              src="/avatar-dark.webp"
              alt={t.avatarAlt}
              className="theme-avatar-dark absolute inset-0 h-full w-full object-cover"
            />
            <img
              src="/avatar-white.webp"
              alt=""
              aria-hidden="true"
              className="theme-avatar-light absolute inset-0 h-full w-full object-cover"
            />
          </>
        )}
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-secondary">{t.name}</p>
          <h1 className="text-sm font-normal">{t.bio}</h1>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-medium text-secondary">{t.experienceHeading}</h2>
          <p className="text-sm font-normal">
            {t.experienceBefore}
            <a href="https://flagman-it.ru/" target="_blank" rel="noopener noreferrer" className="border-b border-border-strong pb-px transition-colors hover:text-secondary">
              {t.experienceCompany}
            </a>
            {t.experienceAfter}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-medium text-secondary">{t.educationHeading}</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-normal">
                <a href="https://www.rksi.ru/" target="_blank" rel="noopener noreferrer" className="border-b border-border-strong pb-px transition-colors hover:text-secondary">
                  {college.institution}
                </a>
              </p>
              <p className="text-xs text-secondary">{college.specialty}</p>
              <p className="text-xs text-secondary">{college.dateRange}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-normal">
                <a href="https://rsue.ru/" target="_blank" rel="noopener noreferrer" className="border-b border-border-strong pb-px transition-colors hover:text-secondary">
                  {university.institution}
                </a>
              </p>
              <p className="text-xs text-secondary">{university.specialty}</p>
              <p className="text-xs text-secondary">{university.dateRange}</p>
            </div>
          </div>
        </div>
        <ContactDialog
          emailAction={
            <CopyEmail
              className="flex w-full cursor-pointer items-center gap-4 rounded-2xl px-2 pt-[9px] pb-[7px] text-left transition-colors hover:bg-primary/5"
              showAddress
            />
          }
        />
      </div>
    </aside>
  );
}
