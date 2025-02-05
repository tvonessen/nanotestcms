import deepMerge from '@/utils/deep-merge';
import type { Field } from 'payload';

export function solutionTypeField(overrides: Partial<Field> = {}): Field {
  return deepMerge(
    {
      name: 'type',
      type: 'select',
      options: [
        {
          label: 'Product',
          value: 'product',
        },
        {
          label: 'Service',
          value: 'service',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
    },
    overrides,
  );
}
