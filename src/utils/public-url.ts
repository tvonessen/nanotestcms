function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

export const publicServerURL = trimTrailingSlash(process.env.NEXT_PUBLIC_SERVER_URL ?? '');

export function buildPublicURL(path?: string): string {
  if (!path) {
    return publicServerURL;
  }

  const normalizedPath = normalizePath(path);

  if (!publicServerURL) {
    return normalizedPath;
  }

  return `${publicServerURL}${normalizedPath}`;
}

export function buildDraftPreviewURL(redirect: string): string {
  const searchParams = new URLSearchParams({ redirect });

  return `${buildPublicURL('/api/draft')}?${searchParams.toString()}`;
}

export function resolveAssetURL(url?: string | null): string {
  if (!url) {
    return '';
  }

  if (url.startsWith('/')) {
    return url;
  }

  try {
    const parsedURL = new URL(url);

    if (publicServerURL && parsedURL.origin === publicServerURL) {
      return `${parsedURL.pathname}${parsedURL.search}${parsedURL.hash}`;
    }

    return parsedURL.toString();
  } catch {
    return url;
  }
}
