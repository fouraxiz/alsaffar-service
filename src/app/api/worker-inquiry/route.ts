import { NextResponse } from 'next/server';

import { postWorkerInquiry, erpEnabled } from '@/lib/erpApi';

/**
 * "Continue to Recruit" — creates a CRM lead via ERP and attaches Visa / National ID
 * to Lead → Files (multipart). Filenames are not dumped into lead notes.
 */
export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 });
  }

  const website = String(form.get('website') ?? '').trim();
  if (website !== '') {
    return NextResponse.json({ ok: true });
  }

  const workerCode = String(form.get('worker_code') ?? '').trim();
  const name = String(form.get('name') ?? '').trim();
  const phone = String(form.get('phone') ?? '').trim();
  const email = String(form.get('email') ?? '').trim();
  const city = String(form.get('city') ?? '').trim();
  const address = String(form.get('address') ?? '').trim();
  const workerName = String(form.get('worker_name') ?? '').trim();
  const locale = String(form.get('locale') ?? 'en') === 'ar' ? 'ar' : 'en';

  const visa = form.get('visa');
  const nationalId = form.get('national_id') ?? form.get('id');

  if (!workerCode || !name || !phone) {
    return NextResponse.json(
      { error: 'worker_code, name and phone are required.' },
      { status: 400 },
    );
  }

  if (!(visa instanceof File) || !(nationalId instanceof File)) {
    return NextResponse.json(
      { error: 'Visa and National ID documents are required.' },
      { status: 400 },
    );
  }

  if (!erpEnabled()) {
    return NextResponse.json(
      { error: 'Lead API is not enabled.', ok: false },
      { status: 503 },
    );
  }

  const messageParts = [
    `Recruit request for worker ${workerCode}`,
    workerName ? `Worker name: ${workerName}` : null,
    city ? `City: ${city}` : null,
    address ? `Address: ${address}` : null,
  ].filter(Boolean);

  const outbound = new FormData();
  outbound.append('worker_code', workerCode);
  outbound.append('name', name);
  outbound.append('phone', phone);
  if (email) outbound.append('email', email);
  outbound.append('message', messageParts.join(' | '));
  outbound.append('locale', locale);
  outbound.append('utm[utm_source]', 'website');
  outbound.append('utm[utm_medium]', 'continue-to-recruit');
  outbound.append('utm[landing_path]', '/request-cv');
  outbound.append('utm[worker_code]', workerCode);
  if (workerName) outbound.append('utm[worker_name]', workerName);
  outbound.append('visa', visa, visa.name);
  outbound.append('national_id', nationalId, nationalId.name);

  try {
    await postWorkerInquiry(outbound);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[worker-inquiry] CRM lead failed:', err);
    const msg = err instanceof Error ? err.message : 'Failed to create lead';
    if (msg.includes('422')) {
      return NextResponse.json({ error: 'This worker is not available.', ok: false }, { status: 422 });
    }
    if (msg.includes('413')) {
      return NextResponse.json(
        { error: 'Documents are too large. Please upload smaller files.', ok: false },
        { status: 413 },
      );
    }
    return NextResponse.json(
      { error: 'Could not submit request. Please try again.', ok: false },
      { status: 502 },
    );
  }
}
