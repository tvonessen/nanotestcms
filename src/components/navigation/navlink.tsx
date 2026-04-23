'use client';
import { Button, cn } from '@heroui/react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import type { NavItem } from '@/config/siteconfig';
import type { Config } from '@/payload-types';

interface NavLinkProps {
  link: NavItem;
  lang: Config['locale'];
  onClick?: () => void;
  fullWidth?: boolean;
  className?: string;
  isActive?: boolean;
}

export function NavLink({ link, lang, onClick, fullWidth, className, ...props }: NavLinkProps) {
  const currentPath = useSelectedLayoutSegment();
  const isActive =
    props.isActive ||
    (currentPath === null && link.href === '/') ||
    (currentPath !== null && `/${currentPath}` === link.href);

  return (
    <Link href={`/${lang}${link.href}`} className="grow">
      <Button
        onPress={onClick}
        variant={isActive ? 'solid' : 'light'}
        color="primary"
        fullWidth={fullWidth}
        className={cn(
          'animate-none text-xl font-semibold',
          'not-lg:pe-12 not-lg:py-6',
          !isActive && 'not-lg:bg-default/50',
          isActive && 'text-foreground dark:text-background',
          !isActive && 'text-background dark:text-foreground',
          className,
        )}
      >
        {link.label[lang]}
      </Button>
    </Link>
  );
}
