import { deepMerge, type Field } from 'payload';

export function alignmentField(overrides: Partial<Field> = {}) {
  const alignmentField: Field = {
    name: 'alignment',
    type: 'select',
    admin: {
      description:
        'Auto: alternates direction relative to the preceding text/text-image/text-video block.',
    },
    options: [
      {
        label: 'Left',
        value: 'left',
      },
      {
        label: 'Right',
        value: 'right',
      },
      {
        label: 'Auto',
        value: 'auto',
      },
    ],
    defaultValue: 'left',
  };
  return deepMerge(alignmentField, overrides);
}
