'use client';

import { Button, cn, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { CaretDownIcon } from '@phosphor-icons/react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useState } from 'react';
import type { NavItem } from '@/config/siteconfig';
import type { Config } from '@/payload-types';

interface NavDropdownProps {
  item: NavItem;
}

function SolutionLinks({
  solutions,
  lang,
  pathname,
  onNavigate,
  className,
}: {
  solutions: NavItem[];
  lang: Config['locale'];
  pathname: string;
  onNavigate: () => void;
  className?: string;
}) {
  if (!solutions.length) return null;
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {solutions.map((sol) => {
        const isActive = pathname === `/${lang}${sol.href}`;
        return (
          <Link key={sol.href} href={`/${lang}${sol.href}`} onClick={onNavigate}>
            <Button
              size="md"
              radius="md"
              variant="solid"
              color={isActive ? 'primary' : 'default'}
              className={cn('cursor-pointer', !isActive && 'hover:bg-primary/50')}
            >
              {sol.label[lang]}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}

function PageLink({
  item,
  lang,
  pathname,
  className,
  onNavigate,
  children,
}: {
  item: NavItem;
  lang: Config['locale'];
  pathname: string;
  className?: string;
  onNavigate: () => void;
  children?: ReactNode;
}) {
  const router = useRouter();
  const fullHref = `/${lang}${item.href}`;
  const isExact = pathname === fullHref;

  const handleClick = (e: React.MouseEvent) => {
    // Only navigate if the click wasn't on a nested interactive element
    if ((e.target as HTMLElement).closest('a, button')) return;
    e.preventDefault();
    onNavigate();
    router.push(fullHref);
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: wrapper acts as link via router.push to avoid nested <a> tags
    <div
      role="link"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !(e.target as HTMLElement).closest('a, button')) {
          onNavigate();
          router.push(fullHref);
        }
      }}
      className={cn(
        'flex rounded-lg px-3 py-2 flex-col gap-2 cursor-pointer transition-colors',
        isExact
          ? 'bg-primary/75 text-primary-foreground font-semibold'
          : 'bg-default-200/50 hover:bg-default-300/60 dark:bg-default-100/50 dark:hover:bg-default-200/60',
        className,
      )}
    >
      <span className={cn('block rounded-md px-2 py-1')}>{item.label[lang]}</span>
      {children}
    </div>
  );
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
