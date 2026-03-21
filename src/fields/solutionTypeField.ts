import type { Field } from 'payload';
import deepMerge from '@/utils/deep-merge';

export const SolutionTypes = ['product', 'service', 'other'];

export function solutionTypeField(overrides: Partial<Field> = {}): Field {
  return deepMerge(
    {
      name: 'type',
      type: 'select',
      options: SolutionTypes.map((type) => ({
        value: type,
        label: type.slice(0, 1).toUpperCase() + type.slice(1),
      })),
    },
    overrides,
  );
}
