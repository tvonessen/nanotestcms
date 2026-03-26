import { Button } from '@heroui/button';
import { cn } from '@heroui/react';
import { DownloadSimpleIcon, ShareFatIcon } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { formatFilesize } from '@/components/content/downloads/utils';
import { resolveCMSLinkHref } from '@/components/utility/cms-link';
import type { Config, Highlight as HighlightContent } from '@/payload-types';

interface HighlightProps {
  lang: Config['locale'];
  block: HighlightContent;
  className?: string;
}

const Highlight = (props: HighlightProps) => {
  const {
    block: { title, text, variant, actions },
    lang,
    className,
  } = props;
  function getGradient(
    prefix: 'after' | 'before',
    variant?: 'primary' | 'secondary' | 'warning' | 'danger' | null,
  ) {
    const variants = {
      after: {
        primary: `after:from-primary after:to-primary-600 after:dark:from-primary-400 after:dark:to-primary`,
        secondary: `after:from-secondary after:to-secondary-600 after:dark:from-secondary-400 after:dark:to-secondary`,
        warning: `after:from-warning after:to-warning-600 after:dark:from-warning-400 after:dark:to-warning`,
        danger: `after:from-danger after:to-danger-600 after:dark:from-danger-400 after:dark:to-danger`,
      },
      before: {
        primary: `before:from-primary before:to-primary-600 before:dark:from-primary-400 before:dark:to-primary`,
        secondary: `before:from-secondary before:to-secondary-600 before:dark:from-secondary-400 before:dark:to-secondary`,
        warning: `before:from-warning before:to-warning-600 before:dark:from-warning-400 before:dark:to-warning`,
        danger: `before:from-danger before:to-danger-600 before:dark:from-danger-400 before:dark:to-danger`,
      },
    };
    return variants[prefix][variant ?? 'primary'];
  }

  const textGradient = 'from-white/80 to-white dark:to-black/80 dark:from-black';

  return (
    <section
      className={cn(
        `relative my-12 py-6 z-0`,
        variant === 'warning' && 'dark',
        'before:absolute before:w-full before:h-full before:top-0 before:left-0 before:rounded-lg',
        `before:bg-linear-to-t before:z-[-1] ${getGradient('before', variant)} `,
        'after:absolute after:w-[200vw] after:-left-[50vw] after:h-[calc(100%-0.5rem)] after:top-1 after:opacity-85',
        `after:bg-linear-to-t after:z-[-2] ${getGradient('after', variant)}`,
        className,
      )}
    >
      <div className="container mx-auto px-8 text-background text-center font-medium">
        <h2
          className={`text-3xl font-extrabold bg-clip-text bg-linear-to-t text-transparent mb-3 ${textGradient}`}
        >
          {title}
        </h2>
        <p className="mx-auto text-lg my-3">{text}</p>
        <div className="flex flex-row flex-wrap gap-2 justify-center items-center">
          {actions?.map((action) => {
            if (action.type === 'link' && !!action.link) {
              const link = action.link;
              const href = link ? resolveCMSLinkHref(link, lang) : '#';
              const newTabProps = link?.newTab
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {};
              return (
                <Link
                  key={action.id}
                  href={href}
                  passHref
                  {...newTabProps}
                  className="inline-block"
                >
                  <Button
                    color="default"
                    radius="lg"
                    variant={link.appearance ?? 'solid'}
                    className="text-lg text-foreground"
                  >
                    <ShareFatIcon className="size-6" /> {link.label ?? 'Learn more'}
                  </Button>
                </Link>
              );
            }
            if (
              action.type === 'download' &&
              !!action.download &&
              typeof action.download === 'object'
            ) {
              return (
                <Link
                  key={action.id}
                  download
                  href={action.download.url ?? ''}
                  passHref
                  className="inline-block"
                >
                  <Button
                    color="default"
                    radius="lg"
                    variant="solid"
                    className="text-lg flex items-center gap-4"
                    aria-label={`Download ${(action.download.filename_alt ?? action.download.filename) || 'document'}`}
                  >
                    <div className="flex flex-row items-center gap-2">
                      <DownloadSimpleIcon className="size-6" />
                      {action.download.filename_alt ?? action.download.filename}
                    </div>
                    <div className="flex flex-row items-center gap-2 opacity-50 font-light text-small">
                      {formatFilesize(action.download.filesize)}
                    </div>
                  </Button>
                </Link>
              );
            } else return null;
          })}
        </div>
      </div>
    </section>
  );
};

export default Highlight;
