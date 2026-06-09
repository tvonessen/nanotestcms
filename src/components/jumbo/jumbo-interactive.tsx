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
import type { JumboSlide } from '@/components/jumbo/jumbo';

interface JumboInteractiveProps {
  slides: JumboSlide[];
  className?: string;
}

const JumboInteractive = ({ slides, className }: JumboInteractiveProps) => {
  const slider = React.useRef<Slider>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [step, setStep] = React.useState<number>(0);

  useInterval(
    () => {
      setStep((prevStep) => prevStep + 1);
      if (step >= 200) {
        slider.current?.slickNext();
      }
    },
    isPlaying && slides.length > 1 ? 50 : null,
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
        {slides.length > 1 && (
          <Fragment key={'controls'}>
            <button
              className="absolute rounded-sm left-1 top-1/2 translate-y-[-200%] lg:translate-y-[-150%] z-20 p-6 cursor-pointer"
              type="button"
              onClick={prev}
            >
              <CaretLeftIcon
                className={`${slides[currentIndex].isDark ? 'text-white 2xl:text-foreground' : 'text-black 2xl:text-foreground'}`}
                size={24}
                weight="bold"
              />
            </button>
            <button
              className="absolute rounded-sm right-1 top-1/2 translate-y-[-200%] lg:translate-y-[-150%] z-20 p-6 cursor-pointer"
              type="button"
              onClick={next}
            >
              <CaretRightIcon
                className={`${slides[currentIndex].isDark ? 'text-white 2xl:text-foreground' : 'text-black 2xl:text-foreground'}`}
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
          swipe={slides.length > 1}
          arrows={false}
          speed={1000}
          easing="ease-in-out"
          lazyLoad="ondemand"
          ref={slider}
        >
          {slides.map((slide, index) => {
            return (
              <div key={slide.id}>
                <div className="relative focus:outline-hidden -z-10 overflow-hidden 2xl:rounded-2xl">
                  <Image
                    className={'aspect-square lg:aspect-video w-full max-h-[80dvh] object-cover'}
                    src={slide.url}
                    alt={slide.alt}
                    width={slide.width}
                    height={slide.height}
                    blurDataURL={slide.blurDataUrl ?? undefined}
                    placeholder={slide.blurDataUrl ? 'blur' : 'empty'}
                    sizes="100vw"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    priority={index === 0}
                    fetchPriority={index === 0 ? 'high' : 'low'}
                    quality={65}
                  />
                  <div className="absolute w-full h-full top-0 left-0 bg-linear-to-b from-75% from-transparent to-background" />
                  <div
                    className="absolute h-0.5 top-0 left-0 bg-primary transition-width duration-75 opacity-60"
                    style={{ width: `${Math.max(step / 2, 0)}%` }}
                  />
                </div>
                <div className="h-full flex flex-col items-center -mt-8 px-4 z-20 gap-6">
                  <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent text-center bg-linear-to-t from-primary-700 dark:from-primary-300 to-foreground dark:to-primary-500 pb-4">
                    {slide.title}
                  </h1>
                  <h2 className="text-xl sm:text-2xl text-center text-foreground opacity-90">
                    {slide.description}
                  </h2>
                  {slide.linkLabel && (
                    <Link
                      href={slide.href}
                      passHref
                      target={slide.newTab ? '_blank' : '_self'}
                      rel={slide.newTab ? 'noopener noreferrer' : undefined}
                    >
                      <Button
                        color="primary"
                        variant={slide.appearance ?? 'solid'}
                        radius="full"
                        size="lg"
                        className="px-8 mb-2"
                      >
                        {slide.linkLabel}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </Fragment>
  );
};

export default JumboInteractive;
