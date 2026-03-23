'use client';

import { Button } from '@heroui/react';
import { PersonSimpleRunIcon } from '@phosphor-icons/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { Config } from '@/payload-types';

export default function NotFound() {
  const { lang } = useParams() as { lang: Config['locale'] };

  const texts = {
    en: {
      title: 'Not found',
      paragraph: 'The solution you were looking for seems not to exist (yet).',
      hint: 'Feel free to propose new ideas to us anytime. :-)',
      button: 'Return home',
    },
    de: {
      title: 'Nicht gefunden',
      paragraph: 'Die gesuchte Lösung scheint (noch) nicht zu existieren.',
      hint: 'Schlagen Sie uns jederzeit gerne neue Ideen vor. :-)',
      button: 'Zur Startseite',
    },
  }[lang];

  return (
    <div className="container mx-auto my-24 flex flex-col items-center justify-start">
      <h1 className="text-2xl text-center">{texts.title}</h1>
      <p className="mt-6">{texts.paragraph}</p>
      <p className="mt-3">{texts.hint}</p>
      <Link replace passHref href={`/${lang}/`}>
        <Button color="primary" size="lg" className="mt-12">
          {texts.button} <PersonSimpleRunIcon size={24} />
        </Button>
      </Link>
    </div>
  );
}
