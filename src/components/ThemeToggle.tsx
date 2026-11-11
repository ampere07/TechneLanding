import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { setTheme, useTheme } from '../theme';

/** Switches the site between light and dark. */
export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const theme = useTheme();
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className={`inline-flex items-center justify-center w-10 h-10 rounded-[3px] border border-rule text-ink hover:border-accent hover:text-accent cursor-pointer transition-colors duration-150 ${className}`}
    >
      {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  );
};
