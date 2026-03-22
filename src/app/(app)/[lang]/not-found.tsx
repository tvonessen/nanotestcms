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
      paragraph: 'The page you were looking for does not exist.',
      button: 'Return home',
    },
    de: {
      title: 'Nicht gefunden',
      paragraph: 'Die Seite, die Sie gesucht haben, existiert nicht.',
      button: 'Zur Startseite',
    },
  }[lang];

  return (
    <div className="container mx-auto my-24 flex flex-col items-center">
      <h1 className="text-2xl text-center">{texts.title}</h1>
      <p className="mt-6">{texts.paragraph}</p>
      <Link passHref href={`/${lang}/`}>
        <Button color="primary" size="lg" className="mt-12">
          {texts.button} <PersonSimpleRunIcon size={24} />
        </Button>
      </Link>
    </div>
  );
}
