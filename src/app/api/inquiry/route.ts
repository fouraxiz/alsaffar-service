import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { postLead, erpEnabled } from '@/lib/erpApi';
import { serverEnv } from '@/lib/env';

/**
 * "No match" / specific-worker request from the Browse-CVs flow. Captured as a
 * CRM lead (source website-no-match) and emailed to the recruitment team.
 * Server-side so nothing leaks.
 */
const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

async function emailTeam(payload: {
  phone: string;
  description: string;
  idNumber: string;
  filters: string;
}): Promise<boolean> {
  const apiKey = serverEnv.resend.apiKey;
  if (!apiKey) return false;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1A1F00; line-height: 1.6;">
      <h2 style="margin: 0 0 16px;">New no-match lead — Browse CVs</h2>
      <p style="margin: 0 0 16px;">A visitor filtered workers that were out of scope and submitted a follow-up request.</p>
      <table style="border-collapse: collapse;">
        <tr><td style="padding: 4px 12px 4px 0; font-weight: bold;">Phone</td><td>${escapeHtml(payload.phone)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; font-weight: bold;">ID Number</td><td>${escapeHtml(payload.idNumber)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; font-weight: bold;">Filters</td><td>${escapeHtml(payload.filters || '—')}</td></tr>
      </table>
      <p style="margin: 16px 0 4px; font-weight: bold;">What they are looking for</p>
      <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(payload.description)}</p>
    </div>
  `;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: serverEnv.resend.from,
    to: serverEnv.resend.to,
    subject: `No-match lead from Browse CVs — ${payload.phone}`,
    html,
  });

  if (error) {
    console.error('[inquiry] Resend error:', error);
    return false;
  }
  return true;
}

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
  const description = (body.description ?? '').trim();
  const idNumber = (body.idNumber ?? '').trim();
  const filters = (body.filters ?? '').trim();

  if (!phone || !description || !idNumber) {
    return NextResponse.json(
      { error: 'Phone, description and ID number are required.' },
      { status: 400 },
    );
  }

  let emailed = false;
  let crm = false;

  if (serverEnv.resend.apiKey) {
    try {
      emailed = await emailTeam({ phone, description, idNumber, filters });
    } catch (err) {
      console.error('[inquiry] Email failed:', err);
    }
  }

  if (erpEnabled()) {
    try {
      const messageParts = [
        description ? `Request: ${description}` : null,
        idNumber ? `ID: ${idNumber}` : null,
        filters ? `Filters: ${filters}` : null,
      ].filter(Boolean);

      await postLead({
        name: 'Website visitor',
        phone,
        message: messageParts.join(' | ') || 'Specific worker request',
        service_key: 'browse-cv-no-match',
        utm: {
          utm_source: 'website',
          utm_medium: 'no-match',
          landing_path: '/request-cv',
        },
      });
      crm = true;
    } catch (err) {
      console.error('[inquiry] CRM lead failed:', err);
    }
  }

  if (!emailed && !crm) {
    if (!serverEnv.resend.apiKey && !erpEnabled()) {
      console.warn('[inquiry] No email or CRM configured; accepting request for local/demo.');
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: 'Failed to send request.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
