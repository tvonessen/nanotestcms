import { heroui } from '@heroui/react';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/(app)/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      primary: 'rgb(var(--primary) / <alpha-value>)',
      text: 'rgb(var(--foreground) / <alpha-value>)',
      foreground: 'rgb(var(--foreground) / <alpha-value>)',
      background: 'rgb(var(--background) / <alpha-value>)',
      warn: 'rgb(var(--warn) / <alpha-value>)',
      error: 'rgb(var(--error) / <alpha-value>)',
      transparent: 'transparent',
      current: 'currentColor',
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      addCommonColors: true,
      themes: {
        light: {
          colors: {
            foreground: '#151515',
            background: '#f5f8f8',
            focus: '#fc8450',
            primary: {
              DEFAULT: '#00a984',
              50: '#e6f6f3',
              100: '#cceee6',
              200: '#99ddce',
              300: '#66cbb5',
              400: '#33ba9d',
              500: '#00a984',
              600: '#00876a',
              700: '#00654f',
              800: '#004435',
              900: '#00221a',
            },
            secondary: {
              DEFAULT: '#C25BA2',
              foreground: '#f5f8f8',
              50: '#FCE8EF',
              100: '#F7CFE0',
              200: '#E9A5C8',
              300: '#D77EB4',
              400: '#C25BA2',
              500: '#9B4B89',
              600: '#86326B',
              700: '#69204C',
              800: '#4A122F',
              900: '#270715',
            },
            warning: {
              DEFAULT: '#F3B61F',
              foreground: '#151515',
            },
            danger: {
              DEFAULT: '#f31240',
              foreground: '#f5f8f8',
            },
          },
        },
        dark: {
          colors: {
            foreground: '#f9f9f9',
            background: '#151515',
            focus: '#fc8450',
            primary: {
              DEFAULT: '#00a984',
              50: '#e6f6f3',
              100: '#cceee6',
              200: '#99ddce',
              300: '#66cbb5',
              400: '#33ba9d',
              500: '#00a984',
              600: '#00876a',
              700: '#00654f',
              800: '#004435',
              900: '#00221a',
            },
            secondary: {
              DEFAULT: '#f3b61f',
              foreground: '#151515',
              50: '#fef8e9',
              100: '#fdf0d2',
              200: '#fae2a5',
              300: '#f8d379',
              400: '#f5c54c',
              500: '#f3b61f',
              600: '#c29219',
              700: '#926d13',
              800: '#61490c',
              900: '#312406',
            },
            warning: {
              DEFAULT: '#F3B61F',
              foreground: '#151515',
            },
            danger: {
              DEFAULT: '#ff1a50',
              foreground: '#f5f8f8',
            },
          },
        },
      },
      layout: {
        fontSize: {
          tiny: '0.85rem',
          small: '.95rem',
          medium: '1.2rem',
        },
        radius: {
          small: '0.25rem',
          medium: '0.5rem',
          large: '1rem',
        },
      },
    }),
  ],
};
