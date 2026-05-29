'use client';

import { HeroUIProvider } from '@heroui/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { SnackbarProvider } from 'notistack';
import type * as React from 'react';
import { getUILocale } from '@/config/locales';

export interface ProvidersProps {
  children?: React.ReactNode;
  lang: string;
}

export function Providers({ children, lang }: ProvidersProps) {
  return (
    <HeroUIProvider locale={getUILocale(lang)}>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
