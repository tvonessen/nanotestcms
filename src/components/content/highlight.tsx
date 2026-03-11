import { Button } from '@heroui/button';
import { DownloadSimpleIcon } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { formatFilesize } from '@/components/content/downloads/utils';
import { resolveCMSLinkHref } from '@/components/utility/cms-link';
import type { Config, Document, Highlight as HighlightContent } from '@/payload-types';

interface HighlightProps {
  lang: Config['locale'];
  highlight: HighlightContent;
}

const Highlight = (props: HighlightProps) => {
  const {
    highlight: { title, text, link, variant, action },
    lang,
  } = props;
  const download = action === 'download' ? (props.highlight.download as Document) : null;
  const gradient = {
    primary: 'from-primary to-primary-600 dark:from-primary-400 dark:to-primary',
    secondary: 'from-secondary to-secondary-600 dark:from-secondary-400 dark:to-secondary',
    warning: 'from-warning to-warning-600 dark:from-warning-400 dark:to-warning',
    danger: 'from-danger to-danger-600 dark:from-danger-400 dark:to-danger',
  }[variant ?? 'primary'];

  const textGradient = 'from-white/80 to-white dark:to-black/80 dark:from-black';

  const href = link ? resolveCMSLinkHref(link, lang) : '#';
  const newTabProps = link?.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <section
      className={`relative left-1/2 -translate-x-[50%] w-screen col-span-full my-12 py-6 bg-linear-to-t ${gradient} ${variant === 'warning' && 'dark'}`}
    >
      <div className="container mx-auto px-8 text-background text-center font-medium">
        <h2
          className={`text-3xl font-extrabold bg-clip-text bg-linear-to-t text-transparent mb-3 ${textGradient}`}
        >
          {title}
        </h2>
        <p className="mx-auto text-lg my-3">{text}</p>
        {action === 'link' && link && (
          <Link href={href} passHref {...newTabProps} className="inline-block">
            <Button color="default" radius="lg" variant="solid" className="text-lg">
              {link.label ?? 'Learn more'}
            </Button>
          </Link>
        )}
        {action === 'download' && download && (
          <Link download href={(download as Document).url ?? ''} passHref className="inline-block">
            <Button
              color="default"
              radius="lg"
              variant="solid"
              className="text-lg flex items-center gap-4"
              aria-label={`Download ${((download as Document).filename_alt ?? (download as Document).filename) || 'document'}`}
            >
              <div className="flex flex-row items-center gap-2">
                <DownloadSimpleIcon size={24} />
                {(download as Document).filename_alt ?? (download as Document).filename}
              </div>
              <div className="flex flex-row items-center gap-2 opacity-50 font-light text-small">
                {formatFilesize((download as Document).filesize)}
              </div>
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
};

export default Highlight;
