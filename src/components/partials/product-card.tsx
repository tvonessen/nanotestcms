import Image from 'next/image';
import Link from 'next/link';

import type { Config, Media, Solution, SolutionCategory } from '@/payload-types';
import { Button } from '@heroui/button';

interface ProductCardProps {
  lang: Config['locale'];
  product: Solution;
  className?: string;
}

const ProductCard = ({ lang, product, className }: ProductCardProps) => {
  const categories = product.category.map((category) => category.value) as SolutionCategory[];
  const image = product.details.images[0] as Media;
  const usedImage = image.sizes?.medium ?? image.sizes?.small ?? image.sizes?.thumb ?? image;

  return (
    <div className={`card sm:card-side lg:card bg-base-200 shadow-lg ${className}`}>
      <figure>
        <Link href={`/${lang}/${product.type[0]}s/${product.slug}`} tabIndex={-1}>
          <Image
            alt={image.alt}
            blurDataURL={image.blurDataUrl as string}
            className="object-cover object-center min-w-full min-h-full brightness-125 contrast-75 hover:contrast-100 transition aspect-3/2"
            height={image.sizes?.medium?.height ?? 480}
            placeholder={image.blurDataUrl ? 'blur' : 'empty'}
            src={`${usedImage.url}`}
            width={usedImage.width ?? 640}
          />
        </Link>
      </figure>
      <div className="card-body min-w-[33%] p-4 md:p-6">
        <h2 className="card-title text-2xl">
          {product.title}
          {product.new && <div className="badge badge-error text-white">NEW</div>}
        </h2>
        <div className="card-actions justify-start">
          {categories.map((category) => (
            <div key={category.id} className={'badge whitespace-nowrap opacity-70 badge-outline'}>
              {category.title}
            </div>
          ))}
        </div>
        <p>{product.subtitle}</p>
        <Link
          href={`/${lang}/${product.type[0]}s/${product.slug}`}
          title={`View ${product.title} details`}
          passHref
        >
          <Button color="primary" className="text-white mt-4 text-lg">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
