import { redirect } from 'next/navigation';
import { locales } from '@/config/locales';
import type { Config } from '@/payload-types';

export function generateStaticParams() {
  return locales.map(({ code }) => ({ lang: code }));
}

export default async function NTPage({ params }: { params: Promise<{ lang: Config['locale'] }> }) {
  const { lang } = await params;
  redirect(`/${lang}/`);
}
