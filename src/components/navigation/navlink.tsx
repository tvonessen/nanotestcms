'use client';
import { Button, cn } from '@heroui/react';
import Link from 'next/link';
import { useParams, useSelectedLayoutSegment } from 'next/navigation';
import type { NavItem } from '@/config/siteconfig';
import type { Config } from '@/payload-types';

interface NavLinkProps {
  link: NavItem;
  onClick?: () => void;
}

export function NavLink({ link, onClick }: NavLinkProps) {
  const currentPath = useSelectedLayoutSegment();
  const { lang } = useParams() as { lang: Config['locale'] };
  const isActive =
    (currentPath === null && link.href === '/') ||
    (currentPath !== null && `/${currentPath}` === link.href);

  return (
    <Button
      as={Link}
      href={`/${lang}${link.href}`}
      onPress={onClick}
      variant={isActive ? 'solid' : 'light'}
      color="primary"
      className={cn(
        'animate-none text-xl font-semibold',
        isActive && 'text-foreground dark:text-background',
        !isActive && 'text-background dark:text-foreground',
      )}
    >
      {link.label[lang]}
    </Button>
  );
}
