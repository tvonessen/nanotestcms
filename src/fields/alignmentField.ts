import { deepMerge, type Field } from 'payload';

export function alignmentField(overrides: Partial<Field> = {}) {
  const alignmentField: Field = {
    name: 'alignment',
    type: 'select',
    admin: {
      description: '*Work in progress* - Auto alignment not yet available',
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
    validate: (value: unknown) => value !== 'auto' || 'Automatic alignment is not yet available.',
  };
  return deepMerge(alignmentField, overrides);
}
