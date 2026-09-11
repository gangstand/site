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
  pageTitle: string;
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
    pageTitle: "Никита Кульпинов — Python Backend разработчик",

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
        name: "HomeLab",
        domain: "homelab",
        url: "https://gangstand.tech",
        description: "Личная инфраструктура на гипервизоре.",
      },
      {
        name: "TeamTasker",
        domain: "teamtasker.ru",
        url: "https://teamtasker.ru",
        description: "Управление задачами, командой и финансами в одном приложении.",
      },
      {
        name: "SwapDog",
        domain: "swapdog.ru",
        url: "https://swapdog.ru",
        description: "Автоматический обмен документами между iiko и ЭДО.",
      },
      {
        name: "ЕСАУЛ",
        domain: "esaul.site",
        url: "https://esaul.site",
        description: "Автоматизация технической поддержки и заявок.",
      },
      {
        name: "Синус",
        domain: "app.sine.su",
        url: "https://app.sine.su/",
        description: "Транскрибация речи, создание краткого саммари и пересказа.",
      },
      {
        name: "SwapRat",
        domain: "swaprat.ru",
        url: "https://swaprat.ru/",
        description: "Система контроля и аудита в ресторане.",
      },
      {
        name: "SportBox",
        domain: "donwr.ru",
        url: "https://donwr.ru/",
        description: "Автоматизация работы спортивной федерации.",
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
    avatarAlt: "Портрет Никиты Кульпинова",
  },

  en: {
    skipToContent: "Skip to content",
    projectsHeading: "Featured projects",
    pageTitle: "Nikita Kulpinov — Python Backend developer",

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
        name: "HomeLab",
        domain: "homelab",
        url: "https://gangstand.tech",
        description: "Personal infrastructure on a hypervisor.",
      },
      {
        name: "TeamTasker",
        domain: "teamtasker.ru",
        url: "https://teamtasker.ru",
        description: "Task, team, and finance management in one app.",
      },
      {
        name: "SwapDog",
        domain: "swapdog.ru",
        url: "https://swapdog.ru",
        description: "Automated document exchange between iiko and EDI.",
      },
      {
        name: "ESAUL",
        domain: "esaul.site",
        url: "https://esaul.site",
        description: "Automates technical support and ticket workflows.",
      },
      {
        name: "Sine",
        domain: "app.sine.su",
        url: "https://app.sine.su/",
        description: "Speech transcription, concise summaries, and a recap.",
      },
      {
        name: "SwapRat",
        domain: "swaprat.ru",
        url: "https://swaprat.ru/",
        description: "Restaurant control and audit system.",
      },
      {
        name: "SportBox",
        domain: "donwr.ru",
        url: "https://donwr.ru/",
        description: "Automates sports federation operations.",
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
    avatarAlt: "Portrait of Nikita Kulpinov",
  },
};
