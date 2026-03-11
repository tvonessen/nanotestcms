import { revalidatePath } from 'next/cache';
import type { PayloadRequest } from 'payload';
import { addDataAndFileToRequest } from 'payload';
import { locales } from '@/config/locales';

export default async function revalidateHandler(req: PayloadRequest) {
  await addDataAndFileToRequest(req);

  if (req.method === 'POST') {
    try {
      const body = await req.json?.();
      console.info('### Revalidating: ', body.path);
      revalidatePath(body.path);
      return new Response(JSON.stringify({ revalidated: true }));
    } catch (_err) {
      return new Response(JSON.stringify({ error: 'Error revalidating' }), { status: 500 });
    }
  }
  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
}

export async function revalidateHook(path: string, locale?: string) {
  const validLocale = locale && locales.some((loc) => locale === loc.code);
  const localesToRevalidate = validLocale ? [locale] : locales.map((loc) => loc.code);
  for (const loc of localesToRevalidate) {
    try {
      await fetch(String(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/revalidate`), {
        method: 'post',
        body: JSON.stringify({ path: `/${loc}/${path}`.replaceAll('//', '/') }),
      });
    } catch (err) {
      console.error((err as Error).message);
    }
  }
}
