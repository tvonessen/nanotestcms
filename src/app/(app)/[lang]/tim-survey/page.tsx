import type { Metadata } from 'next';
import { Suspense } from 'react';
import SurveyPage from '@/components/survey/survey-page';
import { locales } from '@/config/locales';
import type { Config } from '@/payload-types';

// Hidden survey URL: not linked in any navigation, excluded from indexing.
// Temporary feature — remove the whole tim-survey folder, the survey components
// and the two survey collections + endpoint again after the survey closes.
export const metadata: Metadata = {
  title: 'TIM QC Survey — Nanotest',
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return locales.map(({ code }) => ({ lang: code }));
}

interface TimSurveyPageProps {
  params: Promise<{ lang: Config['locale'] }>;
}

export default async function TimSurveyPage({ params }: TimSurveyPageProps) {
  const { lang } = await params;
  return (
    <Suspense fallback={null}>
      <SurveyPage siteLang={lang} />
    </Suspense>
  );
}
