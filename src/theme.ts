import { useSyncExternalStore } from 'react';

/**
 * Light or dark colours for the whole site. The choice is kept in this browser, and the default is light: the
 * visitor's system setting is not used, so the site is light until they switch it.
 */
export type Theme = 'light' | 'dark';

const KEY = 'techne-theme';
const listeners = new Set<() => void>();

export const getTheme = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

export const setTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // Storage can be blocked. The choice then lasts until the page is closed.
  }
  listeners.forEach((listener) => listener());
};

/** Calls the function whenever the theme changes. Returns a function that stops it. */
export const subscribeTheme = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useTheme = (): Theme => useSyncExternalStore(subscribeTheme, getTheme, () => 'light');
