"use client";

import type { Config } from '@/payload-types';
import Link from 'next/link';
import {useParams} from "next/navigation";

export default function NotFound() {
  const {lang} = useParams() as {lang: Config['locale']};
  return (
    <div className="container mx-auto my-24 flex flex-col items-center">
      <h1 className="text-2xl text-center">404 - Page Not Found</h1>
      <Link className="btn btn-primary btn-lg mt-12" href={`/${lang}/`}>
        Return home
      </Link>
    </div>
  );
}
