import type { Config } from '@/payload-types';
import Link from 'next/link';

interface HomePageProps {
  params: Promise<{
    lang: Config['locale'];
  }>;
}

export default async function NotFound({ params }: HomePageProps) {
  const { lang } = await params;
  return (
    <div className="container mx-auto my-24 flex flex-col items-center">
      <h1 className="text-2xl text-center">404 - Page Not Found</h1>
      <Link className="btn btn-primary btn-lg mt-12" href={`/${lang}/`}>
        Return home
      </Link>
    </div>
  );
}
