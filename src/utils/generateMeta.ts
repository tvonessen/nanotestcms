import type { Metadata } from 'next';
import { getOpenGraphLocale } from '@/config/locales';

import { siteConfig } from '@/config/siteconfig';
import type { Media } from '@/payload-types';
import { resolveAssetURL } from '@/utils/public-url';

type MetaGroup = {
  title?: string | null;
  description?: string | null;
  image?: (string | null) | Media;
};

/**
 * Converts a Payload `meta` group (added by @payloadcms/plugin-seo) into a
 * Next.js `Metadata` object. Falls back to siteConfig defaults when fields are
 * absent so every page always has valid metadata.
 */
export function buildMetadata(
  meta: MetaGroup | null | undefined,
  overrides: { title?: string; description?: string } = {},
  locale = 'en',
): Metadata {
  const title = meta?.title ?? overrides.title ?? siteConfig.title;
  const description = meta?.description ?? overrides.description ?? siteConfig.description;

  const ogImage =
    meta?.image && typeof meta.image === 'object' && meta.image.url
      ? [{ url: resolveAssetURL(meta.image.url), alt: meta.image.alt ?? '' }]
      : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: getOpenGraphLocale(locale),
      images: ogImage,
    },
  };
}
