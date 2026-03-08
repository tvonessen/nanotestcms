import config from '@payload-config';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPayload } from 'payload';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectPath = searchParams.get('redirect') || '/';

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(redirectPath);
}

export async function DELETE(_request: Request) {
  const draft = await draftMode();
  draft.disable();
  return new Response(null, { status: 204 });
}
