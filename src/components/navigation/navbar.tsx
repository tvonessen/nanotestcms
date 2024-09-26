'use client';

import React from 'react';
import Link from 'next/link';
import {
  Navbar as NextUINavbar,
  NavbarMenu,
  NavbarMenuItem,
  NavbarContent,
  NavbarMenuToggle,
} from '@nextui-org/react';

import { siteConfig } from '@/config/site';

import NanotestLogo from '../nanotest-logo';
import { ThemeSwitch } from '../theme-switch';

import NavLink from './navlink';
import { Button } from '@nextui-org/react';

export const Navbar = () => {
  return (
    <NextUINavbar
      className="bg-foreground dark:bg-background bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm"
      maxWidth="2xl"
    >
      <NavbarContent as="div">
        <Link
          aria-label="Go to homepage"
          className="btn btn-link focus-visible:outline-focus px-0"
          href="/"
        >
          <NanotestLogo className="h-7 md:h-10 fill-background dark:fill-foreground" />
        </Link>
      </NavbarContent>

      <NavbarContent as="div" className="gap-1 md:gap-2" justify="end">
        <div className="hidden sm:flex gap-2">
          {siteConfig.navItems.map((item) => (
            <NavLink key={item.href} link={item} />
          ))}
        </div>
        <ThemeSwitch />
        <Button
          isIconOnly
          aria-label="Open the navigation"
          as={NavbarMenuToggle}
          className="flex sm:hidden text-background dark:text-foreground"
          variant="light"
        />
      </NavbarContent>

      <NavbarMenu
        as="div"
        className="bg-foreground dark:bg-background bg-opacity-85 dark:bg-opacity-85"
      >
        <div className="mx-4 mt-2 flex flex-col justify-center items-center gap-2">
          {siteConfig.navItems.map((item) => (
            <NavbarMenuItem key={item.href} as="div">
              <NavLink link={item} />
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
