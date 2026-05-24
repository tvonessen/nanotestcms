import { readFile } from 'node:fs/promises';
import path from 'node:path';

export async function GET() {
  const iconPath = path.join(process.cwd(), 'public', 'img', 'favicon.svg');

  try {
    const icon = await readFile(iconPath);

    return new Response(icon, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=0',
      },
    });
  } catch {
    return new Response('Not Found', { status: 404 });
  }
}
