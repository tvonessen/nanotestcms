import { House, Microscope, Nut, TagSimple, UsersThree } from '@phosphor-icons/react/dist/ssr';

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  title: ' Nanotest Homepage',
  description:
    'Simply measured. Your partner for thermal characterization and reliability testing.',
  navItems: [
    {
      label: 'Home',
      href: '/',
      icon: <House size={27} weight="regular" />,
    },
    {
      label: 'Solutions',
      href: '/solutions',
      icon: <Microscope size={27} weight="regular" />,
      children: [
        {
          label: 'TIMA',
          href: 'tima',
        },
        {
          label: 'LaTIMA',
          href: 'latima',
        },
        {
          label: 'TOCS',
          href: 'tocs',
        },
      ],
    },
    {
      label: 'Services',
      href: '/services',
      icon: <Nut size={27} weight="regular" />,
    },
    {
      label: 'Distibution',
      href: '/dist',
      icon: <TagSimple size={27} weight="regular" />,
    },
    {
      label: 'About',
      href: '/about',
      icon: <UsersThree size={27} weight="regular" />,
    },
    // {
    //   label: 'Contact',
    //   href: '/#contact',
    //   icon: <At size={27} weight="regular" />,
    // },
  ],
};
