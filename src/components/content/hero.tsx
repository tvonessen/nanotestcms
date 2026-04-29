'use client';

import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import React, { Fragment, useMemo } from 'react';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { cn } from '@heroui/react';
import Image from 'next/image';
import RichTextWrapper from '@/components/content/richtext-wrapper';
import type { Media } from '@/payload-types';

interface HeroProps {
  images?: (Media | unknown)[] | null;
  showCaption?: boolean;
  className?: string;
}

const Hero = (props: HeroProps) => {
  const { className, showCaption = false } = props;

  const INITIAL_SLIDE = 0;
  const slider = React.useRef<Slider>(null);
  const [currentIndex, setCurrentIndex] = React.useState(INITIAL_SLIDE);

  const images = useMemo(() => {
    if (!props.images) return [] as Media[];
    return props.images.filter((img) => img !== null && typeof img === 'object') as Media[];
  }, [props.images]);

  const next = () => {
    slider.current?.slickNext();
  };

  const prev = () => {
    slider.current?.slickPrev();
  };

  if (images.length === 0) return null;

  return (
    <Fragment key="carousel">
      <section
        className={`w-full max-w-7xl mx-auto mt-6 relative sm:rounded-2xl overflow-hidden ${className}`}
      >
        <Slider
          initialSlide={INITIAL_SLIDE}
          beforeChange={(_index, nextIndex) => setCurrentIndex(nextIndex)}
          infinite={images.length > 1}
          swipe={images.length > 1}
          arrows={false}
          speed={500}
          easing="ease-in-out"
          lazyLoad="progressive"
          ref={slider}
        >
          {images.map((image) => (
            <div className="relative md:px-2 focus:outline-hidden" key={image.alt}>
              <Image
                key={image.filename}
                className={'sm:rounded-2xl w-full aspect-video object-cover'}
                src={image.sizes?.large?.url ?? image.url ?? ''}
                alt={image.alt}
                width={(image.sizes?.large?.width ?? image.width) as number}
                height={(image.sizes?.large?.height ?? image.height) as number}
                blurDataURL={image.blurDataUrl as string}
                placeholder={image.blurDataUrl ? 'blur' : 'empty'}
                sizes="(max-width: 1280px) 100vw, 1280px"
                loading="lazy"
              />
              {showCaption && image.caption && (
                <div
                  className={cn(
                    'absolute bottom-2 inset-x-4 rounded-lg',
                    'bg-background/70 backdrop-blur-xs opacity-80',
                  )}
                >
                  <RichTextWrapper text={image.caption} className="mx-auto w-fit *:w-fit" />
                </div>
              )}
            </div>
          ))}
        </Slider>
        {images.length > 1 && (
          <Fragment key="controls">
            <button
              className="absolute rounded-sm left-1 top-1/2 -translate-y-1/2 z-20 p-6 cursor-pointer"
              type="button"
              onClick={prev}
            >
              <CaretLeftIcon
                className={`${images[currentIndex].isDark ? 'text-white' : 'text-black'}`}
                size={24}
                weight="bold"
              />
            </button>
            <button
              className="absolute rounded-sm right-1 top-1/2 -translate-y-1/2 z-20 p-6 cursor-pointer"
              type="button"
              onClick={next}
            >
              <CaretRightIcon
                className={`${images[currentIndex].isDark ? 'text-white' : 'text-black'}`}
                size={24}
                weight="bold"
              />
            </button>
          </Fragment>
        )}
      </section>
      {images.length > 1 && (
        <ul className="max-w-7xl flex flex-row mt-0 mx-auto px-2 md:px-3 justify-center list-none gap-2">
          {images.map((image, i) => (
            <li key={image.alt}>
              <button
                type="button"
                data-active={i === currentIndex}
                className="w-3 h-3 rounded-full bg-foreground/10 data-[active=true]:bg-primary/60 hover:bg-foreground/35 transition"
                aria-label={`Show image No. ${i}`}
                onClick={() => {
                  slider?.current?.slickGoTo(i);
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </Fragment>
  );
};

export default Hero;
