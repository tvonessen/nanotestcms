import type { Features as FeaturesBlock, Media } from '@/payload-types';
import { LazyIcon } from '../utility/lazy-icon';

interface FeaturesProps {
  features: FeaturesBlock;
}

export default async function Features({ features }: FeaturesProps) {
  return (
    <div className="container my-12 px-8 md:px-12 mx-auto">
      <h2 className="text-4xl font-bold text-center mb-8">{features.title}</h2>
      <div className="flex flex-col flex-nowrap xl:flex-row gap-8 sm:gap-4 xl:gap-8 items-center">
        {features.features?.map((feature) => (
          <div
            key={feature.id}
            className="flex flex-col sm:flex-row xl:flex-col items-center sm:items-start xl:items-center gap-x-8"
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
              <h3 className="text-2xl font-bold mb-2 text-center sm:text-start xl:text-center">
                {feature.title}
              </h3>
              <p className="text-lg text-center sm:text-start">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
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
          href={String(image.sizes?.small?.url)}
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
