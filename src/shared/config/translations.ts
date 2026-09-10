export type Lang = "ru" | "en";

export interface EducationEntry {
  dateRange: string;
  institution: string;
  specialty: string;
}

export interface ProjectEntry {
  name: string;
  domain: string;
  url: string;
  description: string;
}

export interface Translation {
  skipToContent: string;
  projectsHeading: string;
  name: string;
  bio: string;
  experienceHeading: string;
  experienceBefore: string;
  experienceCompany: string;
  experienceAfter: string;
  educationHeading: string;
  education: [EducationEntry, EducationEntry];
  projects: ProjectEntry[];
  contactsButton: string;
  contactsHeading: string;
  closeDialog: string;
  copyEmailAria: string;
  copyEmailFieldLabel: string;
  copyEmailErrorText: string;
  copyEmailIdleLabel: string;
  copyEmailCopiedLabel: string;
  copyEmailAnnounceCopied: string;
  copyEmailAriaWithAddress: (email: string) => string;
  themeToDark: string;
  themeToLight: string;
  languageToggleAria: string;
  avatarAlt: string;
}

export const translations: Record<Lang, Translation> = {
  ru: {
    skipToContent: "Перейти к содержимому",
    projectsHeading: "Избранные проекты",

    name: "Никита Кульпинов",
    bio: "Python backend-разработчик с фокусом на DevOps и AI. Победитель более 20 хакатонов.",

    experienceHeading: "Опыт",
    experienceBefore: "Сейчас работаю в ",
    experienceCompany: "Флагман",
    experienceAfter:
      ". Разрабатываю backend-сервисы и автоматизирую процессы и инфраструктуру.",

    educationHeading: "Образование",
    education: [
      {
        dateRange: "2021 — 2025",
        institution: "Ростовский-на-Дону колледж связи и информатики",
        specialty: "Информационные системы и программирование",
      },
      {
        dateRange: "2025 — настоящее время",
        institution: "Ростовский государственный экономический университет",
        specialty: "Программная инженерия",
      },
    ],

    projects: [
      {
        name: "SwapDog",
        domain: "swapdog.ru",
        url: "https://swapdog.ru",
        description:
          "Автоматизирует обмен данными между iiko и операторами ЭДО: накладные и чеки загружаются в iiko без ручного ввода.",
      },
      {
        name: "TeamTasker",
        domain: "teamtasker.ru",
        url: "https://teamtasker.ru",
        description:
          "Объединяет управление задачами, командой и финансами — от личного планирования до сложных бизнес-процессов.",
      },
      {
        name: "ЕСАУЛ",
        domain: "esaul.site",
        url: "https://esaul.site",
        description:
          "Автоматизирует работу линии технической поддержки и объединяет ключевые процессы в единой системе.",
      },
      {
        name: "Синус",
        domain: "app.sine.su",
        url: "https://app.sine.su/",
        description:
          "Транскрибирует речь в текст и автоматически формирует краткое саммари с ключевыми тезисами.",
      },
      {
        name: "SportBox",
        domain: "donwr.ru",
        url: "https://donwr.ru/",
        description:
          "Автоматизирует работу спортивной федерации: ведение реестров, заявок на соревнования и результатов.",
      },
    ],

    contactsButton: "Контакты",
    contactsHeading: "Контакты",
    closeDialog: "Закрыть окно",

    copyEmailAria: "Скопировать email",
    copyEmailFieldLabel: "Email",
    copyEmailErrorText: "Не удалось скопировать",
    copyEmailIdleLabel: "Скопировать email",
    copyEmailCopiedLabel: "Скопировано",
    copyEmailAnnounceCopied: "Email скопирован",
    copyEmailAriaWithAddress: (email) => `Скопировать email ${email}`,

    themeToDark: "Переключить на тёмную тему",
    themeToLight: "Переключить на светлую тему",
    languageToggleAria: "Switch to English",
    avatarAlt: "Анимированный ASCII-портрет",
  },

  en: {
    skipToContent: "Skip to content",
    projectsHeading: "Featured projects",

    name: "Nikita Kulpinov",
    bio: "Python backend developer focused on DevOps and AI. Winner of 20+ hackathons.",

    experienceHeading: "Experience",
    experienceBefore: "Currently working at ",
    experienceCompany: "Flagman",
    experienceAfter:
      ". Building backend services and automating processes and infrastructure.",

    educationHeading: "Education",
    education: [
      {
        dateRange: "2021 — 2025",
        institution:
          "Rostov-on-Don College of Communications and Informatics",
        specialty: "Information Systems and Programming",
      },
      {
        dateRange: "2025 — present",
        institution: "Rostov State University of Economics",
        specialty: "Software Engineering",
      },
    ],

    projects: [
      {
        name: "SwapDog",
        domain: "swapdog.ru",
        url: "https://swapdog.ru",
        description:
          "Automates data exchange between iiko and EDI providers, importing invoices and receipts into iiko without manual entry.",
      },
      {
        name: "TeamTasker",
        domain: "teamtasker.ru",
        url: "https://teamtasker.ru",
        description:
          "Combines task, team, and financial management — from personal planning to complex business workflows.",
      },
      {
        name: "ESAUL",
        domain: "esaul.site",
        url: "https://esaul.site",
        description:
          "Automates technical support operations and brings key support workflows into a single system.",
      },
      {
        name: "Sine",
        domain: "app.sine.su",
        url: "https://app.sine.su/",
        description:
          "Transcribes speech into text and automatically generates concise summaries with key takeaways.",
      },
      {
        name: "SportBox",
        domain: "donwr.ru",
        url: "https://donwr.ru/",
        description:
          "Automates sports federation operations, including registries, competition entries, and results.",
      },
    ],

    contactsButton: "Contacts",
    contactsHeading: "Contacts",
    closeDialog: "Close dialog",

    copyEmailAria: "Copy email",
    copyEmailFieldLabel: "Email",
    copyEmailErrorText: "Failed to copy",
    copyEmailIdleLabel: "Copy email",
    copyEmailCopiedLabel: "Copied",
    copyEmailAnnounceCopied: "Email copied",
    copyEmailAriaWithAddress: (email) => `Copy email ${email}`,

    themeToDark: "Switch to dark theme",
    themeToLight: "Switch to light theme",
    languageToggleAria: "Переключить на русский",
    avatarAlt: "Animated ASCII portrait",
  },
};
