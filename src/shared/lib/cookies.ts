export function setCookie(name: string, value: string, days = 365) {
  try {
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch {}
}
