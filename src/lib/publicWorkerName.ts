/**
 * Human display names for public CV cards. Strips intake junk like Main96517 /
 * Wk43256 and falls back to a stable nationality-based first name when needed.
 */

const BY_NATIONALITY: Record<
  string,
  { f: string[]; m: string[]; ar_f: string[]; ar_m: string[] }
> = {
  filipino: {
    f: ['Maria', 'Anna', 'Rosa', 'Grace', 'Joy', 'Angela', 'Christine', 'Jenny'],
    m: ['Juan', 'Mark', 'Jose', 'Carlo', 'Ryan', 'Michael', 'Anthony', 'Paulo'],
    ar_f: ['ماريا', 'آنا', 'روزا', 'غريس', 'جوي', 'أنجيلا', 'كريستين', 'جيني'],
    ar_m: ['خوان', 'مارك', 'خوسيه', 'كارلو', 'رايان', 'مايكل', 'أنتوني', 'باولو'],
  },
  indonesian: {
    f: ['Siti', 'Dewi', 'Putri', 'Ayu', 'Rina', 'Wati', 'Nurul', 'Indah'],
    m: ['Budi', 'Agus', 'Eko', 'Hendra', 'Rizki', 'Andi', 'Yusuf', 'Dimas'],
    ar_f: ['سيتي', 'ديوي', 'بوتري', 'آيو', 'رينا', 'واتي', 'نورول', 'إنداه'],
    ar_m: ['بودي', 'أغوس', 'إيكو', 'هندرا', 'رزقي', 'أندي', 'يوسف', 'ديماس'],
  },
  default: {
    f: ['Sara', 'Amina', 'Fatima', 'Nora', 'Lina', 'Hana', 'Maya', 'Leila'],
    m: ['Ahmed', 'Omar', 'Hassan', 'Karim', 'Samir', 'Youssef', 'Bilal', 'Adel'],
    ar_f: ['سارة', 'أمينة', 'فاطمة', 'نورا', 'لينا', 'هناء', 'مايا', 'ليلى'],
    ar_m: ['أحمد', 'عمر', 'حسن', 'كريم', 'سمير', 'يوسف', 'بلال', 'عادل'],
  },
};

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function titleCaseName(value: string): string {
  return value
    .toLowerCase()
    .split(/\s+/)
    .map((part) => {
      if (!part) return part;
      if (['de', 'dela', 'del', 'van', 'bin', 'binti'].includes(part)) return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(' ')
    .trim();
}

function humanPart(value: string | null | undefined): string | null {
  const v = (value ?? '').trim();
  if (!v) return null;
  if (/\d/.test(v)) return null;
  if (/^(wrk|wk|id|tmp|test|user|worker)[a-z0-9_-]*$/i.test(v)) return null;
  if (v.length < 2 || v.length > 40) return null;
  // Latin letters + common name punctuation (no \p{} — some runtimes reject Unicode properties).
  if (!/^[A-Za-z\u00C0-\u024F][A-Za-z\u00C0-\u024F'\-\s.]*$/.test(v)) return null;
  return titleCaseName(v);
}

function humanArabic(value: string | null | undefined): string | null {
  const v = (value ?? '').trim();
  if (!v || /\d/.test(v) || v.length < 2) return null;
  // Arabic block U+0600–U+06FF (avoids \p{Script=Arabic} which threw in this runtime).
  if (!/[\u0600-\u06FF]/.test(v)) return null;
  return v;
}

export function resolvePublicWorkerName(input: {
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  nameAr?: string | null;
  gender?: string | null;
  nationalityEn?: string | null;
  seed: string;
}): { name: string; nameAr: string } {
  // Prefer API-provided sanitized name when present.
  const apiName = humanPart(input.name);
  const apiAr = humanArabic(input.nameAr);
  if (apiName) {
    return { name: apiName, nameAr: apiAr || apiName };
  }

  const first = humanPart(input.firstName);
  const last = humanPart(input.lastName);
  if (first) {
    const name = last ? `${first} ${last}` : first;
    return { name, nameAr: apiAr || name };
  }

  const key = (input.nationalityEn ?? '').toLowerCase().trim();
  const bucket = BY_NATIONALITY[key] ?? BY_NATIONALITY.default;
  const male = (input.gender ?? '').toLowerCase() === 'male';
  const list = male ? bucket.m : bucket.f;
  const arList = male ? bucket.ar_m : bucket.ar_f;
  const i = hashSeed(input.seed) % list.length;
  return { name: list[i]!, nameAr: arList[i]! };
}
