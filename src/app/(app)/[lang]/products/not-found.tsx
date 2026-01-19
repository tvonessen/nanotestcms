"use client";

import { PersonSimpleRunIcon } from '@phosphor-icons/react';
import Link from 'next/link';
import type {Config} from "@/payload-types";
import {useParams} from "next/navigation";

export default function NotFound() {
  const {lang} = useParams() as {lang: Config['locale']};
  return (
    <div className="container mx-auto my-24 flex flex-col items-center justify-start">
      <h1 className="text-2xl text-center">Page not found</h1>
      <p className="mt-6">The solution you were looking for seems not to exist (yet).</p>
      <p className="mt-3">Feel free to propose new ideas to us anytime. :-)</p>
      <Link replace className="btn btn-primary btn-lg mt-12" href={`/${lang}/`}>
        Return home <PersonSimpleRunIcon size={24} />
      </Link>
    </div>
  );
}
