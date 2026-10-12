import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Turn a user-supplied redirect target into a same-origin path.
 *
 * Accepts "app" or "/app?x=1". Anything that could leave the site
 * ("//evil.com", "/\\evil.com", "https://evil.com") returns the fallback.
 */
export function safeRedirectPath(value: string | null | undefined, fallback = '/app'): string {
  if (!value) return fallback;

  const path = value.startsWith('/') ? value : `/${value}`;
  if (path.startsWith('//') || path.includes('\\') || /[\u0000-\u001F\u007F]/.test(path)) {
    return fallback;
  }

  try {
    const base = 'http://same-origin.invalid';
    const url = new URL(path, base);
    if (url.origin !== base) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
