'use server';

import { getPayload } from 'payload';
import config, { type SupportedLocale } from '@/payload.config';
import type { News } from '@/payload-types';

export async function getNews(locale: SupportedLocale, draft: boolean): Promise<News[]>;
export async function getNews(
  slug: string,
  locale: SupportedLocale,
  draft: boolean,
): Promise<News | null>;

export async function getNews(
  slugOrLocale: string | SupportedLocale,
  localeOrDraft: SupportedLocale | boolean,
  draft?: boolean,
): Promise<News[] | News | null> {
  let locale: SupportedLocale;
  let draftMode: boolean;
  let slug: string | undefined;

  if (typeof localeOrDraft === 'boolean') {
    locale = slugOrLocale as SupportedLocale;
    draftMode = localeOrDraft;
    slug = undefined;
  } else {
    slug = slugOrLocale as string;
    locale = localeOrDraft as SupportedLocale;
    draftMode = draft as boolean;
  }

  const payload = await getPayload({ config });

  const news = await payload
    .find({
      collection: 'news',
      draft: draftMode,
      locale,
      fallbackLocale: ['en', 'de'],
      where: slug
        ? { and: [{ slug: { equals: slug } }, { 'newsPage.mode': { equals: 'page' } }] }
        : undefined,
      pagination: false,
      depth: 0,
      sort: ['-publishedAt'],
    })
    .then(({ docs }) => {
      return draftMode ? docs : docs.filter((doc) => doc.status === 'published');
    });

  return slug ? (news.length > 0 ? news[0] : null) : news;
}
