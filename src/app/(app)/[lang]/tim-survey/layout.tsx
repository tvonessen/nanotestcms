import { Barlow, Barlow_Semi_Condensed, Noto_Sans_JP, Noto_Sans_SC } from 'next/font/google';
import type React from 'react';
import '@/styles/survey.css';

// Self-hosted at build time (next/font/google) — privacy-compliant per spec §10.
const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-barlow',
  display: 'swap',
});
const barlowCondensed = Barlow_Semi_Condensed({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-barlow-cond',
  display: 'swap',
});
const notoSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sc',
  display: 'swap',
});
const notoJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-jp',
  display: 'swap',
});

export default function TimSurveyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`tim-survey ${barlow.variable} ${barlowCondensed.variable} ${notoSC.variable} ${notoJP.variable}`}
    >
      {children}
    </div>
  );
}
