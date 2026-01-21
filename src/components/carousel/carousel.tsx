'use client';

import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import React, { Fragment } from 'react';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import type { Media } from '@/payload-types';
import Image from 'next/image';

interface CarouselProps {
  images: Media[];
  className?: string;
}

const Carousel = ({ images, className }: CarouselProps) => {
  const INITIAL_SLIDE = 0;
  const slider = React.useRef<Slider>(null);
  const [currentIndex, setCurrentIndex] = React.useState(INITIAL_SLIDE);

  const next = () => {
    slider.current?.slickNext();
  };

  const prev = () => {
    slider.current?.slickPrev();
  };

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
            <div className="md:px-2 focus:outline-hidden" key={image.alt}>
              <Image
                key={image.filename}
                className={'sm:rounded-2xl w-full aspect-video object-cover'}
                src={(image.sizes?.large?.url ?? image.url) as string}
                alt={image.alt}
                width={(image.sizes?.large?.width ?? image.width) as number}
                height={(image.sizes?.large?.height ?? image.height) as number}
                blurDataURL={image.blurDataUrl as string}
                placeholder="blur"
                loading="lazy"
              />
            </div>
          ))}
        </Slider>
        {images.length > 1 && (
          <Fragment key="controls">
            <button
              className="absolute rounded-sm left-1 top-1/2 -translate-y-1/2 z-20 p-6"
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
              className="absolute rounded-sm right-1 top-1/2 -translate-y-1/2 z-20 p-6"
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

export default Carousel;
