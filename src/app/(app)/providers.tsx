'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useRouter } from 'next/navigation';
import { SnackbarProvider } from 'notistack';
import type * as React from 'react';

export interface ProvidersProps {
  children?: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
