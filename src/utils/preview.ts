import { cookies, draftMode } from 'next/headers';

/**
 * Returns true only when Next.js draft mode is enabled AND an active Payload
 * session cookie is present. This ensures draft content is never served after
 * the editor logs out of the admin, even if the draftMode cookie is still set.
 */
export async function isPreviewEnabled(): Promise<boolean> {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return false;

  const cookieStore = await cookies();
  return cookieStore.has('payload-token');
}

