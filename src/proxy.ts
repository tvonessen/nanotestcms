import type { NextFetchEvent, NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { RedirectMap } from '@/utils/redirect-map';
import { buildInternalURL } from '@/utils/server-url';

const LOCALES = ['en', 'de'];

/** Detect preferred locale from Accept-Language header; defaults to 'en'. */
function detectLocale(acceptLanguage: string | null): string {
  if (!acceptLanguage) return 'en';
  const langs = acceptLanguage
    .split(',')
    .map((tag) => {
      const [lang, q] = tag.trim().split(';q=');
      return { lang: lang.split('-')[0].toLowerCase(), q: q ? parseFloat(q) : 1.0 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { lang } of langs) {
    if (LOCALES.includes(lang)) return lang;
  }
  return 'en';
}

function shouldTrackRequest(request: NextRequest): boolean {
  if (request.method !== 'GET') return false;
  const accept = request.headers.get('accept') ?? '';
  if (!accept.includes('text/html')) return false;
  if (request.headers.get('purpose') === 'prefetch') return false;
  if (request.headers.get('next-router-prefetch') !== null) return false;

  const hasDraftCookie =
    request.cookies.has('__prerender_bypass') || request.cookies.has('__next_preview_data');
  const hasPayloadSession = request.cookies.has('payload-token');
  return !(hasDraftCookie && hasPayloadSession);


}

function queueServerPageview(request: NextRequest, event: NextFetchEvent) {
  if (!shouldTrackRequest(request)) return;

  const analyticsPath = '/api/analytics/collect';
  const primaryAnalyticsURL = buildInternalURL(analyticsPath);
  const fallbackAnalyticsURL = new URL(analyticsPath, request.url).toString();
  const candidateURLs = [primaryAnalyticsURL, fallbackAnalyticsURL].filter(
    (value, index, all) => all.indexOf(value) === index,
  );
  const requestHeaders = new Headers({
    'content-type': 'application/json',
  });
  const forwardHeaders = [
    'user-agent',
    'referer',
    'x-vercel-ip-country',
    'x-vercel-ip-country-region',
    'cf-ipcountry',
    'cf-region-code',
    'x-country-code',
    'x-region',
  ];

  for (const header of forwardHeaders) {
    const value = request.headers.get(header);
    if (value) requestHeaders.set(header, value);
  }

  event.waitUntil(
    (async () => {
      const body = JSON.stringify({
        pathname: request.nextUrl.pathname,
        eventType: 'initial',
        referrer: request.headers.get('referer') ?? undefined,
      });

      for (const url of candidateURLs) {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: requestHeaders,
            body,
            cache: 'no-store',
          });

          if (response.ok) {
            return;
          }
        } catch {
          // Try the next candidate URL.
        }
      }
    })(),
  );
}

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;
  const prev = request.url;

  if (pathname.startsWith('/api/')) return NextResponse.next();
  if (pathname === '/about/licenses') return NextResponse.next();
  if (pathname.startsWith('/_next/')) return NextResponse.next();
  if (pathname.startsWith('/img/')) return NextResponse.next();
  if (pathname.startsWith('/static/')) return NextResponse.next();
  if (pathname.startsWith('/admin')) return NextResponse.next();
  if (pathname.includes('favicon')) return NextResponse.next();

  const locale = pathname.split('/')[1] || prev.split('/')[1] || 'en'; // Default to 'en'

  // Redirect root to default locale
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', request.url));
  }

  // Known locale prefix — pass through to normal routing
  if (LOCALES.includes(locale)) {
    queueServerPageview(request, event);
    return NextResponse.next();
  }

  // Unknown first segment: check the alias/redirect table before falling back to /en prefix.
  const alias = pathname.replace(/^\/+/, '').split('/')[0];
  let map: RedirectMap = {};
  try {
    const res = await fetch(`${request.nextUrl.origin}/api/redirect-map`, {
      next: { revalidate: 30 },
    });
    if (res.ok) map = (await res.json()) as RedirectMap;
  } catch {
    // If the endpoint is unreachable, fall through to the default locale prefix.
  }

  const entry = map[alias];
  if (entry) {
    const statusCode = entry.permanent ? 308 : 302;
    if (entry.external) {
      return NextResponse.redirect(entry.target, statusCode);
    }
    const preferredLocale = detectLocale(request.headers.get('accept-language'));
    const destination = new URL(`/${preferredLocale}${entry.target}`, request.nextUrl.origin);
    request.nextUrl.searchParams.forEach((value, key) => {
      destination.searchParams.set(key, value);
    });
    return NextResponse.redirect(destination, statusCode);
  }

  // No alias matched — apply default locale prefix so the request reaches a valid route.
  return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
}
