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
    const handleResize = () => {
      if (window.innerWidth > 1024) setIsExpandable(false);
      else setIsExpandable(expandable);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

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
          width={768}
          height={((width as number) / 768) * (height as number)}
          alt={image.alt}
          blurDataURL={image.blurDataUrl as string}
          placeholder={image.blurDataUrl ? 'blur' : 'empty'}
          tabIndex={0}
          quality={80}
          unoptimized={image.mimeType?.includes('svg')}
          onError={(e) => {
            console.log(e);
          }}
          style={{
            aspectRatio: isExpanded || !isExpandable ? `${width}/${height}` : '4 / 1',
            backgroundColor: image.mimeType?.includes('svg') ? '#fffe' : 'transparent',
            padding: image.mimeType?.includes('svg') ? '0.5rem' : '0',
          }}
        />
        <span
          className={`flex flex-row items-center justify-center font-semibold md:text-lg lg:hidden ${isExpanded && 'opacity-0'} absolute top-0 left-0 h-full w-full ${image.isDark ? ' text-white bg-black' : ' text-black bg-white'} bg-opacity-35 border-1 rounded-md backdrop-blur-[2px] transition-opacity`}
          aria-label="Click to expand image to full height"
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
