import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { RedirectMap } from '@/utils/redirect-map';

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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const prev = request.url;

  if (pathname.startsWith('/api/')) return NextResponse.next();
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
  if (LOCALES.includes(locale)) return NextResponse.next();

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
