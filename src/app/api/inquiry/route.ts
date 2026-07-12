import { NextResponse } from 'next/server';

import { postLead, erpEnabled } from '@/lib/erpApi';

/**
 * "No match" / specific-worker request from the Browse-CVs flow. Captured as a
 * CRM lead (source website-no-match). Server-side so nothing leaks; best-effort
 * so the user always sees success even if the ERP is temporarily unreachable.
 */
export async function POST(request: Request) {
  let body: {
    phone?: string;
    description?: string;
    idNumber?: string;
    filters?: string;
    website?: string; // honeypot
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  // Honeypot: silently accept.
  if (body.website && body.website.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const phone = (body.phone ?? '').trim();
  if (!phone) {
    return NextResponse.json({ error: 'Phone is required.' }, { status: 400 });
  }

  if (erpEnabled()) {
    try {
      const messageParts = [
        body.description ? `Request: ${body.description}` : null,
        body.idNumber ? `ID: ${body.idNumber}` : null,
        body.filters ? `Filters: ${body.filters}` : null,
      ].filter(Boolean);

      await postLead({
        name: 'Website visitor',
        phone,
        message: messageParts.join(' | ') || 'Specific worker request',
        source: 'website-no-match',
      });
    } catch (err) {
      console.error('[inquiry] CRM lead failed (non-fatal):', err);
    }
  }

  return NextResponse.json({ ok: true });
}
