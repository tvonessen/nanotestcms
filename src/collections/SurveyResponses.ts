import type { CollectionConfig } from 'payload';
import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';

// Temporary collection for the TIM QC survey (hidden URL). Submissions are
// created only by the /api/survey-submit endpoint (overrideAccess), never by
// public API access. The whole survey feature is meant to be removed again
// after a few months.
export const SurveyResponses: CollectionConfig = {
  slug: 'survey-responses',
  labels: {
    singular: { en: 'Survey response', de: 'Umfrage-Antwort' },
    plural: { en: 'Survey responses', de: 'Umfrage-Antworten' },
  },
  access: {
    create: isLoggedIn,
    read: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  admin: {
    group: 'Survey',
    useAsTitle: 'rid',
    defaultColumns: ['rid', 'src', 'lang', 'complete', 'exitAt', 'timeS', 'createdAt'],
    description: 'Anonymous survey answers. Linked to contact details only via RID.',
  },
  fields: [
    {
      name: 'rid',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Random respondent code (XXXX-XXXX), also stored on the contact record.',
      },
    },
    {
      name: 'src',
      type: 'text',
      index: true,
      admin: { description: 'Channel/region from the invitation link (?src=), may be empty.' },
    },
    {
      name: 'lang',
      type: 'select',
      required: true,
      options: [
        { label: 'English', value: 'en' },
        { label: '中文', value: 'zh' },
        { label: '日本語', value: 'ja' },
      ],
      admin: { description: 'Language active when Submit was clicked.' },
    },
    {
      name: 'timeS',
      type: 'number',
      min: 0,
      admin: { description: 'Seconds from "Start the survey" to Submit.' },
    },
    {
      name: 'complete',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: '1 = normal route to the end; unchecked = "Finish now" was used.' },
    },
    {
      name: 'exitAt',
      type: 'text',
      admin: { description: 'Screen ID where "Finish now" was clicked, otherwise empty.' },
    },
    {
      name: 'answers',
      type: 'json',
      required: true,
      admin: {
        description:
          'Flat columns per spec: Q01, Q05_1, Q10_P01, Q12, GATE, G2_1 … (-1 = skipped, empty = not reached)',
      },
    },
  ],
};
