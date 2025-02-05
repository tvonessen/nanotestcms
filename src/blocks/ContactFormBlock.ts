import type { Block } from 'payload';

export const ContactForm: Block = {
  slug: 'contact-form',
  interfaceName: 'ContactForm',
  labels: {
    singular: 'Contact Form',
    plural: 'Contact Forms',
  },
  fields: [
    {
      name: 'to',
      label: 'To',
      type: 'email',
      required: true,
      defaultValue: 'info@nanotest.eu',
    },
    {
      name: 'subject',
      label: 'Subject',
      type: 'text',
      required: false,
      admin: {
        placeholder: 'Inquiry about [this record]',
      },
    },
  ],
};
