import {
  HouseIcon,
  MicroscopeIcon,
  NutIcon,
  TagSimpleIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react/dist/ssr';

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  title: ' Nanotest Homepage',
  description:
    'Simply measured. Your partner for thermal characterization and reliability testing.',
  navItems: [
    {
      label: 'Home',
      href: '/',
      icon: <HouseIcon size={27} weight="regular" />,
    },
    {
      label: 'Products',
      href: '/products',
      icon: <MicroscopeIcon size={27} weight="regular" />,
    },
    {
      label: 'Services',
      href: '/services',
      icon: <NutIcon size={27} weight="regular" />,
    },
    {
      label: 'Contact us',
      href: '/contact',
      icon: <TagSimpleIcon size={27} weight="regular" />,
    },
    {
      label: 'About',
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
