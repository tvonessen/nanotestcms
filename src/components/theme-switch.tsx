'use client';

import { Button } from '@heroui/react';
import { MoonIcon, SunIcon } from '@phosphor-icons/react';
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
    <Button
      isIconOnly
      aria-label="Toggle website theme"
      variant="light"
      color="primary"
      className="text-background dark:text-foreground no-animation"
      onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme !== 'dark' ? (
        <SunIcon size={27} weight="regular" />
      ) : (
        <MoonIcon size={27} weight="regular" />
      )}
    </Button>
  );
};
