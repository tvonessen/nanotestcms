'use client';

import {
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUINavbar,
} from '@heroui/react';
import Link from 'next/link';
import React from 'react';

import { siteConfig } from '@/config/routes';

import NanotestLogo from '../nanotest-logo';
import { ThemeSwitch } from '../theme-switch';

import { LanguageSwitch } from '@/components/language-switch/language-switch';
import { Button } from '@heroui/react';
import { useParams } from 'next/navigation';
import NavLink from './navlink';

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { lang } = useParams();

  const navItems = siteConfig.navItems.map((item) => {
    return { ...item, href: `/${lang}${item.href}` };
  });

  return (
    <NextUINavbar
      isMenuOpen={isOpen}
      className="bg-foreground/80 dark:bg-background/80 backdrop-blur-sm"
      maxWidth="2xl"
    >
      <Link
        aria-label="Go to homepage"
        className="btn btn-link focus-visible:outline-focus px-0 no-animation"
        href={`/${lang}/`}
      >
        <NanotestLogo className="h-10 fill-background dark:fill-foreground hidden md:block" />
        <NanotestLogo
          hideText
          className="h-10 block md:hidden fill-background dark:fill-foreground"
        />
      </Link>
      <NavbarContent as="div" className="gap-1 md:gap-2" justify="end">
        <div className="hidden sm:flex gap-2">
          {navItems.map((item) => (
            <NavLink key={`${item.href}`} link={item} />
          ))}
        </div>
        <ThemeSwitch />
        <LanguageSwitch />
        <Button
          isIconOnly
          aria-label="Open the navigation"
          as={NavbarMenuToggle}
          onPress={() => setIsOpen(!isOpen)}
          className="flex sm:hidden text-background dark:text-foreground"
          variant="light"
        />
      </NavbarContent>

      <NavbarMenu as="div" className="bg-foreground/85 dark:bg-background/85" onClick={() => {}}>
        <div className="mx-4 mt-2 flex flex-col justify-center items-center gap-2">
          {navItems.map((item) => (
            <NavbarMenuItem key={item.href} as="div">
              <NavLink link={item} onClick={() => setIsOpen(false)} />
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
