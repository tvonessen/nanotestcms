import { Fira_Code as FontMono, Titillium_Web as FontSans } from 'next/font/google';

export const fontSans = FontSans({
  subsets: ['latin-ext'],
  style: ['normal', 'italic'],
  weight: ['300', '400', '600', '700'],
  display: 'swap',
  preload: true,
});

export const fontMono = FontMono({
  subsets: ['latin'],
});
