import { buildPublicURL, publicServerURL } from '@/utils/public-url';

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

export const internalServerURL = trimTrailingSlash(
  process.env.INTERNAL_SERVER_URL ?? publicServerURL,
);

export function buildInternalURL(path: string): string {
  const normalizedPath = normalizePath(path);

  if (!internalServerURL) {
    return buildPublicURL(normalizedPath);
  }

  return `${internalServerURL}${normalizedPath}`;
}
