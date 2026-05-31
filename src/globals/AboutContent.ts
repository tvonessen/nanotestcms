import type { GlobalConfig } from 'payload';
import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { isPublishedOrLoggedIn } from '@/app/(payload)/access/isPublishedOrLoggedIn';
import { Cards } from '@/blocks/CardsBlock';
import { ContactForm } from '@/blocks/ContactFormBlock';
import { Hero } from '@/blocks/HeroBlock';
import { Text } from '@/blocks/TextBlock';
import { TextImage } from '@/blocks/TextImageBlock';
import { TextVideo } from '@/blocks/TextVideoBlock';
import { buildDraftPreviewURL } from '@/utils/public-url';
import { revalidateHook } from '@/utils/revalidate';

type ObjectLike = Record<string, unknown>;

function normalizeMalformedObjectIds(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => normalizeMalformedObjectIds(entry));
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  const objectValue = value as ObjectLike;

  // Legacy data can contain ObjectId wrappers with a string `id` field
  // that crash BSON serialization (`Cannot create Buffer...`).
  if (
    objectValue._bsontype === 'ObjectId' &&
    typeof objectValue.id === 'string' &&
    objectValue.id.length === 24
  ) {
    return objectValue.id;
  }

  const normalizedEntries = Object.entries(objectValue).map(([key, nestedValue]) => [
    key,
    normalizeMalformedObjectIds(nestedValue),
  ]);

  return Object.fromEntries(normalizedEntries);
}

export const AboutContent: GlobalConfig = {
  slug: 'about',
  label: 'About',
  versions: {
    drafts: {
      autosave: true,
      schedulePublish: true,
    },
    max: 50,
  },
  admin: {
    livePreview: {
      url: ({ locale }) => {
        const redirect = `/${locale?.code ?? 'en'}/about`;
        return buildDraftPreviewURL(redirect);
      },
    },
  },
  access: {
    read: isPublishedOrLoggedIn,
    readVersions: isLoggedIn,
    update: isLoggedIn,
  },
  fields: [
    {
      name: 'content',
      label: 'Content',
      type: 'blocks',
      minRows: 1,
      blocks: [Text, TextImage, TextVideo, Cards, ContactForm, Hero],
    },
    {
      name: 'teamMembers',
      label: 'Team Members',
      type: 'relationship',
      relationTo: 'team-member',
      hasMany: true,
    },
    {
      name: 'content_bottom',
      label: 'Content',
      type: 'blocks',
      minRows: 0,
      blocks: [Text, TextImage, TextVideo, Cards, ContactForm, Hero],
    },
  ],
  hooks: {
    beforeRead: [
      ({ doc }) => {
        if (!doc) return doc;
        return normalizeMalformedObjectIds(doc);
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        if (doc._status === 'draft') return;
        await revalidateHook('/about', req.locale);
      },
    ],
  },
};
