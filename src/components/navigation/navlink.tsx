'use client';
import type { siteConfig } from '@/config/routes';
import type { Config } from '@/payload-types';
import { Button, cn } from '@heroui/react';
import Link from 'next/link';
import { useParams, useSelectedLayoutSegment } from 'next/navigation';
import React from 'react';

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  link: (typeof siteConfig.navItems)[0];
}

export function NavLink({ link, ...props }: NavLinkProps) {
  const [mounted, setMounted] = React.useState(false);
  const currentPath = useSelectedLayoutSegment();
  const { lang } = useParams() as { lang: Config['locale'] };
  const isActive =
    (currentPath === null && link.href === '/') || link.href?.includes(String(currentPath));

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const width = 1025;

  if (!mounted) return null;

  return (
    <Link href={`/${lang}/${link.href}`} scroll={false} passHref {...props}>
      <Button
        aria-labelledby="`nav-${link.label}`"
        variant={isActive ? 'solid' : 'light'}
        color="primary"
        className={cn(
          'animate-none text-xl font-semibold',
          isActive && 'text-foreground dark:text-background',
          !isActive && 'text-background dark:text-foreground',
          width < 1204 && width >= 640 && 'min-w-0 px-3',
        )}
        isIconOnly={width < 1024 && width >= 640}
      >
        <span className="inline lg:hidden">{link.icon}</span>
        <span className="inline sm:hidden lg:inline" id={`nav-${link.label}`}>
          {link.label[lang]}
        </span>
      </Button>
    </Link>
  );
}
