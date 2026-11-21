'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import SurveyApp from './survey-app';

export default function SurveyPage({ siteLang }: { siteLang: string }) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? 'NOT DEFINED'}
    >
      <SurveyApp siteLang={siteLang} />
    </GoogleReCaptchaProvider>
  );
}
