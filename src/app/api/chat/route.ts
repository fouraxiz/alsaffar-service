import { NextResponse } from 'next/server';
import { erpEnabled, fetchConversation, postConversationReply } from '@/lib/erpApi';

export const dynamic = 'force-dynamic';

/**
 * Live chat thread for the website widget.
 *
 * Server-proxied so the ERP URL/token never reach the browser. The widget holds the
 * `reply_token` returned by /api/contact and reads it here (poll fallback) or through
 * /api/chat/stream (SSE) — staff replies therefore land in the visitor's chat instead
 * of dying in the CRM.
 */

function tokenFrom(value: string | null): string {
  return (value ?? '').trim();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const replyToken = tokenFrom(searchParams.get('reply_token'));
  const after = Number.parseInt(searchParams.get('after') ?? '0', 10) || 0;

  if (!replyToken) {
    return NextResponse.json({ success: false, messages: [], live: false }, { status: 400 });
  }

  if (!erpEnabled()) {
    return NextResponse.json({ success: true, messages: [], last_id: after, live: false });
  }

  try {
    const conversation = await fetchConversation(replyToken, after);

    return NextResponse.json({ ...conversation, live: true });
  } catch (err) {
    console.warn('[chat] conversation fetch failed:', err);

    // Never break the widget over a backend hiccup — the next tick retries.
    return NextResponse.json({ success: false, messages: [], last_id: after, live: true });
  }
}

export async function POST(request: Request) {
  let body: { reply_token?: string; message?: string };

  try {
    body = (await request.json()) as { reply_token?: string; message?: string };
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const replyToken = tokenFrom(body.reply_token ?? null);
  const message = (body.message ?? '').trim();

  if (!replyToken || !message) {
    return NextResponse.json({ error: 'reply_token and message are required.' }, { status: 400 });
  }

  // Local/demo without an ERP: accept so the visitor is never blocked.
  if (!erpEnabled()) {
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    await postConversationReply(replyToken, message);

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error('[chat] visitor reply failed:', err);

    return NextResponse.json({ error: 'Could not send the message.' }, { status: 502 });
  }
}
