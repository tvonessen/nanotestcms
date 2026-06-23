'use client';

import { X } from '@phosphor-icons/react';
import Image from 'next/image';
import React, { useEffect } from 'react';
import type { Media } from '@/payload-types';
import { resolveAssetURL } from '@/utils/public-url';

interface ImageModalProps {
  image: Media;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({ image, alt, isOpen, onClose }: ImageModalProps) {
  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !image?.url) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image fullscreen view"
    >
      <div
        className="relative max-w-[90vw] max-h-[90vh] p-4"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
          aria-label="Close"
        >
          <X size={32} weight="bold" />
        </button>

        {/* Image */}
        <Image
          src={resolveAssetURL(image.sizes?.large?.url || image.url)}
          alt={alt}
          width={image.sizes?.large?.width || image.width || 1200}
          height={image.sizes?.large?.height || image.height || 800}
          className="w-full h-full max-h-[80vh] object-contain rounded-lg"
          unoptimized={image.mimeType?.includes('svg')}
          quality={85}
        />

        {/* Caption */}
        {alt && (
          <p className="mt-4 text-center text-white/80 text-sm max-w-md mx-auto">
            {alt}
          </p>
        )}
      </div>
    </div>
  );
}
