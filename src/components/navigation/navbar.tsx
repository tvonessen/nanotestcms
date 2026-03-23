'use client';

import {
  Accordion,
  AccordionItem,
  Button,
  Chip,
  cn,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUINavbar,
} from '@heroui/react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import React from 'react';
import { LanguageSwitch } from '@/components/language-switch/language-switch';
import type { NavItem } from '@/config/siteconfig';
import type { Config } from '@/payload-types';
import NanotestLogo from '../nanotest-logo';
import { ThemeSwitch } from '../theme-switch';
import { NavDropdown } from './nav-dropdown';
import { NavLink } from './navlink';

interface NavbarProps {
  navItems: NavItem[];
}

function MobileSolutions({
  solutions,
  lang,
  pathname,
  onNavigate,
}: {
  solutions: NavItem[];
  lang: Config['locale'];
  pathname: string;
  onNavigate: () => void;
}) {
  if (!solutions.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-1.5 px-1">
      {solutions.map((sol) => (
        <Link key={sol.href} href={`/${lang}${sol.href}`} onClick={onNavigate}>
          <Chip
            size="sm"
            variant={pathname === `/${lang}${sol.href}` ? 'solid' : 'flat'}
            color="primary"
            className="cursor-pointer"
          >
            {sol.label[lang]}
          </Chip>
        </Link>
      ))}
    </div>
  );
}

export const Navbar = ({ navItems }: NavbarProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { lang } = useParams() as { lang: Config['locale'] };
  const pathname = usePathname();

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
        <NanotestLogo className="h-10 text-background dark:text-foreground hidden md:block" />
        <NanotestLogo
          hideText
          className="h-10 block md:hidden text-background dark:text-foreground"
        />
      </Link>

      {/* Desktop navigation */}
      <NavbarContent as="div" className="gap-1 md:gap-2" justify="end">
        <div className="hidden sm:flex gap-2">
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
          onPress={() => setIsOpen(!isOpen)}
          className="flex sm:hidden text-background dark:text-foreground"
          variant="light"
        />
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu as="div" className="bg-foreground/85 dark:bg-background/85" onClick={() => {}}>
        <div className="mx-4 mt-2 flex flex-col justify-center items-center gap-2">
          {navItems.map((item) =>
            item.children?.length || item.solutions?.length ? (
              <NavbarMenuItem key={item.href} as="div" className="w-full max-w-sm">
                <Accordion isCompact className="px-0">
                  <AccordionItem
                    key={item.href}
                    title={
                      <span className="text-xl font-semibold text-background dark:text-foreground">
                        {item.label[lang]}
                      </span>
                    }
                    classNames={{
                      trigger: 'py-1',
                      content: 'pb-3',
                      indicator: 'text-background dark:text-foreground',
                    }}
                  >
                    {/* Root level box */}
                    <div className="rounded-xl bg-background/10 dark:bg-foreground/10 p-3">
                      <Link
                        href={`/${lang}${item.href}`}
                        onClick={closeMenu}
                        className={cn(
                          'block text-lg font-bold py-2 px-3 rounded-lg',
                          pathname === `/${lang}${item.href}`
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background/10 dark:bg-foreground/10 text-background dark:text-foreground hover:bg-background/20 dark:hover:bg-foreground/20',
                        )}
                      >
                        {item.label[lang]}
                      </Link>
                      <MobileSolutions
                        solutions={item.solutions ?? []}
                        lang={lang}
                        pathname={pathname}
                        onNavigate={closeMenu}
                      />

                      {/* Children */}
                      {(item.children ?? []).length > 0 && (
                        <div className="mt-2 rounded-lg bg-background/10 dark:bg-foreground/10 p-2 flex flex-col gap-1">
                          {(item.children ?? []).map((child) => (
                            <div key={child.href}>
                              <Link
                                href={`/${lang}${child.href}`}
                                onClick={closeMenu}
                                className={cn(
                                  'block text-base py-2 px-3 rounded-lg',
                                  pathname === `/${lang}${child.href}`
                                    ? 'bg-primary text-primary-foreground font-medium'
                                    : 'bg-background/10 dark:bg-foreground/10 text-background/80 dark:text-foreground/80 hover:bg-background/20 dark:hover:bg-foreground/20',
                                )}
                              >
                                {child.label[lang]}
                              </Link>
                              <MobileSolutions
                                solutions={child.solutions ?? []}
                                lang={lang}
                                pathname={pathname}
                                onNavigate={closeMenu}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </AccordionItem>
                </Accordion>
              </NavbarMenuItem>
            ) : (
              <NavbarMenuItem key={item.href} as="div">
                <NavLink link={item} onClick={closeMenu} />
              </NavbarMenuItem>
            ),
          )}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
