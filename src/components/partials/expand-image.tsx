'use client';

import { ArrowsVerticalIcon, ArrowsOutSimpleIcon } from '@phosphor-icons/react';
import Image from 'next/image';
import React, { Fragment, useState } from 'react';
import type { Media } from '@/payload-types';
import { resolveAssetURL } from '@/utils/public-url';
import { ImageModal } from '@/components/ui/image-modal';

interface ExpandImageProps {
  image: Media;
  alt: string;
  expandable?: boolean;
}

const ExpandImage = ({ image, alt, expandable = false }: ExpandImageProps) => {
  const { url, sizes, width, height } = image;
  const [isExpandable, setIsExpandable] = React.useState(expandable);
  const [isExpanded, setIsExpanded] = React.useState(!expandable);
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useLayoutEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setIsExpandable(false);
      else setIsExpandable(expandable);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  if (!sizes?.medium?.url || !url) {
    return null;
  }

  function toggleExpand() {
    if (isExpandable) setIsExpanded(!isExpanded);
  }

  function handleClick() {
    if (isExpandable) {
      toggleExpand();
    } else {
      setIsModalOpen(true);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }

  return (
    <Fragment key="expand-image">
      {/* Modal for desktop fullscreen */}
      <ImageModal
        image={image}
        alt={alt}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/** biome-ignore lint/a11y/noStaticElementInteractions: Expandable image */}
      <div
        className={`group relative cursor-pointer`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <Image
          className={'w-full rounded-lg object-cover transition-all duration-500'}
          loading="lazy"
          src={resolveAssetURL(sizes?.medium?.url ?? image.url)}
          width={768}
          height={((width as number) / 768) * (height as number)}
          alt={image.alt}
          blurDataURL={image.blurDataUrl as string}
          placeholder={image.blurDataUrl ? 'blur' : 'empty'}
          sizes="(max-width: 1024px) 100vw, 50vw"
          quality={65}
          unoptimized={image.mimeType?.includes('svg')}
          onError={(e) => {
            process.env.NODE_ENV !== 'production' && console.error(e);
          }}
          style={{
            aspectRatio: isExpanded || !isExpandable ? `${width}/${height}` : '4 / 1',
            backgroundColor: image.mimeType?.includes('svg') ? '#fffe' : 'transparent',
            padding: image.mimeType?.includes('svg') ? '0.5rem' : '0',
          }}
        />
        <span
          className={`flex flex-row items-center justify-center font-semibold md:text-lg lg:hidden ${isExpanded && 'opacity-0'} absolute top-0 left-0 h-full w-full ${image.isDark ? ' text-white bg-black/35' : ' text-black bg-white/35'} border-1 rounded-md backdrop-blur-[2px] transition-opacity`}
        >
          Click to
          <ArrowsVerticalIcon size={24} weight="bold" />
          expand
        </span>

        {/* Fullscreen hint for desktop */}
        {!isExpandable && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full p-2">
            <ArrowsOutSimpleIcon size={20} weight="bold" className="text-white" />
          </div>
        )}
      </div>
      <center className="mt-1 ms-1 text-sm opacity-80 lg:text-left">{alt}</center>
    </Fragment>
  );
};

export default ExpandImage;
