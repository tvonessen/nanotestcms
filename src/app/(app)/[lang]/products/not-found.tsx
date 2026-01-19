import { PersonSimpleRunIcon } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

interface NotFoundProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function NotFound(props: NotFoundProps) {
  const { lang } = await props.params;
  return (
    <div className="container mx-auto my-24 flex flex-col items-center justify-start">
      <h1 className="text-2xl text-center">Page not found</h1>
      <p className="mt-6">The solution you were looking for seems not to exist (yet).</p>
      <p className="mt-3">Feel free to propose new ideas to us anytime. :-)</p>
      <Link className="btn btn-primary btn-lg mt-12" href={`/${lang}/`}>
        Return home <PersonSimpleRunIcon size={24} />
      </Link>
    </div>
  );
}
