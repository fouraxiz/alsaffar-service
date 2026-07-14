import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * On-demand ISR webhook for the ERP WebsiteApi PingVercelRevalidate job.
 * Expects POST { paths: string[] } with header X-Revalidate-Secret.
 *
 * Configure in ERP: WebsiteApi → Settings →
 *   vercel_revalidate_url = https://alsaffar-service.vercel.app/api/revalidate
 *   vercel_revalidate_secret = same value as REVALIDATE_SECRET here.
 */
export async function POST(request: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET ?? '';
  const provided = request.headers.get('x-revalidate-secret') ?? '';

  if (!expected || provided !== expected) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  let paths: string[] = [];
  try {
    const body = (await request.json()) as { paths?: unknown };
    if (Array.isArray(body.paths)) {
      paths = body.paths.filter((p): p is string => typeof p === 'string' && p.startsWith('/'));
    }
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
  }

  if (paths.length === 0) {
    return NextResponse.json({ success: false, message: 'No paths' }, { status: 400 });
  }

  const revalidated: string[] = [];
  for (const path of paths) {
    try {
      revalidatePath(path);
      revalidated.push(path);
    } catch (err) {
      console.error('[revalidate] failed for', path, err);
    }
  }

  // Also bust the proxied API route caches that back client sections.
  for (const api of ['/api/services', '/api/banners', '/api/countries', '/api/workers', '/api/site']) {
    try {
      revalidatePath(api);
      revalidated.push(api);
    } catch {
      /* ignore */
    }
  }

  return NextResponse.json({ success: true, revalidated });
}
