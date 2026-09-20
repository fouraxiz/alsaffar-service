import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { postLead, erpEnabled } from '@/lib/erpApi';

/**
 * Mirror a public website message into the ERP CRM as a Lead.
 * Used by Contact Us, live chat, nationality requests, and similar forms.
 */
async function mirrorLeadToCrm(payload: {
  name: string;
  phone: string;
  service: string;
  message: string;
  medium: string;
  source: string;
  landingPath: string;
}): Promise<boolean> {
  if (!erpEnabled()) return false;
  try {
    await postLead({
      name: payload.name,
      phone: payload.phone,
      service_key: payload.service || null,
      message: payload.message || null,
      id_number: null,
      filters: null,
      utm: {
        utm_source: payload.source,
        utm_medium: payload.medium,
        landing_path: payload.landingPath,
      },
    });
    return true;
  } catch (err) {
    console.error('[contact] CRM lead mirror failed:', err);
    return false;
  }
}

type ContactPayload = {
  name?: string;
  phone?: string;
  service?: string;
  message?: string;
  /** CRM attribution — contact | chatbot | nationality | … */
  medium?: string;
  source?: string;
  landing_path?: string;
  // Honeypot — must stay empty. Bots tend to fill every field.
  website?: string;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const name = (body.name ?? '').trim();
  const phone = (body.phone ?? '').trim();
  const service = (body.service ?? '').trim();
  const message = (body.message ?? '').trim();
  const medium = (body.medium ?? 'contact').trim() || 'contact';
  const source = (body.source ?? 'website').trim() || 'website';
  const landingPath = (body.landing_path ?? '/contact').trim() || '/contact';

  // Honeypot: silently accept so the bot thinks it succeeded, but send nothing.
  if (body.website && body.website.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  // Server-side validation (never trust the client).
  if (!name || !phone) {
    return NextResponse.json(
      { error: 'Name and phone are required.' },
      { status: 400 }
    );
  }

  let emailed = false;
  let crm = false;

  // 1) Always try CRM first so leads appear even when email is misconfigured.
  crm = await mirrorLeadToCrm({
    name,
    phone,
    service,
    message,
    medium,
    source,
    landingPath,
  });

  // 2) Best-effort email to the team (non-blocking for CRM success).
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const to = process.env.CONTACT_TO_EMAIL || 'support@alsaffar.pro';
    const from = process.env.CONTACT_FROM_EMAIL || 'Alsaffar Website <onboarding@resend.dev>';
    const serviceLabel = service || '—';
    const messageLabel = message || '—';
    const channelLabel = medium === 'contact' ? 'Contact form' : medium;

    const html = `
    <div style="font-family: Arial, sans-serif; color: #1A1F00; line-height: 1.6;">
      <h2 style="margin: 0 0 16px;">New website message — Alsaffar (${escapeHtml(channelLabel)})</h2>
      <table style="border-collapse: collapse;">
        <tr><td style="padding: 4px 12px 4px 0; font-weight: bold;">Name</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; font-weight: bold;">Phone</td><td>${escapeHtml(phone)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; font-weight: bold;">Service</td><td>${escapeHtml(serviceLabel)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; font-weight: bold;">Channel</td><td>${escapeHtml(channelLabel)}</td></tr>
      </table>
      <p style="margin: 16px 0 4px; font-weight: bold;">Message</p>
      <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(messageLabel)}</p>
    </div>
  `;

    try {
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from,
        to,
        subject: `New ${channelLabel} message from ${name}`,
        html,
      });
      if (error) {
        console.error('[contact] Resend error:', error);
      } else {
        emailed = true;
      }
    } catch (err) {
      console.error('[contact] Email failed:', err);
    }
  } else {
    console.warn('[contact] RESEND_API_KEY is not set — skipping email; CRM path used if enabled.');
  }

  if (!emailed && !crm) {
    if (!apiKey && !erpEnabled()) {
      console.warn('[contact] No email or CRM configured; accepting for local/demo.');
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true, crm, emailed });
}
