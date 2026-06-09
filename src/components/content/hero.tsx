'use client';

import { cn } from '@heroui/react';
import Image from 'next/image';
import type { ComponentType } from 'react';
import React, { useMemo } from 'react';
import RichTextWrapper from '@/components/content/richtext-wrapper';
import type { Media } from '@/payload-types';
import { resolveAssetURL } from '@/utils/public-url';

export interface HeroInteractiveProps {
  images: Media[];
  showCaption?: boolean;
  className?: string;
}

interface HeroProps {
  images?: (Media | unknown)[] | null;
  showCaption?: boolean;
  className?: string;
}

function HeroStatic({ images, showCaption = false, className }: HeroInteractiveProps) {
  const firstImage = images[0];
  if (!firstImage) return null;

  return (
    <React.Fragment>
      <section
        className={`w-full max-w-7xl mx-auto mt-6 relative sm:rounded-2xl overflow-hidden ${className}`}
      >
        <div className="relative md:px-2 focus:outline-hidden">
          <Image
            className={'sm:rounded-2xl w-full aspect-video object-cover'}
            src={resolveAssetURL(firstImage.sizes?.large?.url ?? firstImage.url)}
            alt={firstImage.alt}
            width={(firstImage.sizes?.large?.width ?? firstImage.width) as number}
            height={(firstImage.sizes?.large?.height ?? firstImage.height) as number}
            blurDataURL={firstImage.blurDataUrl as string}
            placeholder={firstImage.blurDataUrl ? 'blur' : 'empty'}
            sizes="(max-width: 1280px) 100vw, 1280px"
            loading="eager"
            priority
            fetchPriority="high"
            quality={65}
          />
          {showCaption && firstImage.caption && (
            <div
              className={cn(
                'absolute bottom-2 inset-x-4 rounded-lg',
                'bg-background/70 backdrop-blur-xs opacity-80',
              )}
            >
              <RichTextWrapper text={firstImage.caption} className="mx-auto w-fit *:w-fit" />
            </div>
          )}
        </div>
      </section>
      {images.length > 1 && (
        <ul className="max-w-7xl flex flex-row mt-0 mx-auto justify-center list-none gap-2">
          {images.map((image, i) => (
            <li key={image.id}>
              <span
                data-active={i === 0}
                className="block w-3 h-3 mt-3 mb-1.5 rounded-full bg-foreground/10 data-[active=true]:bg-primary/60"
                aria-hidden
              />
            </li>
          ))}
        </ul>
      )}
    </React.Fragment>
  );
}

export default function Hero(props: HeroProps) {
  const { className, showCaption = false } = props;
  const [InteractiveHero, setInteractiveHero] =
    React.useState<ComponentType<HeroInteractiveProps> | null>(null);

  const images = useMemo(() => {
    if (!props.images) return [] as Media[];
    return props.images.filter((img) => img !== null && typeof img === 'object') as Media[];
  }, [props.images]);

  React.useEffect(() => {
    let isMounted = true;

    import('./hero-interactive').then((module) => {
      if (isMounted) {
        setInteractiveHero(() => module.default);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (images.length === 0) return null;

  if (!InteractiveHero) {
    return <HeroStatic images={images} showCaption={showCaption} className={className} />;
  }
  return <InteractiveHero images={images} showCaption={showCaption} className={className} />;
}
