import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { productCategories } from '@/data/productCategories';
import { Media, Solution } from '@/payload-types';

interface ProductCardProps {
  product: Solution;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  console.log(product.details.images);
  const category = productCategories.find((cat) => cat.id === product.category);
  const image = product.details.images[0] as Media;
  const usedImage = image.sizes?.medium ?? image.sizes?.small ?? image.sizes?.thumb ?? image;

  return (
    <div className={`card sm:card-side lg:card bg-base-200 shadow-lg ${className}`}>
      <figure>
        <Link href={`solutions/${product.slug}`} tabIndex={-1}>
          <Image
            alt={image.alt}
            blurDataURL={image.blurDataUrl as string}
            className="object-cover object-center min-w-full min-h-full brightness-125 contrast-75 hover:contrast-100 transition"
            height={image.sizes?.medium?.height ?? 480}
            placeholder="blur"
            src={`${usedImage.url}`}
            width={usedImage.width ?? 640}
          />
        </Link>
      </figure>
      <div className="card-body p-4 md:p-6">
        <h2 className="card-title text-2xl">
          {product.title}
          {product.new && <div className="badge badge-error text-white">NEW</div>}
        </h2>
        <div className="card-actions justify-start">
          <div className={`badge whitespace-nowrap opacity-70 badge-outline`}>
            {category?.title}
          </div>
        </div>
        <p>{product.subtitle}</p>
        <Link
          className="btn btn-primary text-white mt-4 text-lg"
          href={`solutions/${product.slug}`}
          title={`View ${product.title} details`}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
