'use client';

import {
  Button,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUINavbar,
} from '@heroui/react';
import { ListIcon } from '@phosphor-icons/react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import { LanguageSwitch } from '@/components/language-switch/language-switch';
import type { NavItem } from '@/config/siteconfig';
import type { Config } from '@/payload-types';
import NanotestLogo from '../nanotest-logo';
import { ThemeSwitch } from '../theme-switch';
import { MobileNavDropdown, NavDropdown } from './nav-dropdown';
import { NavLink } from './navlink';

interface NavbarProps {
  navItems: NavItem[];
}

export const Navbar = ({ navItems }: NavbarProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { lang } = useParams() as { lang: Config['locale'] };
  const pathname = usePathname();

  useEffect(() => {
    function handleResize(e: UIEvent) {
      if (e.target instanceof Window && e.target.innerWidth >= 1024) setIsOpen(false);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  const closeMenu = () => setIsOpen(false);

  return (
    <NextUINavbar
      isMenuOpen={isOpen}
      className="bg-foreground/80 dark:bg-background/80 backdrop-blur-sm"
      maxWidth="2xl"
    >
      <Link
        aria-label="Go to homepage"
        className="focus-visible:outline-focus px-0 animate-none rounded-md outline-offset-4"
        href={`/${lang}/`}
        tabIndex={0}
      >
        <NanotestLogo className="h-8 sm:h-9 md:h-10 text-background dark:text-foreground" />
      </Link>

      {/* Desktop navigation */}
      <NavbarContent as="div" className="gap-1 lg:gap-2" justify="end">
        <div className="hidden lg:flex gap-2">
          {navItems.map((item) =>
            item.children?.length || item.solutions?.length ? (
              <NavDropdown key={item.href} item={item} />
            ) : (
              <NavLink key={item.href} link={item} />
            ),
          )}
        </div>
        <ThemeSwitch />
        <LanguageSwitch />
        <Button
          isIconOnly
          aria-label="Open the navigation"
          as={NavbarMenuToggle}
          icon={<ListIcon size={36} weight="light" />}
          onPress={() => setIsOpen(!isOpen)}
          className="flex lg:hidden text-background dark:text-foreground text-xl ms-2"
          variant="light"
        />
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu as="div" className="bg-foreground/85 dark:bg-background/85" onClick={() => {}}>
        <div className="mx-4 mt-2 mb-12 flex flex-col justify-center items-center gap-2">
          {navItems.map((item) =>
            item.children?.length || item.solutions?.length ? (
              <NavbarMenuItem key={item.href} as="div" className="w-full">
                <MobileNavDropdown
                  item={item}
                  lang={lang}
                  pathname={pathname}
                  onClose={closeMenu}
                />
              </NavbarMenuItem>
            ) : (
              <NavbarMenuItem key={item.href} as="div" className="w-full">
                <NavLink link={item} onClick={closeMenu} fullWidth />
              </NavbarMenuItem>
            ),
          )}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
