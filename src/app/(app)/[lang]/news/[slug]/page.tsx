import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import { Content } from '@/components/content/content';
import { locales } from '@/config/locales';
import config, { type SupportedLocale } from '@/payload.config';
import { isPreviewEnabled } from '@/utils/preview';

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const params: { lang: SupportedLocale; slug: string }[] = [];

  for (const { code } of locales) {
    const news = await payload.find({
      collection: 'news',
      pagination: false,
      depth: 0,
      locale: code as SupportedLocale,
    });

    news.docs
      .filter((doc) => !!doc.slug)
      .filter((doc) => doc?.newsPage?.content && doc.newsPage.content.length > 0)
      .forEach((doc) => {
        params.push({
          lang: code as SupportedLocale,
          slug: doc.slug as string,
        });
      });
  }
  return params;
}

interface NewsPageProps {
  params: Promise<{
    lang: SupportedLocale;
    slug: string;
  }>;
}

export default async function NewsPage(props: NewsPageProps) {
  const { lang, slug } = await props.params;
  const payload = await getPayload({ config });
  const isDraft = await isPreviewEnabled();

  const results = await payload.find({
    collection: 'news',
    where: { slug: { equals: slug } },
    locale: lang,
    draft: isDraft,
  });
  const news = results.docs[0];
  const content = news?.newsPage?.content;

  if (!content || content.length === 0) {
    return notFound();
  }

  return (
    <div className="container max-w-4xl mt-8 mb-24 mx-auto px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-secondary">{news.content.title}</h1>
        <span className="text-sm text-primary/75">
          {lang === 'de' ? 'Veröffentlicht am ' : 'Published on '}
          {new Date(news.updatedAt).toLocaleDateString(lang, {
            dateStyle: 'full',
          })}
        </span>
      </div>
      <Content lang={lang} blocks={content} />
    </div>
  );
}
