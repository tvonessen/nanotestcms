import config from '@payload-config';
import { getPayload } from 'payload';
import {
  ANALYTICS_EXCLUDED_PATH_PREFIXES,
  classifyDeviceClass,
  extractLocaleFromPath,
  shouldExcludeFromAnalytics,
  viewportToBucket,
} from '@/utils/analytics-dimensions';

type CollectBody = {
  pathname?: unknown;
  viewportWidth?: unknown;
  referrer?: unknown;
  eventType?: unknown;
};

const MAX_PATH_LENGTH = 300;
const MAX_REGION_LENGTH = 80;
const MAX_COUNTRY_LENGTH = 8;
const MAX_REFERRER_LENGTH = 500;

function toSafeString(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, maxLength);
}

function toSafeNumber(value: unknown): number | undefined {
  if (typeof value !== 'number' || Number.isNaN(value)) return undefined;
  return value;
}

async function parseBody(request: Request): Promise<CollectBody> {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return (await request.json()) as CollectBody;
  }

  const rawBody = await request.text();
  if (!rawBody) return {};

  try {
    return JSON.parse(rawBody) as CollectBody;
  } catch {
    return {};
  }
}

function isLikelyBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return /\b(bot|spider|crawl|slurp|preview|facebookexternalhit|whatsapp|telegram)\b/.test(ua);
}

function resolveCountry(headers: Headers): string | undefined {
  const raw =
    headers.get('x-vercel-ip-country') ??
    headers.get('cf-ipcountry') ??
    headers.get('x-country-code');

  return toSafeString(raw?.toUpperCase(), MAX_COUNTRY_LENGTH);
}

function resolveRegion(headers: Headers): string | undefined {
  const raw =
    headers.get('x-vercel-ip-country-region') ??
    headers.get('x-region') ??
    headers.get('cf-region-code');

  return toSafeString(raw, MAX_REGION_LENGTH);
}

function classifyReferrerType(referrer: string | undefined, requestURL: URL) {
  if (!referrer) return 'direct' as const;

  try {
    const refURL = new URL(referrer);

    if (refURL.host === requestURL.host) {
      return 'internal' as const;
    }

    if (
      /(google\.|bing\.|duckduckgo\.|yahoo\.|ecosia\.|yandex\.|baidu\.)/i.test(refURL.hostname)
    ) {
      return 'search' as const;
    }

    return 'external' as const;
  } catch {
    return 'unknown' as const;
  }
}

function getDayBucketStart(date = new Date()): string {
  const utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  return utc.toISOString();
}

function buildCompositeKey(args: {
  bucketStart: string;
  path: string;
  locale?: string;
  country?: string;
  region?: string;
  referrerType: 'direct' | 'search' | 'internal' | 'external' | 'unknown';
  deviceClass: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  viewportBucket: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'unknown';
}): string {
  return [
    'day',
    args.bucketStart,
    args.path,
    args.locale ?? 'none',
    args.country ?? 'none',
    args.region ?? 'none',
    args.referrerType,
    args.deviceClass,
    args.viewportBucket,
  ].join('|');
}

export async function POST(request: Request) {
  const userAgent = request.headers.get('user-agent') ?? '';
  if (isLikelyBot(userAgent)) {
    return new Response(null, { status: 202 });
  }

  const body = await parseBody(request);
  const rawPath = toSafeString(body.pathname, MAX_PATH_LENGTH);
  if (!rawPath) {
    return new Response(null, { status: 400 });
  }

  const payload = await getPayload({ config });
  const settings = await payload.findGlobal({
    slug: 'analytics-settings',
    depth: 0,
    overrideAccess: true,
  });

  const analyticsEnabled = settings.enabled ?? true;
  if (!analyticsEnabled) {
    return new Response(null, { status: 202 });
  }

  const configuredPrefixes =
    settings.excludedPathPrefixes?.map((entry) => entry.prefix).filter(Boolean) ?? [];
  const excludedPrefixes = Array.from(
    new Set([...ANALYTICS_EXCLUDED_PATH_PREFIXES, ...configuredPrefixes]),
  );

  if (shouldExcludeFromAnalytics(rawPath, excludedPrefixes)) {
    return new Response(null, { status: 202 });
  }

  const { locale, normalizedPath } = extractLocaleFromPath(rawPath);
  const normalizedLocale: 'en' | 'de' | undefined =
    locale === 'en' || locale === 'de' ? locale : undefined;
  if (shouldExcludeFromAnalytics(normalizedPath, excludedPrefixes)) {
    return new Response(null, { status: 202 });
  }

  const viewportWidth = toSafeNumber(body.viewportWidth);
  const viewportBucket = viewportToBucket(viewportWidth);
  const deviceClass = classifyDeviceClass(userAgent, viewportBucket);
  const requestURL = new URL(request.url);
  const referrer = toSafeString(body.referrer, MAX_REFERRER_LENGTH);
  const referrerType = classifyReferrerType(referrer, requestURL);
  const country = resolveCountry(request.headers);
  const region = settings.allowRegionGranularity ? resolveRegion(request.headers) : undefined;
  const eventType = body.eventType === 'initial' ? 'initial' : 'navigation';
  const bucketStart = getDayBucketStart();
  const compositeKey = buildCompositeKey({
    bucketStart,
    path: normalizedPath,
    locale: normalizedLocale,
    country,
    region,
    referrerType,
    deviceClass,
    viewportBucket,
  });

  const existing = await payload.find({
    collection: 'analytics-aggregates',
    depth: 0,
    pagination: false,
    limit: 1,
    overrideAccess: true,
    where: {
      compositeKey: {
        equals: compositeKey,
      },
    },
  });

  const entryIncrement = eventType === 'initial' ? 1 : 0;
  const uniqueIncrement = eventType === 'initial' ? 1 : 0;
  const now = new Date().toISOString();
  const data = {
    compositeKey,
    bucketStart,
    bucketGranularity: 'day' as const,
    path: normalizedPath,
    locale: normalizedLocale ?? null,
    country,
    region,
    referrerType,
    deviceClass,
    viewportBucket,
    pageviews: 1,
    uniqueVisitorsApprox: uniqueIncrement,
    entryViews: entryIncrement,
    lastCollectedAt: now,
  };

  if (!existing.docs.length) {
    await payload.create({
      collection: 'analytics-aggregates',
      overrideAccess: true,
      data,
    });
    return new Response(null, {
      status: 202,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  }

  const current = existing.docs[0];
  await payload.update({
    collection: 'analytics-aggregates',
    id: current.id,
    overrideAccess: true,
    data: {
      ...data,
      pageviews: (current.pageviews ?? 0) + 1,
      uniqueVisitorsApprox: (current.uniqueVisitorsApprox ?? 0) + uniqueIncrement,
      entryViews: (current.entryViews ?? 0) + entryIncrement,
    },
  });

  return new Response(null, {
    status: 202,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

export async function GET() {
  return new Response(null, {
    status: 405,
    headers: {
      Allow: 'POST',
      'Cache-Control': 'no-store',
    },
  });
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';
