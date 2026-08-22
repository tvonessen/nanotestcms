import { locales } from '@/config/locales';

export function generateStaticParams() {
  return locales.map(({ code }) => ({ lang: code }));
}
export default async function NewsPage() {}
