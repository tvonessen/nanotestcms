'use client';

import { HeroUIProvider } from '@heroui/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useRouter } from 'next/navigation';
import { SnackbarProvider } from 'notistack';
import type * as React from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export interface ProvidersProps {
  children?: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? 'NOT DEFINED'}
        >
          <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>
        </GoogleReCaptchaProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
