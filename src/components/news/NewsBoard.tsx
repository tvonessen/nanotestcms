'use client';

import { type BasePayload, getPayload } from 'payload';
import { useEffect, useState } from 'react';
import { set } from 'react-hook-form';
import RichTextWrapper from '@/components/content/richtext-wrapper';
import type { SupportedLocale } from '@/payload.config';
import type { News } from '@/payload-types';

interface NewsBoardProps {
  draft: boolean;
  lang: SupportedLocale;
}

export function NewsBoard(props: NewsBoardProps) {
  const { draft, lang } = props;
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/news?draft=${false}&locale=${lang}`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setNews(data.docs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, [draft, lang]);

  if (isLoading) {
    return <div>Loading news...</div>;
  }

  if (error) {
    return <div>Error loading news: {error}</div>;
  }

  return (
    <div>
      <h2>News Board</h2>
      <ul>
        {news.map((item) => (
          <li key={item.id}>
            <h3>{item.content.title}</h3>
            <RichTextWrapper text={item.content.abstract} />
          </li>
        ))}
      </ul>
    </div>
  );
}
