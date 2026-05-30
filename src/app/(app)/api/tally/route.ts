import {
  GET as analyticsCollectGet,
  POST as analyticsCollectPost,
} from '@/app/(app)/api/analytics/collect/route';

export async function POST(request: Request) {
  return analyticsCollectPost(request);
}

export async function GET() {
  return analyticsCollectGet();
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';
