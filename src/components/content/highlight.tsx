import { Button } from '@heroui/button';
import Link from 'next/link';
import type { CMSLinkData } from '@/components/utility/cms-link';
import { resolveCMSLinkHref } from '@/components/utility/cms-link';
import type { LinkAppearance } from '@/fields/linkField';
import type { Config } from '@/payload-types';

interface HighlightProps {
  lang: Config['locale'];
  title: string;
  text: string;
  link?: CMSLinkData | null;
  color?: 'primary' | 'secondary' | 'warning' | 'danger' | undefined | null;
}

const Highlight = (props: HighlightProps) => {
  const { lang, title, text, link, color = 'primary' } = props;
  const gradient = {
    primary: 'from-primary to-primary-600 dark:from-primary-400 dark:to-primary',
    secondary: 'from-secondary to-secondary-600 dark:from-secondary-400 dark:to-secondary',
    warning: 'from-warning to-warning-600 dark:from-warning-400 dark:to-warning',
    danger: 'from-danger to-danger-600 dark:from-danger-400 dark:to-danger',
  }[color ?? 'primary'];

  const textGradient = 'from-white/80 to-white dark:to-black/80 dark:from-black';

  const href = link ? resolveCMSLinkHref(link, lang) : '#';
  const newTabProps = link?.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <section
      className={`relative left-1/2 -translate-x-[50%] w-screen col-span-full my-12 py-6 bg-linear-to-t ${gradient} ${color === 'warning' && 'dark'}`}
    >
      <div className="container mx-auto px-8 text-background text-center font-medium">
        <h2
          className={`text-3xl font-extrabold bg-clip-text bg-linear-to-t text-transparent mb-3 ${textGradient}`}
        >
          {title}
        </h2>
        <p className="mx-auto text-lg my-3">{text}</p>
        {link && (
          <Link href={href} passHref {...newTabProps}>
            <Button
              color="default"
              radius="lg"
              variant={(link.appearance as LinkAppearance) ?? 'solid'}
              className="text-lg"
            >
              {link.label ?? 'Learn more'}
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
};

export default Highlight;
