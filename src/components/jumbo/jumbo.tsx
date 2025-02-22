'use client';

import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import React, { Fragment } from 'react';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import type { Media } from '@/payload-types';
import Image from 'next/image';
import Link from 'next/link';
import { useInterval } from 'usehooks-ts';

interface JumboProps {
  jumbos: {
    title: string;
    description: string;
    image: string | Media;
    link: string;
    linkLabel?: string | null;
    id?: string | null;
  }[];
  className?: string;
}

const Jumbo = ({ jumbos, className }: JumboProps) => {
  const slider = React.useRef<Slider>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [step, setStep] = React.useState<number>(0);

  const images = jumbos.map((jumbo) => {
    const { image, title, description, link, linkLabel } = jumbo;
    const img = image as Media;
    return {
      url: img.url,
      alt: img.alt,
      width: img.width,
      height: img.height,
      blurDataUrl: img.blurDataUrl,
      isDark: img.isDark,
      title,
      description,
      link,
      linkLabel,
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
      <div
        className={`relative 2xl:container mx-auto 2xl:mt-4 2xl:px-16 ${className}`}
        onMouseEnter={() => setIsPlaying(false)}
        onFocus={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
        onBlur={() => setIsPlaying(true)}
      >
        {images.length > 1 && (
          <Fragment key={'controls'}>
            <button
              className="absolute rounded left-1 top-1/2 -translate-y-1/2 z-20 p-6"
              type="button"
              onClick={prev}
            >
              <CaretLeft
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
              className="absolute rounded right-1 top-1/2 -translate-y-1/2 z-20 p-6"
              type="button"
              onClick={next}
            >
              <CaretRight
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
          {images.map((image) => (
            <div key={image.blurDataUrl}>
              <div className="relative focus:outline-none -z-10 overflow-hidden 2xl:rounded-2xl">
                <Image
                  className={'aspect-square lg:aspect-video w-full object-cover'}
                  src={image.url as string}
                  alt={image.alt}
                  width={image.width as number}
                  height={image.height as number}
                  blurDataURL={image.blurDataUrl as string}
                  placeholder="blur"
                  loading="lazy"
                />
                <div className="absolute w-full h-full top-0 left-0 bg-gradient-to-b from-transparent from-75% to-background" />
                <div
                  className="absolute h-0.5 top-0 left-0 bg-primary transition-width duration-75 opacity-60"
                  style={{ width: `${Math.max(step / 2, 0)}%` }}
                />
              </div>
              <div className="h-full flex flex-col items-center -mt-8 px-4 z-20 gap-6">
                <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent text-center bg-gradient-to-t from-primary-700 dark:from-primary-300 to-foreground dark:to-primary-500 pb-4">
                  {image.title}
                </h1>
                <h2 className="text-xl sm:text-2xl text-center text-foreground opacity-90">
                  {image.description}
                </h2>
                <Link
                  tabIndex={0}
                  href={image.link}
                  className="btn btn-primary rounded-full text-lg text-background px-8 mb-2"
                >
                  {image.linkLabel || 'Learn More'}
                </Link>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </Fragment>
  );
};

export default Jumbo;
