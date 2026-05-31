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
              DEFAULT: '#574D80',
              foreground: '#f5f8f8',
              '50': '#f5f4fd',
              '100': '#ebe8fe',
              '200': '#d7d2f9',
              '300': '#c1b9eb',
              '400': '#a299cf',
              '500': '#877db4',
              '600': '#6f669a',
              '700': '#5e5685',
              '800': '#4e4670',
              '900': '#433c61',
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
