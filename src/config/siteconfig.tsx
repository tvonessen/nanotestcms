import type { ReactNode } from 'react';
import type { Config } from '@/payload-types';

export type NavItem = {
  label: Record<Config['locale'], string>;
  href: string;
  icon?: ReactNode;
  children: NavItem[];
  solutions: NavItem[];
};

export type SiteConfig = {
  title: string;
  description: string;
};

export const siteConfig: SiteConfig = {
  title: ' Nanotest Homepage',
  description:
    'Simply measured. Your partner for thermal characterization and reliability testing.',
};
