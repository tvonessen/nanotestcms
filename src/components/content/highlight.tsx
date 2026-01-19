import type { Config } from '@/payload-types';
import Link from 'next/link';

interface HighlightProps {
  lang: Config['locale'];
  title: string;
  text: string;
  link: string;
  variant?: 'primary' | 'secondary' | undefined | null;
}

const Highlight = (props: HighlightProps) => {
  const { lang, title, text, link, variant = 'primary' } = props;
  const gradient =
    variant === 'primary'
      ? 'from-primary-600 to-primary-900 dark:from-primary-200 dark:to-primary'
      : 'from-secondary-600 to-secondary-900 dark:from-secondary-200 dark:to-secondary';

  const textGradient =
    variant === 'primary'
      ? 'from-primary-200 to-white dark:to-primary-700 dark:from-black'
      : 'from-secondary-200 to-white dark:to-secondary-700 dark:from-black';

  return (
    <section
      className={`relative left-1/2 -translate-x-[50%] w-screen col-span-full my-12 py-6 shadow-[inset_0_0_100px_#0009] bg-gradient-to-t ${gradient}`}
    >
      <div className="container mx-auto px-8 text-background text-center font-medium">
        <h2
          className={`text-3xl font-extrabold bg-clip-text bg-gradient-to-t text-transparent mb-3 ${textGradient}`}
        >
          {title}
        </h2>
        <p className=" mx-auto text-lg my-3">{text}</p>
        <Link
          className={`btn ${variant === 'primary' ? 'btn-secondary' : 'btn-primary'} rounded-full text-lg px-4 py-2`}
          href={`/${lang}/${link}`}
        >
          Learn more
        </Link>
      </div>
    </section>
  );
};

export default Highlight;
