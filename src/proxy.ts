import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const prev = request.url;

  if (pathname.startsWith('/api/')) return NextResponse.next();
  if (pathname.startsWith('/_next/')) return NextResponse.next();
  if (pathname.startsWith('/static/')) return NextResponse.next();
  if (pathname.startsWith('/admin')) return NextResponse.next();
  if (pathname.includes('favicon')) return NextResponse.next();

  const locale = pathname.split('/')[1] || prev.split('/')[1] || 'en'; // Default to 'en'

  // Redirect root to default locale
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', request.url));
  }

  // Validate locale
  const locales = ['en', 'de'];
  if (!locales.includes(locale)) {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
  }
}
