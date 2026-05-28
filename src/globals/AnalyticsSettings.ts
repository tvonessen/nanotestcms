import type { GlobalConfig } from 'payload';
import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';

export const AnalyticsSettings: GlobalConfig = {
  slug: 'analytics-settings',
  label: 'Analytics Settings',
  access: {
    read: isLoggedIn,
    update: isLoggedIn,
  },
  admin: {
    group: 'Analytics',
    description:
      'Privacy-first analytics configuration. Keep settings conservative unless legal requirements are explicitly reviewed.',
  },
  fields: [
    {
      name: 'enabled',
      label: 'Enable analytics collection',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'excludedPathPrefixes',
      label: 'Excluded path prefixes',
      type: 'array',
      admin: {
        description:
          'Requests whose normalized path starts with any of these prefixes will be ignored.',
      },
      defaultValue: [
        { prefix: '/admin' },
        { prefix: '/api' },
        { prefix: '/_next' },
        { prefix: '/img' },
        { prefix: '/static' },
      ],
      fields: [
        {
          name: 'prefix',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'retentionDays',
      label: 'Retention (days)',
      type: 'number',
      required: true,
      defaultValue: 750,
      min: 1,
      admin: {
        description:
          'Target maximum age for analytics aggregates. Future cleanup jobs should delete older data.',
      },
    },
    {
      name: 'allowRegionGranularity',
      label: 'Allow region-level geo breakdown',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Keep disabled by default to minimize geo precision. (better privacy)',
      },
    },
    {
      name: 'storeRawEvents',
      label: 'Store raw events (advanced)',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Disabled by default. Aggregates are preferred. Raw events should only be enabled with short TTL.',
      },
    },
    {
      name: 'rawEventTtlHours',
      label: 'Raw event TTL (hours)',
      type: 'number',
      min: 1,
      defaultValue: 24,
      admin: {
        condition: (_data, siblingData) => Boolean(siblingData?.storeRawEvents),
      },
    },
    {
      name: 'notes',
      label: 'Operational notes',
      type: 'textarea',
      admin: {
        description:
          'Document legal basis, consent strategy, and assumptions for analytics operation.',
      },
    },
  ],
};
