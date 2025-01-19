'use client';

import { Moon, Sun } from '@phosphor-icons/react';
import { useTheme } from 'next-themes';
import React from 'react';

export const ThemeSwitch = () => {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
    if (!theme) {
      setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    } else if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    }
    return () => setMounted(false);
  }, [theme, setTheme]);

  if (!mounted) return null;

  return (
    <button
      type="button"
      aria-label="Toggle website theme"
      className="btn btn-square btn-ghost text-background dark:text-foreground  "
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme !== 'dark' ? <Sun size={27} weight="regular" /> : <Moon size={27} weight="regular" />}
    </button>
  );
};
