import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Page, Solution } from '@/payload-types';

/** Shape of the populated link group field produced by `linkField()`. */
export type CMSLinkData = {
  type?: 'reference' | 'custom' | null;
  reference?:
    | { relationTo: 'solutions'; value: string | Solution }
    | { relationTo: 'pages'; value: string | Page }
    | null;
  url?: string | null;
  newTab?: boolean | null;
  label?: string | null;
  appearance?: string | null;
};

interface CMSLinkProps {
  data?: CMSLinkData | null;
  lang: string;
  className?: string;
  /** Override the link's rendered content; falls back to `data.label`. */
  children?: ReactNode;
}

/**
 * Resolves a `CMSLinkData` object to a plain href string.
 *
 * - `type === 'reference'` + `solutions`: constructs `/{lang}/nt/{slug}`
 * - `type === 'reference'` + `pages`: constructs `/{lang}{page.url}`
 * - `type === 'custom'` (or fallback): returns `data.url` or `'#'`.
 */
export function resolveCMSLinkHref(data: CMSLinkData, lang: string): string {
  if (data.type === 'reference' && data.reference?.value) {
    const ref = data.reference.value;
    if (typeof ref !== 'string') {
      if (data.reference.relationTo === 'solutions') {
        return `/${lang}/nt/${(ref as Solution).slug}`;
      }
      if (data.reference.relationTo === 'pages') {
        return `/${lang}${(ref as Page).url}`;
      }
    }
  }
  return data.url ?? '#';
}

/**
 * Renders a CMS-managed link from the `linkField()` group data.
 *
 * Handles:
 * - Internal (reference) links — builds the correct locale-aware path
 * - External (custom URL) links
 * - `newTab` — adds `target="_blank" rel="noopener noreferrer"`
 * - Falls back to `data.label` when no children are provided
 */
export function CMSLink({ data, lang, className, children }: CMSLinkProps) {
  if (!data) return null;

  const href = resolveCMSLinkHref(data, lang);
  const content = children ?? data.label ?? null;

  if (!content) return null;

  const newTabProps = data.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Link href={href} className={className} {...newTabProps}>
      {content}
    </Link>
  );
}
