import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Solution } from '@/payload-types';

/** Shape of the populated link group field produced by `linkField()`. */
export type CMSLinkData = {
  type?: 'reference' | 'custom' | null;
  reference?: {
    relationTo: 'solutions';
    value: string | Solution;
  } | null;
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
 * - `type === 'reference'`: constructs `/{lang}/nt/{slug}` from the
 *   populated Solution document.
 * - `type === 'custom'` (or fallback): returns `data.url` or `'#'`.
 */
export function resolveCMSLinkHref(data: CMSLinkData, lang: string): string {
  if (data.type === 'reference' && data.reference?.value) {
    const ref = data.reference.value;
    if (typeof ref !== 'string') {
      return `/${lang}/nt/${(ref as Solution).slug}`;
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
