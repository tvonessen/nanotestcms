import type { Media, Solution } from '@/payload-types';
import { Button } from '@heroui/button';
import { CardBody, CardHeader, Card as HeroUICard } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { cn } from '@heroui/react';
import { ArrowSquareInIcon } from '@phosphor-icons/react/ssr';
import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
  lang: string;
  solution: Solution;
  className?: string;
}

export function Card({ lang, solution, className }: CardProps) {
  const cardImage = solution.details.images[0] as Media;
  cardImage.url = cardImage.sizes?.small?.url ?? cardImage.url;
  cardImage.height = cardImage.sizes?.small?.height ?? cardImage.height;
  cardImage.width = cardImage.sizes?.small?.width ?? cardImage.width;
  cardImage.isDark;

  return (
    <HeroUICard
      className={cn(
        'group w-[320px] aspect-3/4',
        'shadow-none hover:z-20 focus-visible:z-20 bg-foreground',
        className,
      )}
    >
      <CardHeader
        className={cn(
          'absolute h-full p-0 z-10 flex flex-col text-right justify-end items-end opacity-100',
          'group-hover:opacity-0 group-focus-within:opacity-0 transition-opacity duration-400',
        )}
      >
        <h2
          className={cn(
            'relative bottom-0 w-full right-0 pb-4 pt-20 px-6 origin-right text-4xl font-semibold',
            'bg-gradient-to-t from-background/75 to-transparent',
          )}
        >
          {solution.title}
        </h2>
      </CardHeader>
      <CardBody
        className={cn(
          'absolute h-full z-10 top-1 flex flex-col items-start justify-between',
          'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-400',
        )}
      >
        <div>
          <h2 className={cn('mb-2 origin-left text-3xl text-background font-semibold')}>
            {solution.title}
          </h2>
          <div className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
            {solution.new && (
              <Chip color="danger" size="sm" className="-ms-1">
                NEW
              </Chip>
            )}
            {solution.discontinued && (
              <Chip color="default" size="sm" className="-ms-1">
                Discontinued
              </Chip>
            )}
            <p className="text-sm block my-4 text-primary-300 dark:text-primary-700">
              {solution.subtitle}
            </p>
            <p className="text-background taxt-md">{solution.shortDescription}</p>
          </div>
        </div>

        <Link
          aria-label={`Learn more about ${solution.title}`}
          href={`/${lang}/${solution.type[0]}s/${solution.slug}`}
          passHref
          className="w-full"
        >
          <Button
            color="primary"
            variant="solid"
            radius="md"
            size="lg"
            className="w-full mb-1 focus-visible:outline-focus font-semibold"
          >
            {solution.title} <ArrowSquareInIcon size={24} />
          </Button>
        </Link>
      </CardBody>
      <Image
        alt={solution.title}
        className={cn(
          'min-h-full min-w-full object-cover scale-103',
          'group-hover:opacity-30 transition-all duration-400 group-hover:blur-xs',
          'group-focus-within:opacity-30 transition-all group-focus-within:blur-xs',
        )}
        height={cardImage.height as number}
        src={cardImage.url as string}
        width={cardImage.width as number}
        placeholder={cardImage.blurDataUrl ? 'blur' : 'empty'}
        blurDataURL={cardImage.blurDataUrl as string}
      />
    </HeroUICard>
  );
}
