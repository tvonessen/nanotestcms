import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { Button } from '@heroui/react';
import type { SupportedLocale } from '@payload-config';
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext';
import { defaultJSXConverters } from '@payloadcms/richtext-lexical/react';
import { ArrowSquareInIcon } from '@phosphor-icons/react/ssr';
import Link from 'next/link';
import RichTextWrapper from '@/components/content/richtext-wrapper';
import type { News } from '@/payload-types';

export function NewsItem(props: { news: News; lang: SupportedLocale }) {
  const { news, lang } = props;
  return (
    <Card shadow="none" radius="md" className="shadow-xs">
      <CardHeader className="text-lg font-semibold dark:text-primary-300">
        {news.content.title}
      </CardHeader>
      <CardBody className="py-0">
        <RichTextWrapper className="text-sm" text={news.content.abstract} />
      </CardBody>
      <CardFooter className="flex flex-row items-end justify-between">
        <span className="text-xs font-semibold opacity-60">
          {new Date(news.publishedAt).toLocaleDateString(lang, { dateStyle: 'long' })}
        </span>
        {news.newsPage?.content && news.newsPage.content.length > 0 && (
          <Link href={`/${lang}/news/${news.slug}`}>
            <Button size="sm" endContent={<ArrowSquareInIcon size={18} />}>
              {lang === 'de' ? 'Mehr erfahren' : 'Read more'}
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
