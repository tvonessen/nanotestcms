import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { publishedOrLoggedIn } from '@/app/(payload)/access/publishedOrLoggedIn';
import { ContactForm } from '@/blocks/ContactFormBlock';
import { Text } from '@/blocks/TextBlock';
import { TextImage } from '@/blocks/TextImageBlock';
import { TextVideo } from '@/blocks/TextVideoBlock';
import type { GlobalConfig, Tab } from 'payload';

export const ContactUsContent: GlobalConfig = {
  slug: 'contact-us',
  label: 'Contact Us',
  access: {
    read: publishedOrLoggedIn,
    readDrafts: isLoggedIn,
    readVersions: isLoggedIn,
    update: isLoggedIn,
  },
  versions: {
    drafts: {
      autosave: false,
      schedulePublish: true,
    },
    max: 10,
  },
  fields: [
    {
      name: 'content',
      label: 'Content',
      type: 'blocks',
      blocks: [Text, TextImage, TextVideo, ContactForm],
    },
    {
      label: 'Regions',
      type: 'tabs',
      tabs: [
        'Europe',
        'North and South America',
        'Asia and Australia',
        'Africa and Middle East',
      ].map(
        (region: string) =>
          ({
            name: region.toLowerCase().replace(/ /g, '-'),
            label: region,
            fields: [
              {
                name: 'contacts',
                label: 'Contacts and distribution partners',
                type: 'array',
                admin: {
                  initCollapsed: true,
                },
                fields: [
                  { name: 'country', label: 'Country', type: 'text', required: true },
                  {
                    name: 'contact',
                    label: 'Contact',
                    type: 'relationship',
                    required: true,
                    relationTo: ['distro-partner', 'team-member'],
                  },
                ],
              },
            ],
          }) as Tab,
      ),
    },
  ],
};
