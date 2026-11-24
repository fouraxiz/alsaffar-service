import { serverEnv } from '@/lib/env';

export const dynamic = 'force-dynamic';

/**
 * Server-Sent Events proxy for the website chat widget.
 *
 * The ERP pushes a staff reply the moment it is stored; streaming it through this
 * handler gives the visitor the message in about a second and keeps the ERP base URL
 * and token server-side. Closing the widget closes the upstream connection.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const replyToken = (searchParams.get('reply_token') ?? '').trim();
  const after = Number.parseInt(searchParams.get('after') ?? '0', 10) || 0;

  if (!replyToken || !serverEnv.erp.enabled) {
    // 204 → EventSource raises an error and the widget falls back to polling.
    return new Response(null, { status: 204 });
  }

  const url =
    `${serverEnv.erp.baseUrl}/api/website/v1/leads/conversation/stream` +
    `?reply_token=${encodeURIComponent(replyToken)}&after=${after}`;

  try {
    const upstream = await fetch(url, {
      headers: { Accept: 'text/event-stream' },
      cache: 'no-store',
      signal: request.signal,
    });

    if (!upstream.ok || !upstream.body) {
      return new Response(null, { status: 204 });
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-store, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (err) {
    console.warn('[chat] stream proxy failed:', err);

    return new Response(null, { status: 204 });
  }
}
