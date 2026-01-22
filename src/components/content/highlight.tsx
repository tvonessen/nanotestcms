import type { Config } from '@/payload-types';
import { Button } from '@heroui/button';
import Link from 'next/link';

interface HighlightProps {
  lang: Config['locale'];
  title: string;
  text: string;
  link: string;
  color?: 'primary' | 'secondary' | undefined | null;
}

const Highlight = (props: HighlightProps) => {
  const { lang, title, text, link, color = 'primary' } = props;
  const gradient =
    color === 'primary'
      ? 'from-primary-600 to-primary-900 dark:from-primary-200 dark:to-primary'
      : 'from-secondary-600 to-secondary-900 dark:from-secondary-200 dark:to-secondary';

  const textGradient =
    color === 'primary'
      ? 'from-primary-200 to-white dark:to-primary-700 dark:from-black'
      : 'from-secondary-200 to-white dark:to-secondary-700 dark:from-black';

  return (
    <section
      className={`relative left-1/2 -translate-x-[50%] w-screen col-span-full my-12 py-6 shadow-[inset_0_0_100px_#0009] bg-linear-to-t ${gradient}`}
    >
      <div className="container mx-auto px-8 text-background text-center font-medium">
        <h2
          className={`text-3xl font-extrabold bg-clip-text bg-linear-to-t text-transparent mb-3 ${textGradient}`}
        >
          {title}
        </h2>
        <p className=" mx-auto text-lg my-3">{text}</p>
        <Link href={`/${lang}/${link}`} passHref>
          <Button color={color ?? 'default'} radius="full" className="text-lg">
            Learn more
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Highlight;
