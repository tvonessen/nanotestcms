import { Media } from '@/payload-types';
import Image from 'next/image';
import React from 'react';
import RichText from '../partials/richText';
import ExpandImage from '../partials/expandImage';

interface TextImageProps {
  text: string;
  image: Media;
}

const TextImage = ({ text, image }: TextImageProps) => {
  const { url, width, height } = image.sizes?.large || {};

  return (
    <>
      <div className="col-span-12 lg:col-span-5 xl:col-span-4 mt-4">
        <ExpandImage image={image} alt={image.alt} expandable />
      </div>
      <div className="col-span-12 lg:col-span-7 lg:col-start-6 xl:col-span-8 xl:col-start-5">
        <RichText text={text} />
      </div>
    </>
  );
};
export default TextImage;
