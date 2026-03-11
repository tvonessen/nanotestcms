import type { Field, GroupField } from 'payload';
import deepMerge from '@/utils/deep-merge';

export type LinkAppearance = 'flat' | 'light' | 'solid' | 'bordered' | 'faded' | 'shadow' | 'ghost';

type LinkFieldOptions = {
  /**
   * Pass an array of appearances to show an appearance select, or `false` to omit it entirely.
   * Defaults to ['default', 'outline'] when omitted.
   */
  appearances?: LinkAppearance[] | false;
  /** When true, omits the label text field from the group. */
  disableLabel?: boolean;
  /** Deep-merged into the generated GroupField — use to rename the field or add admin options. */
  overrides?: Partial<GroupField>;
};

/**
 * Reusable link field factory following the Payload CMS website-template pattern.
 *
 * Produces a `group` field named `link` (by default) with:
 *  - `type`      radio  — 'reference' (internal) | 'custom' (external URL)
 *  - `reference` relationship to `solutions` — visible when type === 'reference'
 *  - `url`       text   — visible when type === 'custom'
 *  - `newTab`    checkbox
 *  - `label`     localized text (unless disableLabel)
 *  - `appearance` select (unless appearances === false)
 */
export const linkField = ({
  appearances,
  disableLabel = false,
  overrides = {},
}: LinkFieldOptions = {}): Field => {
  const field: GroupField = {
    name: 'link',
    type: 'group',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            label: 'Link Type',
            options: [
              { label: 'Internal link', value: 'reference' },
              { label: 'Custom URL', value: 'custom' },
            ],
            defaultValue: 'custom',
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
          },
          {
            name: 'newTab',
            type: 'checkbox',
            label: 'Open in new tab',
            admin: {
              width: '50%',
              style: { alignSelf: 'flex-end' },
            },
          },
        ],
      },
      {
        name: 'reference',
        type: 'relationship',
        label: 'Document to link to',
        relationTo: ['solutions'],
        maxDepth: 1,
        required: true,
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'reference',
        },
      },
      {
        name: 'url',
        type: 'text',
        label: 'URL',
        required: true,
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'custom',
        },
      },
    ],
  };

  if (!disableLabel) {
    field.fields.push({
      name: 'label',
      type: 'text',
      label: 'Link Label',
      required: true,
      defaultValue: ({ locale }) =>
        ({
          en: 'Learn more',
          de: 'Mehr erfahren',
        })[locale || 'en'],
      localized: true,
    });
  }

  if (appearances !== false) {
    const effectiveAppearances: LinkAppearance[] = appearances ?? [
      'flat',
      'light',
      'solid',
      'bordered',
      'faded',
      'shadow',
      'ghost',
    ];
    field.fields.push({
      name: 'appearance',
      type: 'select',
      label: 'Appearance',
      defaultValue: 'solid',
      admin: {
        isClearable: false,
      },
      options: effectiveAppearances.map((value) => ({
        label: value.charAt(0).toUpperCase() + value.slice(1),
        value,
      })),
    });
  }

  return deepMerge(field, overrides) as Field;
};
