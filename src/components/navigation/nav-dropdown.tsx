'use client';

import { Button, cn, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { CaretDownIcon } from '@phosphor-icons/react';
import { useParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import type { NavItem } from '@/config/siteconfig';
import type { Config } from '@/payload-types';
import { PageLink, SolutionLinks } from './nav-items';

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
    <Popover placement="bottom-start" offset={12} isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button
          variant={isActive ? 'solid' : 'light'}
          color="primary"
          className={cn(
            'animate-none text-xl font-semibold',
            isActive && 'text-foreground dark:text-background',
            !isActive && 'text-background dark:text-foreground',
          )}
          endContent={<CaretDownIcon size={14} weight="bold" />}
        >
          {item.label[lang]}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 max-w-md">
        <nav className="flex flex-col gap-1 w-full p-1">
          <div className="p-1 bg-default-50 dark:bg-default-50 rounded-xl flex flex-col gap-2">
            <PageLink
              item={item}
              lang={lang}
              pathname={pathname}
              className="font-bold text-medium"
              onNavigate={close}
            />

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

            <SolutionLinks
              solutions={item.solutions ?? []}
              lang={lang}
              pathname={pathname}
              onNavigate={close}
            />
          </div>
        </nav>
      </PopoverContent>
    </Popover>
  );
}
