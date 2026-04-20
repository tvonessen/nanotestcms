import type { CollectionConfig } from 'payload';
import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';

const RESERVED_PREFIXES = ['en', 'de', 'api', 'admin', '_next', 'img', 'fonts', 'nt'];

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  labels: {
    singular: { en: 'Redirect', de: 'Weiterleitung' },
    plural: { en: 'Redirects', de: 'Weiterleitungen' },
  },
  access: {
    create: isLoggedIn,
    read: () => true,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  admin: {
    useAsTitle: 'from',
    defaultColumns: ['from', 'toType', 'enabled', 'permanent'],
    description:
      'Define memorable short URLs (aliases) that redirect visitors to solutions, pages, or external URLs.',
  },
  fields: [
    {
      name: 'from',
      label: { en: 'Alias (short URL)', de: 'Alias (Kurz-URL)' },
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description:
          'The alias path without a leading slash, e.g. "thermal-analysis". No locale prefix required.',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (typeof value !== 'string') return value;
            // Strip leading slash
            return value.replace(/^\/+/, '').toLowerCase().trim();
          },
        ],
      },
      validate: (value: string | null | undefined) => {
        if (!value) return 'Alias is required.';

        const slug = value.replace(/^\/+/, '').toLowerCase().trim();

        if (!/^[a-z0-9-]+$/.test(slug)) {
          return 'Alias may only contain lowercase letters, numbers, and hyphens.';
        }

        if (
          RESERVED_PREFIXES.includes(slug) ||
          RESERVED_PREFIXES.some((p) => slug.startsWith(`${p}/`))
        ) {
          return `"${slug}" conflicts with a reserved path segment (${RESERVED_PREFIXES.join(', ')}). Choose a different alias.`;
        }

        return true;
      },
    },
    {
      name: 'toType',
      label: { en: 'Target type', de: 'Zieltyp' },
      type: 'select',
      required: true,
      defaultValue: 'solution',
      options: [
        { label: { en: 'Solution', de: 'Lösung' }, value: 'solution' },
        { label: { en: 'Page', de: 'Seite' }, value: 'page' },
        { label: { en: 'External URL', de: 'Externe URL' }, value: 'external' },
      ],
    },
    {
      name: 'toSolution',
      label: { en: 'Target Solution', de: 'Ziel-Lösung' },
      type: 'relationship',
      relationTo: 'solutions',
      admin: {
        condition: (data) => data?.toType === 'solution',
        description: 'The solution/product this alias points to.',
      },
    },
    {
      name: 'toPage',
      label: { en: 'Target Page', de: 'Zielseite' },
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        condition: (data) => data?.toType === 'page',
        description: 'The page this alias points to.',
      },
    },
    {
      name: 'toExternal',
      label: { en: 'Target External URL', de: 'Externe Ziel-URL' },
      type: 'text',
      admin: {
        condition: (data) => data?.toType === 'external',
        description: 'Full URL including protocol, e.g. https://example.com/page.',
      },
      validate: (
        value: string | null | undefined,
        { siblingData }: { siblingData: Record<string, unknown> },
      ) => {
        if (siblingData?.toType !== 'external') return true;
        if (!value) return 'External URL is required when target type is "External URL".';
        try {
          new URL(value);
          return true;
        } catch {
          return 'Please enter a valid URL including the protocol (e.g. https://example.com).';
        }
      },
    },
    {
      name: 'enabled',
      label: { en: 'Enabled', de: 'Aktiv' },
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Disable to temporarily deactivate this redirect without deleting it.',
      },
    },
    {
      name: 'permanent',
      label: { en: 'Permanent redirect (308)', de: 'Dauerhafte Weiterleitung (308)' },
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          '⚠️ Permanent redirects are cached indefinitely by browsers and search engines. Though, important for proper SEO. Only enable this when final. It is very difficult to undo after users and crawlers have cached it. Leave unchecked (302 Temporary) while testing.',
      },
    },
  ],
};
