import {
  HouseIcon,
  MicroscopeIcon,
  NutIcon,
  TagSimpleIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react/dist/ssr';
import {Config} from "@/payload-types";
import {ReactNode} from "react";

export type SiteConfig = {
  title: string;
  description: string;
  navItems: {
    label: Record<Config['locale'], string>;
    href: string;
    icon: ReactNode;
  }[];
};

export const siteConfig: SiteConfig = {
  title: ' Nanotest Homepage',
  description:
    'Simply measured. Your partner for thermal characterization and reliability testing.',
  navItems: [
    {
      label: {en: 'Home', de: "Start"},
      href: '/',
      icon: <HouseIcon size={27} weight="regular" />,
    },
    {
      label: {en: 'Products', de: 'Produkte'},
      href: '/products',
      icon: <MicroscopeIcon size={27} weight="regular" />,
    },
    {
      label: {en: 'Services', de: 'Services'},
      href: '/services',
      icon: <NutIcon size={27} weight="regular" />,
    },
    {
      label: {en: 'Contact us', de: 'Kontakt'},
      href: '/contact',
      icon: <TagSimpleIcon size={27} weight="regular" />,
    },
    {
      label: {en: 'About', de: 'Über uns'},
      href: '/about',
      icon: <UsersThreeIcon size={27} weight="regular" />,
    },
    // {
    //   label: 'Contact',
    //   href: '/#contact',
    //   icon: <At size={27} weight="regular" />,
    // },
  ],
};
