import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { postLead, erpEnabled } from '@/lib/erpApi';

/**
 * Best-effort mirror of a contact submission into the ERP CRM as a Lead.
 * Never throws to the caller — email is the source of truth for the reply,
 * the CRM lead is an additive capture. Runs server-side so no token leaks.
 */
async function mirrorLeadToCrm(payload: {
  name: string;
  phone: string;
  service: string;
  message: string;
}): Promise<void> {
  if (!erpEnabled()) return;
  try {
    await postLead({
      name: payload.name,
      phone: payload.phone,
      service_type: payload.service || null,
      message: payload.message || null,
      source: 'website-contact',
    });
  } catch (err) {
    console.error('[contact] CRM lead mirror failed (non-fatal):', err);
  }
}

type ContactPayload = {
  name?: string;
  phone?: string;
  service?: string;
  message?: string;
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

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY is not set');
    return NextResponse.json(
      { error: 'Email service is not configured.' },
      { status: 500 }
    );
  }

  const to = process.env.CONTACT_TO_EMAIL || 'support@alsaffar.pro';
  // From must be a verified domain in Resend; falls back to Resend's shared
  // sandbox sender until alsaffar.pro is verified.
  const from = process.env.CONTACT_FROM_EMAIL || 'Alsaffar Website <onboarding@resend.dev>';

  const serviceLabel = service || '—';
  const messageLabel = message || '—';

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1A1F00; line-height: 1.6;">
      <h2 style="margin: 0 0 16px;">New contact message — Alsaffar website</h2>
      <table style="border-collapse: collapse;">
        <tr><td style="padding: 4px 12px 4px 0; font-weight: bold;">Name</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; font-weight: bold;">Phone</td><td>${escapeHtml(phone)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; font-weight: bold;">Service</td><td>${escapeHtml(serviceLabel)}</td></tr>
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
      subject: `New contact message from ${name}`,
      html,
    });

    if (error) {
      console.error('[contact] Resend error:', error);
      return NextResponse.json({ error: 'Failed to send message.' }, { status: 502 });
    }

    // Additive: also capture the enquiry as a CRM lead (best-effort, non-fatal).
    await mirrorLeadToCrm({ name, phone, service, message });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] Unexpected error:', err);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
