import type { CollectionConfig } from 'payload';
import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { Cards } from '@/blocks/CardsBlock';
import { ContactForm } from '@/blocks/ContactFormBlock';
import { Downloads } from '@/blocks/DownloadsBlock';
import { Features } from '@/blocks/FeaturesBlock';
import { Highlight } from '@/blocks/HighlightBlock';
import { Text } from '@/blocks/TextBlock';
import { TextImage } from '@/blocks/TextImageBlock';
import { TextVideo } from '@/blocks/TextVideoBlock';

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    plural: { en: 'Pages', de: 'Seiten' },
    singular: { en: 'Page', de: 'Seite' },
  },
  versions: {
    drafts: {
      autosave: true,
      schedulePublish: true,
      validate: true,
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'parent', 'breadcrumbs'],
  },
  access: {
    create: isLoggedIn,
    read: () => true,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'content',
      type: 'blocks',
      minRows: 1,
      blocks: [Text, TextImage, TextVideo, Cards, Highlight, Features, ContactForm, Downloads],
    },
  ],
};
