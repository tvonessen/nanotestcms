'use client';

import { type MouseEvent, type PointerEvent, type PropsWithChildren, useRef } from 'react';

interface CardInteractionWrapperProps extends PropsWithChildren {
  className?: string;
  href: string;
}

export function CardInteractionWrapper(props: CardInteractionWrapperProps) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  function handleFocus() {
    (ref.current?.firstElementChild as HTMLDivElement).focus();
    ref.current?.setAttribute('data-focus-within', 'true');
  }

  function handleBlur() {
    (ref.current?.firstElementChild as HTMLDivElement).blur();
    ref.current?.setAttribute('data-focus-within', 'false');
  }

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (ref.current?.getAttribute('data-focus-within') !== 'true') {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  return (
    <a
      ref={ref}
      href={props.href}
      data-focus-within="false"
      onPointerEnter={(e: PointerEvent<HTMLAnchorElement>) => {
        if (e.pointerType === 'mouse') handleFocus();
      }}
      onPointerDown={(e: PointerEvent<HTMLAnchorElement>) => {
        if (e.pointerType !== 'mouse') {
          e.currentTarget.addEventListener('pointerup', () => setTimeout(() => handleFocus(), 100));
        }
      }}
      onMouseLeave={handleBlur}
      onBlur={handleBlur}
      onClick={handleClick}
    >
      {props.children}
    </a>
  );
}
