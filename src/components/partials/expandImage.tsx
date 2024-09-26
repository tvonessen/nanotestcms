'use client';

import { Media } from '@/payload-types';
import { Button } from '@nextui-org/react';
import {
  ArrowFatDown,
  ArrowsDownUp,
  ArrowsVertical,
  CaretDown,
  CaretUpDown,
  FunnelSimple,
} from '@phosphor-icons/react';
import Image from 'next/image';
import React from 'react';
import { useWindowSize } from 'usehooks-ts';

interface ExpandImageProps {
  image: Media;
  imageSize: 'small' | 'medium' | 'large';
  alt: string;
  expandable?: boolean;
}

const ExpandImage = ({
  image,
  alt,
  imageSize = 'medium',
  expandable = false,
}: ExpandImageProps) => {
  const { url, width, height } = image.sizes?.[imageSize] || {};
  const [isExpanded, setIsExpanded] = React.useState(!expandable);
  const { width: windowWidth } = useWindowSize();

  expandable = expandable && windowWidth < 1024;

  if (!url) {
    return null;
  }

  return (
    <>
      <div
        className={`group relative ${expandable && 'cursor-pointer'}`}
        onClick={() => expandable && setIsExpanded(!isExpanded)}
      >
        <Image
          className={`w-full rounded-lg object-cover transition-all duration-500`}
          src={url as string}
          width={width as number}
          height={height as number}
          alt={image.alt}
          blurDataURL={image.blurDataUrl as string}
          tabIndex={0}
          style={{ aspectRatio: isExpanded || !expandable ? `${width}/${height}` : '21 / 9' }}
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
