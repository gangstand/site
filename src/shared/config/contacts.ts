export const email = "ganggstand@gmail.com";

export const socialLinks = [
  { label: "Telegram", handle: "gangstand", href: "https://t.me/gangstand" },
  { label: "GitHub", handle: "gangstand", href: "https://github.com/gangstand" },
  { label: "GitLab", handle: "gangstand", href: "https://gitlab.com/gangstand" },
] as const;

export type SocialLink = (typeof socialLinks)[number];
