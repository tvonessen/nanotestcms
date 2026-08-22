import type { CollectionConfig } from 'payload';
import { ContactForm } from '@/blocks/ContactFormBlock';
import { Downloads } from '@/blocks/DownloadsBlock';
import { Features } from '@/blocks/FeaturesBlock';
import { Hero } from '@/blocks/HeroBlock';
import { Highlight } from '@/blocks/HighlightBlock';
import { Text } from '@/blocks/TextBlock';
import { TextImage } from '@/blocks/TextImageBlock';
import { TextVideo } from '@/blocks/TextVideoBlock';
import { slugField } from '@/fields/slugField';
import type { News as NewsDoc } from '@/payload-types';

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News', plural: 'News' },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'general',
          label: { en: 'General', de: 'Allgemein' },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: { en: 'Title', de: 'Titel' },
              required: true,
              localized: true,
            },
            {
              name: 'abstract',
              type: 'textarea',
              label: { en: 'News', de: 'News' },
              required: true,
              localized: true,
            },
          ],
        },
        {
          name: 'newsPage',
          label: { en: 'News Page', de: 'News-Seite' },
          fields: [
            {
              name: 'content',
              type: 'blocks',
              blocks: [
                Hero,
                Text,
                TextImage,
                Highlight,
                TextVideo,
                Downloads,
                ContactForm,
                Features,
              ],
            },
          ],
        },
      ],
    },
    slugField('title'),
  ],
  hooks: {
    afterChange: [
      async ({ doc }: { doc: NewsDoc }) => {
        if (!doc.slug)
          return { ...doc, slug: doc.general.title.replaceAll(' ', '-').toLowerCase() };
        else return doc;
      },
    ],
  },
};
