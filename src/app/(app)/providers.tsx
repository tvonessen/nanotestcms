'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { NextUIProvider } from '@nextui-org/react';
import { SnackbarProvider } from 'notistack';

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
