import dynamic from 'next/dynamic';
import type { IconProps } from '@phosphor-icons/react';

function toPascalCase(str: string): string {
  return str.replace(/(^\w|-\w)/g, (m) => m.replace(/-/, '').toUpperCase());
}

export function LazyIcon({ name, ...props }: IconProps & { name: string }) {
  const pascalCaseName = toPascalCase(name);
  const Icon = dynamic(
    // @ts-ignore - mod[pascalCaseName] is considered 'any', and I don't know the proper type
    () => import('@phosphor-icons/react/dist/ssr').then((mod) => mod[pascalCaseName]),
    {
      ssr: true,
    },
  );

  return <Icon {...props} />;
}
