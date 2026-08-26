'use client';

import { Divider } from '@heroui/react';
import { LightbulbFilamentIcon } from '@phosphor-icons/react';
import { useEffect, useMemo, useState } from 'react';
import { useWindowSize } from 'usehooks-ts';
import Loading from '@/app/(app)/[lang]/loading';
import { NewsItem } from '@/components/news/NewsItems';
import type { SupportedLocale } from '@/payload.config';
import type { News } from '@/payload-types';
import { getNews } from '@/server/actions/getNews';

interface NewsBoardProps {
  lang: SupportedLocale;
  draft: boolean;
}

export function NewsBoard(props: NewsBoardProps) {
  const { lang, draft } = props;
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { width } = useWindowSize();
  const [page, setPage] = useState(1);
  const [newsPerPage, setNewsPerPage] = useState(1);

  useEffect(() => {
    getNews(lang, draft)
      .then((news) => {
        setNews(news);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Unknown error');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [lang, draft]);

  useEffect(() => {
    if (width > 1440) {
      setNewsPerPage(3);
    } else if (width > 1024) {
      setNewsPerPage(2);
    } else {
      setNewsPerPage(1);
    }
  }, [width]);

  const newsToDisplay = useMemo(
    () => news.slice((page - 1) * newsPerPage, page * newsPerPage),
    [news, page, newsPerPage],
  );

  if (isLoading) {
    return <Loading message={lang === 'de' ? 'Lade News...' : 'Loading news...'} />;
  }

  if (news.length === 0 || error) {
    return null;
  }

  return (
    <div id="news-board" className="my-8 border-y border-foreground/10 dark:border-primary/30">
      <div className="relative w-full max-w-6xl mx-auto mb-2 px-4">
        <div className="relative w-full rounded-lg mx-auto">
          <div
            className="grid items-center gap-2 w-fit mx-auto p-2"
            style={{
              gridTemplateColumns: `repeat(${Math.min(newsPerPage, news.length)}, 320px)`,
            }}
          >
            <h2 className="text-3xl col-span-full font-extrabold flex flex-row justify-center items-center my-4">
              <LightbulbFilamentIcon size={28} weight="bold" className="-translate-x-3" />{' '}
              {lang === 'de' ? 'Aktuelles' : 'News'}
            </h2>
            {newsToDisplay.map((item) => (
              <NewsItem key={item.id} news={item} lang={lang} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
