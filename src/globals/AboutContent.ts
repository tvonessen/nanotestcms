import { Cards } from '@/blocks/CardsBlock';
import { Text } from '@/blocks/TextBlock';
import { TextImage } from '@/blocks/TextImageBlock';
import { TextVideo } from '@/blocks/TextVideoBlock';
import type { GlobalConfig } from 'payload';

export const AboutContent: GlobalConfig = {
  slug: 'about',
  label: 'About',
  fields: [
    {
      name: 'content',
      label: 'Content',
      type: 'blocks',
      minRows: 1,
      blocks: [Text, TextImage, TextVideo, Cards],
    },
  ],
};
