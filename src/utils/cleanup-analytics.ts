import { APIError, type PayloadRequest } from 'payload';

const BATCH_SIZE = 200;

function computeCutoffISOString(retentionDays: number) {
  return new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000).toISOString();
}

export const cleanupAnalyticsEndpoint = async (req: PayloadRequest): Promise<Response> => {
  if (!req.user) {
    throw new APIError('Unauthorized', 401);
  }

  const settings = await req.payload.findGlobal({
    slug: 'analytics-settings',
    depth: 0,
    overrideAccess: true,
  });

  const retentionDays = settings.retentionDays;
  const cutoff = computeCutoffISOString(retentionDays);
  let deleted = 0;

  while (true) {
    const batch = await req.payload.find({
      collection: 'analytics-aggregates',
      depth: 0,
      pagination: false,
      limit: BATCH_SIZE,
      overrideAccess: true,
      where: {
        bucketStart: {
          less_than: cutoff,
        },
      },
    });

    if (!batch.docs.length) {
      break;
    }

    for (const doc of batch.docs) {
      await req.payload.delete({
        collection: 'analytics-aggregates',
        id: doc.id,
        overrideAccess: true,
      });
      deleted += 1;
    }
  }

  const responseData = {
    success: true,
    retentionDays,
    cutoff,
    deleted,
  };

  if ((req.headers.get('accept') ?? '').includes('text/html')) {
    return new Response(null, {
      status: 303,
      headers: {
        'Cache-Control': 'no-store',
        Location: '/admin/analytics',
      },
    });
  }

  return Response.json(responseData, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
};
