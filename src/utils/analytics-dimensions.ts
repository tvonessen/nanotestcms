import { locales } from '@/config/locales';

export const ANALYTICS_EXCLUDED_PATH_PREFIXES = ['/admin', '/api', '/_next', '/img', '/static'];

const localeSet = new Set(locales.map((locale) => locale.code));

function ensureLeadingSlash(pathname: string): string {
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

function normalizeTrailingSlash(pathname: string): string {
  if (pathname === '/') {
    return '/';
  }

  return pathname.replace(/\/+$/, '');
}

export function normalizeAnalyticsPath(pathname: string): string {
  const withSlash = ensureLeadingSlash(pathname.trim());
  const [pathWithoutQuery] = withSlash.split(/[?#]/);
  const normalizedPath = normalizeTrailingSlash(pathWithoutQuery || '/');

  return normalizedPath || '/';
}

export function extractLocaleFromPath(pathname: string): {
  locale?: string;
  normalizedPath: string;
} {
  const normalizedPath = normalizeAnalyticsPath(pathname);
  const segments = normalizedPath.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (!firstSegment || !localeSet.has(firstSegment)) {
    return { normalizedPath };
  }

  const pathWithoutLocale = `/${segments.slice(1).join('/')}`;

  return {
    locale: firstSegment,
    normalizedPath: normalizeTrailingSlash(pathWithoutLocale || '/'),
  };
}

export function shouldExcludeFromAnalytics(pathname: string, excludedPrefixes: string[]): boolean {
  const normalizedPath = normalizeAnalyticsPath(pathname);

  return excludedPrefixes.some((prefix) => {
    const normalizedPrefix = normalizeTrailingSlash(ensureLeadingSlash(prefix.trim()));

    if (normalizedPrefix === '/') {
      return normalizedPath === '/';
    }

    return normalizedPath === normalizedPrefix || normalizedPath.startsWith(`${normalizedPrefix}/`);
  });
}

export function viewportToBucket(
  viewportWidth?: number,
): 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'unknown' {
  if (typeof viewportWidth !== 'number' || Number.isNaN(viewportWidth) || viewportWidth <= 0) {
    return 'unknown';
  }

  if (viewportWidth <= 640) return 'xs';
  if (viewportWidth <= 768) return 'sm';
  if (viewportWidth <= 1024) return 'md';
  if (viewportWidth <= 1280) return 'lg';
  return 'xl';
}

export function classifyDeviceClass(
  userAgent: string,
  viewportBucket: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'unknown',
): 'mobile' | 'tablet' | 'desktop' | 'unknown' {
  if (!userAgent.trim()) {
    if (viewportBucket === 'unknown') return 'unknown';
    if (viewportBucket === 'xs' || viewportBucket === 'sm') return 'mobile';
    if (viewportBucket === 'md') return 'tablet';
    return 'desktop';
  }

  const ua = userAgent.toLowerCase();

  if (/\b(ipad|tablet|playbook|silk)\b/.test(ua)) {
    return 'tablet';
  }

  if (/\b(mobile|iphone|ipod|android)\b/.test(ua)) {
    return 'mobile';
  }

  if (/\b(windows|macintosh|linux|x11|cros)\b/.test(ua)) {
    return 'desktop';
  }

  if (viewportBucket === 'unknown') {
    return 'unknown';
  }

  if (viewportBucket === 'xs' || viewportBucket === 'sm') return 'mobile';
  if (viewportBucket === 'md') return 'tablet';
  return 'desktop';
}
