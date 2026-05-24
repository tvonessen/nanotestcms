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

function normalizeText(value?: string | null): string | undefined {
  const trimmed = value?.trim();

  return trimmed ? trimmed : undefined;
}

function normalizeTitle(value?: string | null): string | undefined {
  const normalized = normalizeText(value);

  if (!normalized) {
    return undefined;
  }

  const compact = normalized.replace(/[\s\-–—|:]+/g, '').toLowerCase();
  if (compact === 'nanotest') {
    return undefined;
  }

  return normalized;
}

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
  const title =
    normalizeTitle(meta?.title) ??
    normalizeTitle(overrides.title) ??
    normalizeTitle(siteConfig.title);
  const description =
    normalizeText(meta?.description) ??
    normalizeText(overrides.description) ??
    normalizeText(siteConfig.description);

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
