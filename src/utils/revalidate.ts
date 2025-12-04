import { revalidatePath } from 'next/cache';
import { addDataAndFileToRequest } from 'payload';
import type { PayloadRequest } from 'payload';

export default async function revalidateHandler(req: PayloadRequest) {

  await addDataAndFileToRequest(req);

  if (req.method === 'POST') {
    try {
      const body = await req.json?.();
      revalidatePath(body.path);
      return new Response(JSON.stringify({ revalidated: true }));
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Error revalidating' }), { status: 500 });
    }
  }
  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
}

export async function revalidateHook(path: string) {
  try {
    const response = await fetch(
      String(
        `${process.env.NODE_ENV === 'development' ? process.env.NEXT_DEV_SERVER_URL : process.env.NEXT_PUBLIC_SERVER_URL}/api/revalidate`,
      ),
      {
        method: 'post',
        body: JSON.stringify({ path }),
      },
    );
    if (!response.ok) {
      throw new Error(`Error while revalidating path '${path}'`);
    }
  } catch (err) {
    throw new Error((err as Error).message);
  }
}
