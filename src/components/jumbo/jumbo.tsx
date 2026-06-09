'use client';

import { Button } from '@heroui/react';
import type { ComponentType } from 'react';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { CMSLinkData } from '@/components/utility/cms-link';
import { resolveCMSLinkHref } from '@/components/utility/cms-link';
import type { LinkAppearance } from '@/fields/linkField';
import type { Media } from '@/payload-types';
import { resolveAssetURL } from '@/utils/public-url';

export interface JumboSlide {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  blurDataUrl?: string | null;
  isDark?: boolean | null;
  title: string;
  description: string;
  href: string;
  linkLabel?: string | null;
  appearance?: LinkAppearance | null;
  newTab?: boolean | null;
}

interface JumboProps {
  jumbos: {
    title: string;
    description: string;
    image: string | Media;
    link?: CMSLinkData | null;
    id?: string | null;
  }[];
  className?: string;
  lang: string;
}

interface JumboInteractiveProps {
  slides: JumboSlide[];
  className?: string;
}

function JumboStatic({ slides, className }: JumboInteractiveProps) {
  const firstSlide = slides[0];
  if (!firstSlide) return null;

  return (
    <div className={`relative 2xl:container mx-auto 2xl:mt-4 2xl:px-16 ${className}`}>
      <div className="relative focus:outline-hidden -z-10 overflow-hidden 2xl:rounded-2xl">
        <Image
          className={'aspect-square lg:aspect-video w-full max-h-[80dvh] object-cover'}
          src={firstSlide.url}
          alt={firstSlide.alt}
          width={firstSlide.width}
          height={firstSlide.height}
          blurDataURL={firstSlide.blurDataUrl ?? undefined}
          placeholder={firstSlide.blurDataUrl ? 'blur' : 'empty'}
          sizes="100vw"
          loading="eager"
          priority
          fetchPriority="high"
          quality={65}
        />
        <div className="absolute w-full h-full top-0 left-0 bg-linear-to-b from-75% from-transparent to-background" />
      </div>
      <div className="h-full flex flex-col items-center -mt-8 px-4 z-20 gap-6">
        <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent text-center bg-linear-to-t from-primary-700 dark:from-primary-300 to-foreground dark:to-primary-500 pb-4">
          {firstSlide.title}
        </h1>
        <h2 className="text-xl sm:text-2xl text-center text-foreground opacity-90">
          {firstSlide.description}
        </h2>
        {firstSlide.linkLabel && (
          <Link
            href={firstSlide.href}
            passHref
            target={firstSlide.newTab ? '_blank' : '_self'}
            rel={firstSlide.newTab ? 'noopener noreferrer' : undefined}
          >
            <Button
              color="primary"
              variant={firstSlide.appearance ?? 'solid'}
              radius="full"
              size="lg"
              className="px-8 mb-2"
            >
              {firstSlide.linkLabel}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default function Jumbo({ jumbos, className, lang }: JumboProps) {
  const [InteractiveJumbo, setInteractiveJumbo] = React.useState<
    ComponentType<JumboInteractiveProps> | null
  >(null);

  const slides = React.useMemo(() => {
    return jumbos
      .map((jumbo, index) => {
        const { image, title, description, link } = jumbo;
        if (!image || typeof image !== 'object') return null;

        const media = image as Media;
        const url = resolveAssetURL(media.sizes?.large?.url ?? media.url);
        if (!url) return null;

        const width = (media.sizes?.large?.width ?? media.width) as number | null | undefined;
        const height = (media.sizes?.large?.height ?? media.height) as number | null | undefined;
        if (!width || !height) return null;

        return {
          id: jumbo.id ?? media.id ?? `${index}`,
          url,
          alt: media.alt,
          width,
          height,
          blurDataUrl: media.blurDataUrl,
          isDark: media.isDark,
          title,
          description,
          href: link ? resolveCMSLinkHref(link, lang) : '#',
          linkLabel: link?.label,
          appearance: (link?.appearance as LinkAppearance | null | undefined) ?? 'solid',
          newTab: link?.newTab,
        } as JumboSlide;
      })
      .filter((slide): slide is JumboSlide => slide !== null);
  }, [jumbos, lang]);

  React.useEffect(() => {
    let isMounted = true;

    import('./jumbo-interactive').then((module) => {
      if (isMounted) {
        setInteractiveJumbo(() => module.default);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (slides.length === 0) return null;

  if (!InteractiveJumbo) {
    return <JumboStatic slides={slides} className={className} />;
  }

  return <InteractiveJumbo slides={slides} className={className} />;
}
