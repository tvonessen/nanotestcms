'use client';

import { Button, cn } from '@heroui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import type { NavItem } from '@/config/siteconfig';
import type { Config } from '@/payload-types';

export function SolutionLinks({
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
    <div className={cn('flex flex-wrap gap-3 p-1', className)}>
      {solutions.map((sol) => {
        const solHref = `/${lang}${sol.href}`;
        const isActive = pathname === solHref || pathname.startsWith(`${solHref}/`);
        return (
          <Button
            key={sol.href}
            href={`/${lang}${sol.href}`}
            onNavigate={onNavigate}
            as={Link}
            size="md"
            radius="md"
            variant="solid"
            color={isActive ? 'primary' : 'default'}
            className={cn('cursor-pointer', !isActive && 'hover:bg-primary/50')}
          >
            {sol.label[lang]}
          </Button>
        );
      })}
    </div>
  );
}

export function PageLink({
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
  const isActive = pathname === fullHref || pathname.startsWith(`${fullHref}/`);

  const handleClick = (e: React.MouseEvent) => {
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
        'flex rounded-lg px-2 py-1 flex-col cursor-pointer transition-colors',
        isActive
          ? 'bg-primary/75 text-primary-foreground font-semibold'
          : 'bg-default-200/50 hover:bg-default-300/60 dark:bg-default-100/50 dark:hover:bg-default-200/60',
        className,
      )}
    >
      <span className="block rounded-md px-2 py-1">{item.label[lang]}</span>
      {children}
    </div>
  );
}
