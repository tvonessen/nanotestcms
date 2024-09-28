'use client';

import { Media } from '@/payload-types';
import { ArrowsVertical } from '@phosphor-icons/react';
import Image from 'next/image';
import React from 'react';
import { useWindowSize } from 'usehooks-ts';

interface ExpandImageProps {
  image: Media;
  alt: string;
  expandable?: boolean;
}

const ExpandImage = ({ image, alt, expandable = false }: ExpandImageProps) => {
  const { url, width, height } = image || {};
  const [isExpandable, setIsExpandable] = React.useState(expandable);
  const [isExpanded, setIsExpanded] = React.useState(!expandable);

  React.useLayoutEffect(() => {
    if (window.innerWidth > 1024) setIsExpandable(false);
    else setIsExpandable(expandable);
  }, [expandable]);

  if (!url) {
    return null;
  }

  return (
    <>
      <div
        className={`group relative ${isExpandable && 'cursor-pointer'}`}
        onClick={() => isExpandable && setIsExpanded(!isExpanded)}
      >
        <Image
          className={`w-full rounded-lg object-cover transition-all duration-500`}
          loading="lazy"
          src={url as string}
          width={width as number}
          height={height as number}
          alt={image.alt}
          blurDataURL={image.blurDataUrl as string}
          placeholder="blur"
          tabIndex={0}
          quality={75}
          style={{ aspectRatio: isExpanded || !isExpandable ? `${width}/${height}` : '21 / 9' }}
        />
        <span
          className={`flex flex-row items-center font-semibold md:text-lg lg:hidden ${isExpanded && 'opacity-0'} absolute right-4 bottom-2 ${image.isDark ? ' text-white' : ' text-black'} transition-opacity`}
          aria-label="Expand image"
        >
          Click to
          <ArrowsVertical size={24} weight="bold" />
          expand
        </span>
      </div>
      <center className="mt-2 opacity-80">{alt}</center>
    </>
  );
};

export default ExpandImage;
