'use client';

import { Button, cn, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { CaretDownIcon } from '@phosphor-icons/react';
import { useParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import { NavLink } from '@/components/navigation/navlink';
import type { NavItem } from '@/config/siteconfig';
import type { Config } from '@/payload-types';
import { PageLink, SolutionLinks } from './nav-items';

interface MobileNavDropdownProps {
  item: NavItem;
  lang: Config['locale'];
  pathname: string;
  onClose: () => void;
}

export function MobileNavDropdown({ item, lang, pathname, onClose }: MobileNavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive =
    pathname === `/${lang}${item.href}` || pathname.startsWith(`/${lang}${item.href}/`);
  const children = item.children ?? [];

  const close = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center w-full">
        <NavLink
          link={item}
          onClick={close}
          fullWidth
          className="me-0.5 rounded-e-none ps-18"
          isActive={isActive}
        />
        <Button
          isIconOnly
          variant={isActive || isOpen ? 'solid' : 'light'}
          color="primary"
          onPress={() => setIsOpen((prev) => !prev)}
          className={cn(
            'animate-none rounded-s-none h-12 w-16',
            (isActive || isOpen) && 'text-foreground dark:text-background',
            !isActive && !isOpen && 'text-background dark:text-foreground',
            !isActive && !isOpen && 'not-lg:bg-default/50',
          )}
        >
          <CaretDownIcon
            size={16}
            weight="bold"
            className={cn('transition-transform duration-200', isOpen && 'rotate-180')}
          />
        </Button>
      </div>
      {isOpen && (
        <div className="p-1 pb-2 mt-2 border-2 border-primary/50 rounded-xl flex flex-col gap-2">
          {children.map((child) => (
            <PageLink
              key={child.href}
              item={child}
              lang={lang}
              pathname={pathname}
              onNavigate={close}
              className="font-bold text-medium"
            >
              <SolutionLinks
                solutions={child.solutions ?? []}
                lang={lang}
                pathname={pathname}
                onNavigate={close}
                className="-ms-1"
              />
            </PageLink>
          ))}
          {item.solutions?.map((solution) => (
            <PageLink
              key={solution.href}
              lang={lang}
              pathname={pathname}
              onNavigate={close}
              item={solution}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface NavDropdownProps {
  item: NavItem;
}

export function NavDropdown({ item }: NavDropdownProps) {
  const pathname = usePathname();
  const { lang } = useParams() as { lang: Config['locale'] };
  const [isOpen, setIsOpen] = useState(false);

  const isActive =
    pathname === `/${lang}${item.href}` || pathname.startsWith(`/${lang}${item.href}/`);

  const children = item.children ?? [];

  const close = () => setIsOpen(false);

  return (
    <div className="flex items-center">
      <NavLink
        link={item}
        onClick={close}
        className="me-px rounded-e-none pe-2"
        isActive={isActive}
      />
      <Popover
        placement="bottom-start"
        offset={12}
        crossOffset={-130}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <PopoverTrigger>
          <Button
            isIconOnly
            variant={isActive || isOpen ? 'solid' : 'light'}
            color="primary"
            className={cn(
              'animate-none text-xl font-semibold rounded-s-none',
              (isActive || isOpen) && 'text-foreground dark:text-background',
              !isActive && !isOpen && 'text-background dark:text-foreground',
            )}
          >
            <CaretDownIcon size={14} weight="bold" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 max-w-md">
          <nav className="flex flex-col gap-1 w-full p-1">
            <div className="p-1 bg-default-50 dark:bg-default-50 rounded-xl flex flex-col gap-2">
              {children.map((child) => (
                <PageLink
                  key={child.href}
                  item={child}
                  lang={lang}
                  pathname={pathname}
                  onNavigate={close}
                  className="font-semibold text-medium"
                >
                  <SolutionLinks
                    solutions={child.solutions ?? []}
                    lang={lang}
                    pathname={pathname}
                    onNavigate={close}
                    className="-ms-1"
                  />
                </PageLink>
              ))}

              {item.solutions?.map((solution) => (
                <PageLink
                  key={solution.href}
                  lang={lang}
                  pathname={pathname}
                  onNavigate={close}
                  className="font-semibold text-medium"
                  item={solution}
                />
              ))}
            </div>
          </nav>
        </PopoverContent>
      </Popover>
    </div>
  );
}
