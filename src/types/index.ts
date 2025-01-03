import { IconProps } from '@phosphor-icons/react';
import type React from 'react';

export type ProductProps = {
  title: string;
  subtitle: string;
  description: string;
  article: React.ReactNode;
  image: { url: string; width?: number; height?: number };
  href: string;
  categoryId: number;
  new?: boolean;
};
