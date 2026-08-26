import { notFound } from 'next/navigation';
import { Content } from '@/components/content/content';
import type { SupportedLocale } from '@/payload.config';
import { getNews } from '@/server/actions/getNews';
import { isPreviewEnabled } from '@/utils/preview';

interface NewsPageProps {
  params: Promise<{
    lang: SupportedLocale;
    slug: string;
  }>;
}

export default async function NewsPage(props: NewsPageProps) {
  const { lang, slug } = await props.params;
  const draft = await isPreviewEnabled();
  const news = await getNews(slug, lang, draft);
  const content = news?.newsPage?.content;

  if (!content || content.length === 0) {
    return draft ? (
      <div className="flex flex-col items-center border-t-2 border-b-2 border-warning py-4 my-8">
        <h2 className="text-lg font-semibold mb-4">
          <b className="text-warning">Draft Mode:</b> No content
        </h2>
        <p className="text-center w-[60ch]">
          If you want this news to have a separate news page and to not only appear on the news
          board, add content to the <b>News Page</b> tab in this record
        </p>
      </div>
    ) : (
      notFound()
    );
  }

  return (
    <div className="container max-w-4xl mt-8 mb-24 mx-auto px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-secondary">{news.content.title}</h1>
        <span className="text-sm text-primary/75">
          {lang === 'de' ? 'Veröffentlicht am ' : 'Published on '}
          {new Date(news.publishedAt).toLocaleDateString(lang, {
            dateStyle: 'full',
          })}
        </span>
        {news.status !== 'published' && (
          <span className="inline-block ms-4 text-sm text-danger font-semibold">
            [ {news.status} ]
          </span>
        )}
      </div>
      <Content lang={lang} blocks={content} />
    </div>
  );
}
