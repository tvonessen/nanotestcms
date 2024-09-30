'use client';

import React from 'react';
import { useSelectedLayoutSegment } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';
import Link from 'next/link';

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  link: {
    label: string;
    href: string;
    icon: React.ReactNode;
    children?: any[];
  };
}

const NavLink = ({ link, ...props }: NavLinkProps) => {
  const [mounted, setMounted] = React.useState(false);
  const currentPath = useSelectedLayoutSegment();
  const isActive =
    (currentPath === null && link.href === '/') || link.href?.includes(String(currentPath));

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { width } = useWindowSize();

  if (!mounted) return null;

  return (
    <Link
      aria-labelledby="`nav-${link.label}`"
      className="btn btn-ghost data-[icon-only=true]:btn-square text-background dark:text-foreground font-semibold text-xl data-[active=true]:bg-primary-500 data-[active=true]:text-foreground dark:data-[active=true]:text-background"
      data-active={isActive}
      data-icon-only={width < 1024 && width >= 640}
      href={link.href}
      {...props}
    >
      <span className="inline lg:hidden">{link.icon}</span>
      <span className="inline sm:hidden lg:inline" id={`nav-${link.label}`}>
        {link.label}
      </span>
    </Link>
  );
};

export default React.memo(NavLink);
