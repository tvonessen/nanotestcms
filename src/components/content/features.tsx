import { cn } from '@heroui/react';
import RichTextWrapper from '@/components/content/richtext-wrapper';
import { Hexagon } from '@/components/hexagon';
import type { Features as FeaturesBlock, Media } from '@/payload-types';
import { resolveAssetURL } from '@/utils/public-url';
import { LazyIcon } from '../utility/lazy-icon';

interface FeaturesProps {
  features: FeaturesBlock;
  className?: string;
}

export default async function Features(props: FeaturesProps) {
  const { features, className } = props;
  if (!features?.features?.length) return null;

  const featureItems = features.features;
  const hasDescriptions = featureItems.some((feature) => feature.description);
  if (features.size === 'compact') {
    return (
      <div className={cn('container my-16 px-8 md:px-12 mx-auto', className)}>
        {features.title && (
          <h2 className="text-4xl font-bold text-center mb-8">{features.title}</h2>
        )}
        <div className="flex flex-wrap flex-col sm:flex-row items-center justify-center gap-x-10 gap-y-8">
          {featureItems.map((feature) => (
            <div
              key={feature.id}
              className="inline-grid max-w-full flex-none grid-cols-[48px_14rem] gap-4 items-center sm:grid-cols-[48px_fit-content(20rem)] xl:grid-cols-[48px_fit-content(24rem)]"
            >
              <figure className="relative flex justify-center items-center size-12 text-primary">
                <LazyIcon name={String(feature.icon)} size={32} className="text-foreground" />
                <Hexagon className="absolute inset-0" />
              </figure>
              <div>
                <h3
                  className="text-xl text-primary font-semibold mb-1 wrap-break-word text-pretty"
                  title={feature.title}
                >
                  {feature.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className={cn('container mt-12 mb-16 px-8 md:px-12 mx-auto', className)}>
        {features.title && (
          <h2 className="text-4xl font-bold text-center mb-8">{features.title}</h2>
        )}
        <div className="flex flex-col flex-nowrap lg:flex-row gap-8 sm:gap-4 lg:gap-8 items-top justify-center">
          {featureItems.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col sm:w-[60ch] lg:w-1/3 mx-auto sm:flex-row lg:flex-col items-center sm:items-start lg:items-center gap-x-8"
            >
              <div className="flex flex-col items-center">
                <FeatureImage image={feature.image as Media} className="w-36 sm:w-48" />
                {feature.icon && (
                  <div className="rounded-full bg-primary text-white aspect-square p-2 -mt-9 border-5 border-background">
                    <LazyIcon name={feature.icon} size={32} />
                  </div>
                )}
              </div>
              <div className="sm:mt-4">
                <h3 className="text-2xl font-bold mb-2 text-center sm:text-start lg:text-center">
                  {feature.title}
                </h3>
                {hasDescriptions && (
                  <div className="flex flex-col items-center">
                    {feature.description ? (
                      <RichTextWrapper text={feature.description ?? ''} />
                    ) : (
                      <p>&nbsp;</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const FeatureImage = ({ image, className }: { image: Media; className?: string }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 96 99"
      style={{
        fillRule: 'evenodd',
        clipRule: 'evenodd',
        strokeLinejoin: 'round',
        strokeMiterlimit: 0,
      }}
      className={className}
    >
      <title>{image.alt}</title>
      <defs>
        <clipPath id={image.id}>
          <path
            d="M10.711,19.931l29.112,-15.84c5.124,-2.788 11.238,-2.788 16.355,-0l29.112,15.84c5.373,2.925 8.71,8.49 8.71,14.532l0,29.411c0,5.917 -3.236,11.424 -8.445,14.382l-29.111,16.526c-2.601,1.478 -5.525,2.218 -8.442,2.218c-2.92,0 -5.845,-0.74 -8.446,-2.218l-29.11,-16.526c-5.21,-2.958 -8.446,-8.465 -8.446,-14.382l-0,-29.411c-0,-6.042 3.337,-11.607 8.711,-14.532Z"
            fill="none"
          />
        </clipPath>
      </defs>
      <g>
        <image
          xlinkHref={image.blurDataUrl as string}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${image.id})`}
        />
        <image
          href={resolveAssetURL(image.sizes?.small?.url ?? image.url)}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${image.id})`}
        />
      </g>
      <path
        className="stroke-primary fill-transparent group-hover:stroke-foreground group-focus-visible:stroke-focus group-focus-within:stroke-foreground group-hover:fill-primary group-focus-within:fill-primary transition-colors"
        d="M10.711,19.931l29.112,-15.84c5.124,-2.788 11.238,-2.788 16.355,-0l29.112,15.84c5.373,2.925 8.71,8.49 8.71,14.532l0,29.411c0,5.917 -3.236,11.424 -8.445,14.382l-29.111,16.526c-2.601,1.478 -5.525,2.218 -8.442,2.218c-2.92,0 -5.845,-0.74 -8.446,-2.218l-29.11,-16.526c-5.21,-2.958 -8.446,-8.465 -8.446,-14.382l-0,-29.411c-0,-6.042 3.337,-11.607 8.711,-14.532Z" // prettier-ignore
        style={{
          strokeWidth: 3,
          fillOpacity: 0.9,
        }}
      />
    </svg>
  );
};
