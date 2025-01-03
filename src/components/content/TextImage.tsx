import type { Media } from '@/payload-types';
import React from 'react';
import ExpandImage from '../partials/expandImage';
import RichText from '../partials/richText';

interface TextImageProps {
  text: string;
  image: Media;
}

const TextImage = ({ text, image }: TextImageProps) => {
  const { url, width, height } = image.sizes?.large || {};

  return (
    <>
      <aside className="container mx-auto col-span-12 lg:col-span-5 xl:col-span-4 mt-4">
        <ExpandImage image={image} alt={image.alt} expandable />
      </aside>
      <section className="col-span-12 lg:col-span-7 lg:col-start-6 xl:col-span-8 xl:col-start-5">
        <RichText text={text} />
      </section>
    </>
  );
};
export default TextImage;
