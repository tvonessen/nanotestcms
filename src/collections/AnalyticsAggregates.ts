import type { CollectionConfig } from 'payload';
import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { locales } from '@/config/locales';

const localeOptions = locales.map((locale) => ({
  label: locale.label,
  value: locale.code,
}));

export const AnalyticsAggregates: CollectionConfig = {
  slug: 'analytics-aggregates',
  labels: {
    singular: { en: 'Analytics Aggregate', de: 'Analytics-Aggregat' },
    plural: { en: 'Analytics Aggregates', de: 'Analytics-Aggregate' },
  },
  access: {
    create: isLoggedIn,
    read: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  admin: {
    group: 'Analytics',
    useAsTitle: 'compositeKey',
    defaultColumns: [
      'bucketStart',
      'bucketGranularity',
      'path',
      'locale',
      'country',
      'pageviews',
      'uniqueVisitorsApprox',
    ],
    description:
      'Aggregated analytics metrics. This stores privacy-first aggregates rather than full raw events.',
  },
  fields: [
    {
      name: 'compositeKey',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description:
          'Deterministic aggregation key (time bucket + dimensions). Used for upserts in analytics ingestion.',
      },
    },
    {
      name: 'bucketStart',
      type: 'date',
      required: true,
      index: true,
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'bucketGranularity',
      type: 'select',
      required: true,
      defaultValue: 'day',
      index: true,
      options: [
        { label: { en: 'Day', de: 'Tag' }, value: 'day' },
        { label: { en: 'Hour', de: 'Stunde' }, value: 'hour' },
      ],
    },
    {
      name: 'path',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Normalized public path without query string.',
      },
    },
    {
      name: 'locale',
      type: 'select',
      options: localeOptions,
      index: true,
      admin: {
        description: 'Locale extracted from URL when available.',
      },
    },
    {
      name: 'country',
      type: 'text',
      index: true,
      admin: {
        description: 'ISO country code (best effort, usually two-letter uppercase).',
      },
    },
    {
      name: 'region',
      type: 'text',
      admin: {
        description: 'Optional coarse region/state if enabled in settings.',
      },
    },
    {
      name: 'referrerType',
      type: 'select',
      defaultValue: 'unknown',
      index: true,
      options: [
        { label: { en: 'Direct', de: 'Direkt' }, value: 'direct' },
        { label: { en: 'Search', de: 'Suche' }, value: 'search' },
        { label: { en: 'Internal', de: 'Intern' }, value: 'internal' },
        { label: { en: 'External', de: 'Extern' }, value: 'external' },
        { label: { en: 'Unknown', de: 'Unbekannt' }, value: 'unknown' },
      ],
    },
    {
      name: 'deviceClass',
      type: 'select',
      defaultValue: 'unknown',
      index: true,
      options: [
        { label: { en: 'Desktop', de: 'Desktop' }, value: 'desktop' },
        { label: { en: 'Tablet', de: 'Tablet' }, value: 'tablet' },
        { label: { en: 'Mobile', de: 'Mobil' }, value: 'mobile' },
        { label: { en: 'Unknown', de: 'Unbekannt' }, value: 'unknown' },
      ],
    },
    {
      name: 'viewportBucket',
      type: 'select',
      defaultValue: 'unknown',
      index: true,
      options: [
        { label: '≤640', value: 'xs' },
        { label: '641-768', value: 'sm' },
        { label: '769-1024', value: 'md' },
        { label: '1025-1280', value: 'lg' },
        { label: '>1280', value: 'xl' },
        { label: { en: 'Unknown', de: 'Unbekannt' }, value: 'unknown' },
      ],
    },
    {
      name: 'pageviews',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'uniqueVisitorsApprox',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      admin: {
        description: 'Approximation only (privacy-first model, no long-lived per-user tracking).',
      },
    },
    {
      name: 'entryViews',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'lastCollectedAt',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
  ],
};
