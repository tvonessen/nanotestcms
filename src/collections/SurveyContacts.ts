import type { CollectionConfig } from 'payload';
import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';

// Temporary collection for the TIM QC survey (hidden URL). Stored separately
// from survey-responses and linked only via RID. Created only by the
// /api/survey-submit endpoint when at least one final-screen option is ticked.
export const SurveyContacts: CollectionConfig = {
  slug: 'survey-contacts',
  labels: {
    singular: { en: 'Survey contact', de: 'Umfrage-Kontakt' },
    plural: { en: 'Survey contacts', de: 'Umfrage-Kontakte' },
  },
  access: {
    create: isLoggedIn,
    read: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  admin: {
    group: 'Survey',
    useAsTitle: 'email',
    defaultColumns: ['email', 'rid', 'name', 'company', 'country', 'createdAt'],
    description:
      'Optional contact details from the survey final screen. Never stored together with answers. CSV export via the buttons above the list.',
    components: {
      beforeListTable: [{ path: '@/components/survey/export-buttons' }],
    },
  },
  fields: [
    {
      name: 'rid',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Random respondent code — the only link to the survey-responses record.',
      },
    },
    { name: 'email', type: 'email', required: true },
    { name: 'name', type: 'text' },
    { name: 'company', type: 'text' },
    { name: 'country', type: 'text' },
    { name: 'wantsSummary', type: 'checkbox', defaultValue: false },
    { name: 'wantsInterview', type: 'checkbox', defaultValue: false },
    { name: 'wantsPrototype', type: 'checkbox', defaultValue: false },
    {
      name: 'consentLaunch',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Also send information when the device launches.' },
    },
  ],
};
