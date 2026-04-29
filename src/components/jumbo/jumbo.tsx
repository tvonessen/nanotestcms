'use client';

import React, { Fragment } from 'react';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Button } from '@heroui/react';
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import { useInterval } from 'usehooks-ts';
import type { CMSLinkData } from '@/components/utility/cms-link';
import { resolveCMSLinkHref } from '@/components/utility/cms-link';
import type { LinkAppearance } from '@/fields/linkField';
import type { Media } from '@/payload-types';

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

const Jumbo = ({ jumbos, className, lang }: JumboProps) => {
  const slider = React.useRef<Slider>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [step, setStep] = React.useState<number>(0);

  const images = jumbos.map((jumbo) => {
    const { image, title, description, link } = jumbo;
    const img = image as Media;
    return {
      url: img.sizes?.large?.url ?? img.url,
      alt: img.alt,
      width: img.sizes?.large?.width ?? img.width,
      height: img.sizes?.large?.height ?? img.height,
      blurDataUrl: img.blurDataUrl,
      isDark: img.isDark,
      title,
      description,
      href: link ? resolveCMSLinkHref(link, lang) : '#',
      linkLabel: link?.label ?? 'Learn More',
      newTabProps: link?.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {},
    };
  });

  useInterval(
    () => {
      setStep((prevStep) => prevStep + 1);
      if (step >= 200) {
        slider.current?.slickNext();
      }
    },
    isPlaying && jumbos.length > 1 ? 50 : null,
  );

  const next = () => {
    slider.current?.slickNext();
    setStep(0);
  };

  const prev = () => {
    slider.current?.slickPrev();
    setStep(0);
  };

  return (
    <Fragment key="jumbo">
      {/** biome-ignore lint/a11y/noStaticElementInteractions: Interactive slideshow */}
      <div
        role="presentation"
        className={`relative 2xl:container mx-auto 2xl:mt-4 2xl:px-16 ${className}`}
        onMouseEnter={() => setIsPlaying(false)}
        onFocus={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
        onBlur={() => setIsPlaying(true)}
      >
        {images.length > 1 && (
          <Fragment key={'controls'}>
            <button
              className="absolute rounded-sm left-1 top-1/2 -translate-y-1/2 z-20 p-6 cursor-pointer"
              type="button"
              onClick={prev}
            >
              <CaretLeftIcon
                className={`${
                  images[currentIndex].isDark
                    ? 'text-white 2xl:text-foreground'
                    : 'text-black 2xl:text-foreground'
                }`}
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
                className={`${
                  images[currentIndex].isDark
                    ? 'text-white 2xl:text-foreground'
                    : 'text-black 2xl:text-foreground'
                }`}
                size={24}
                weight="bold"
              />
            </button>
          </Fragment>
        )}
        <Slider
          beforeChange={(_index, nextIndex) => {
            setCurrentIndex(nextIndex);
          }}
          afterChange={() => setStep(-10)}
          infinite
          fade
          swipe={images.length > 1}
          arrows={false}
          speed={1000}
          easing="ease-in-out"
          lazyLoad="progressive"
          ref={slider}
        >
          {jumbos.map((jumbo) => {
            const image = jumbo.image as Media;
            const link = jumbo.link as CMSLinkData;
            const href = (link.type === 'custom' ? link.url : resolveCMSLinkHref(link, lang)) ?? '';
            return (
              <div key={image.blurDataUrl}>
                <div className="relative focus:outline-hidden -z-10 overflow-hidden 2xl:rounded-2xl">
                  <Image
                    className={'aspect-square lg:aspect-video w-full object-cover'}
                    src={(image.sizes?.large?.url ?? image.url) as string}
                    alt={image.alt}
                    width={(image.sizes?.large?.width ?? image.width) as number}
                    height={(image.sizes?.large?.height ?? image.height) as number}
                    blurDataURL={image.blurDataUrl as string}
                    placeholder={image.blurDataUrl ? 'blur' : 'empty'}
                    sizes="100vw"
                    loading="lazy"
                  />
                  <div className="absolute w-full h-full top-0 left-0 bg-linear-to-b from-75% from-transparent to-background" />
                  <div
                    className="absolute h-0.5 top-0 left-0 bg-primary transition-width duration-75 opacity-60"
                    style={{ width: `${Math.max(step / 2, 0)}%` }}
                  />
                </div>
                <div className="h-full flex flex-col items-center -mt-8 px-4 z-20 gap-6">
                  <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent text-center bg-linear-to-t from-primary-700 dark:from-primary-300 to-foreground dark:to-primary-500 pb-4">
                    {jumbo.title}
                  </h1>
                  <h2 className="text-xl sm:text-2xl text-center text-foreground opacity-90">
                    {jumbo.description}
                  </h2>
                  <Link href={href} passHref target={link.newTab ? '_blank' : '_self'}>
                    <Button
                      color="primary"
                      variant={(link.appearance as LinkAppearance) ?? 'solid'}
                      radius="full"
                      size="lg"
                      className="px-8 mb-2"
                    >
                      {link.label}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </Fragment>
  );
};

export default Jumbo;
