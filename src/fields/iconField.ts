import deepMerge from '@/utilies/deepMerge';
import { icons } from '@phosphor-icons/core';
import type { Field, OptionObject } from 'payload';

export function iconField(overrides: Partial<Field> = {}): Field {
  const iconField: Field = {
    name: 'icon',
    type: 'select',
    options: icons.map(
      (icon): OptionObject => ({
        label: icon.pascal_name,
        value: icon.name,
      }),
    ),
  };
  return deepMerge(iconField, overrides);
}
