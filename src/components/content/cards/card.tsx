import { Button } from '@heroui/button';
import { CardBody, CardHeader, Card as HeroUICard } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { cn } from '@heroui/react';
import { ArrowSquareInIcon } from '@phosphor-icons/react/ssr';
import Image from 'next/image';
import Link from 'next/link';
import RichTextWrapper from '@/components/content/richtext-wrapper';
import { type CMSLinkData, resolveCMSLinkHref } from '@/components/utility/cms-link';
import type { Cards, Media, Solution } from '@/payload-types';

interface CardProps {
  lang: string;
  solution: Solution;
  className?: string;
}

export function Card({ lang, solution, className }: CardProps) {
  const raw = solution.details.images?.[0];
  if (!raw || typeof raw === 'string') return null;

  const cardImage = raw as Media;
  const src = cardImage.sizes?.small?.url ?? cardImage.url;
  const height = cardImage.sizes?.small?.height ?? cardImage.height;
  const width = cardImage.sizes?.small?.width ?? cardImage.width;

  return (
    <HeroUICard
      className={cn(
        'group w-[320px] aspect-3/4',
        'shadow-none hover:z-20 focus-visible:z-20',
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
            'relative bottom-0 w-full right-0 pb-4 pt-30 px-6 origin-right text-4xl font-semibold',
            'bg-linear-to-t from-15% from-background/90 to-transparent',
          )}
        >
          {solution.title}
        </h2>
      </CardHeader>
      <CardBody
        className={cn(
          'absolute h-full z-10 top-0 flex flex-col items-start justify-between',
          'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-400',
          'bg-foreground/75 backdrop-blur-xs',
        )}
      >
        <div className="max-h-[calc(100%-4.25rem)] w-full px-1 overflow-y-auto rounded-md scrollbar-hide">
          <h2 className={cn('origin-left text-3xl text-background font-semibold')}>
            {solution.title}
          </h2>
          <div
            className={cn(
              'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity',
            )}
          >
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
            <p className="text-sm block my-1 text-primary-300 dark:text-primary-700">
              {solution.subtitle}
            </p>
            <RichTextWrapper text={solution.abstract} lang={lang} className="text-background" />
          </div>
        </div>

        <Link
          aria-label={`Learn more about ${solution.title}`}
          href={`/${lang}/nt/${solution.slug}`}
          passHref
          className="relative bottom-0 left-0 w-full"
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
        className="min-h-full min-w-full object-cover scale-103"
        height={height as number}
        src={src as string}
        width={width as number}
        placeholder={cardImage.blurDataUrl ? 'blur' : 'empty'}
        blurDataURL={cardImage.blurDataUrl as string}
      />
    </HeroUICard>
  );
}

type ManualCardData = NonNullable<NonNullable<Cards['manualFields']>['cards']>[number];

interface ManualCardProps {
  lang: string;
  card: ManualCardData;
  className?: string;
}

export function ManualCard({ lang, card, className }: ManualCardProps) {
  if (!card.image || typeof card.image === 'string') return null;

  const cardImage = card.image as Media;
  const src = cardImage.sizes?.small?.url ?? cardImage.url;
  const height = cardImage.sizes?.small?.height ?? cardImage.height;
  const width = cardImage.sizes?.small?.width ?? cardImage.width;
  const href = resolveCMSLinkHref(card.link as CMSLinkData, lang);
  const newTabProps = card.link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <HeroUICard
      className={cn(
        'group w-[320px] aspect-3/4',
        'shadow-none hover:z-20 focus-visible:z-20',
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
            'bg-linear-to-t from-background/75 to-transparent',
          )}
        >
          {card.title}
        </h2>
      </CardHeader>
      <CardBody
        className={cn(
          'absolute h-full z-10 top-0 flex flex-col items-start justify-between',
          'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-400',
          'bg-foreground/75 backdrop-blur-xs',
        )}
      >
        <div className="max-h-[calc(100%-4.25rem)] w-full px-1 overflow-y-auto rounded-md scrollbar-hide">
          <h2 className="origin-left text-3xl text-background font-semibold">{card.title}</h2>
          {card.description && (
            <div className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
              {card.subtitle && (
                <p className="text-sm block my-1 text-primary-300 dark:text-primary-700">
                  {card.subtitle}
                </p>
              )}
              <RichTextWrapper text={card.description} lang={lang} className="text-background" />
            </div>
          )}
        </div>

        <Link
          aria-label={`Learn more about ${card.title}`}
          href={href}
          className="relative bottom-0 left-0 w-full"
          {...newTabProps}
        >
          <Button
            color="primary"
            variant="solid"
            radius="md"
            size="lg"
            className="w-full mb-1 focus-visible:outline-focus font-semibold"
          >
            {card.link.label ?? card.title} <ArrowSquareInIcon size={24} />
          </Button>
        </Link>
      </CardBody>
      <Image
        alt={card.title}
        className="min-h-full min-w-full object-cover scale-103"
        height={height as number}
        src={src as string}
        width={width as number}
        placeholder={cardImage.blurDataUrl ? 'blur' : 'empty'}
        blurDataURL={cardImage.blurDataUrl as string}
      />
    </HeroUICard>
  );
}
