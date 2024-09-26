'use client';

import { image } from '@nextui-org/react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { div } from 'framer-motion/client';
import Image from 'next/image';
import React from 'react';

interface CarouselProps {
  images: {
    src: string;
    alt: string;
    width: number;
    height: number;
    blurDataUrl: string;
    isDark: boolean;
  }[];
  className?: string;
}

const Carousel = ({ images, className }: CarouselProps) => {
  const [index, setIndex] = React.useState(0);

  const next = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const height = React.useMemo(
    () => images.reduce((prev, img) => Math.max(prev, img.height), 0),
    [images],
  );

  return (
    <>
      <div
        className={`w-full max-w-7xl mx-auto mt-6 relative sm:rounded-2xl overflow-hidden ${className}`}
      >
        <Image
          className="w-full aspect-video object-cover"
          src={images[index].src}
          alt={images[index].alt}
          width={images[index].width}
          height={height}
          blurDataURL={images[index].blurDataUrl}
          loading="lazy"
        />
        <div
          className={`absolute w-[calc(100%_-_16px)] rounded-lg sm:rounded-xl ${images[index].isDark ? 'bg-black text-white' : 'bg-white text-black font-medium'} bg-opacity-30 p-2 bottom-2 backdrop-blur left-2 text-center`}
        >
          <p className="max-w-full">{images[index].alt}</p>
        </div>
        {images.length > 1 && (
          <>
            <button
              className="absolute rounded left-2 top-1/2 -translate-y-1/2 z-20 p-6"
              type="button"
              onClick={prev}
            >
              <CaretLeft
                className={`${images[index].isDark ? 'text-white' : 'text-black'}`}
                size={24}
                weight="bold"
              />
            </button>
            <button
              className="absolute rounded right-2 top-1/2 -translate-y-1/2 z-20 p-6"
              type="button"
              onClick={next}
            >
              <CaretRight
                className={`${images[index].isDark ? 'text-white' : 'text-black'}`}
                size={24}
                weight="bold"
              />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <ul className="max-w-7xl flex flex-row mt-0 mx-auto px-1 md:px-2 justify-stretch list-none gap-2">
          {images.map((image, i) => (
            <li className="flex-grow" key={image.alt}>
              <button
                data-active={i === index}
                className="w-full h-3 rounded sm:rounded-full bg-foreground data-[active=true]:bg-primary bg-opacity-10 data-[active=true]:bg-opacity-35 hover:bg-opacity-35 transition"
                aria-label={`Show image No. ${i}`}
                onClick={() => setIndex(i)}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Carousel;
