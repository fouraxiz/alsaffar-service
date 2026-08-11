import type { ErpWorker } from './erpApi';
import type { WorkerCV } from '@/data/cvData';
import { resolvePublicWorkerName } from './publicWorkerName';

/**
 * Map an ERP PublicWorkerResource into the site's WorkerCV shape so the
 * existing CV components render unchanged. Codes come from the backend
 * (iso2 / category slug) — the site does not invent nationality lists here.
 */

const slug = (s: string | null | undefined): string =>
  (s ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Common label → ISO2 when ERP only sent a nationality name. */
const NATIONALITY_ALIASES: Record<string, string> = {
  bangladeshi: 'bd',
  bangladesh: 'bd',
  bengali: 'bd',
  bangla: 'bd',
  bn: 'bd',
  filipino: 'ph',
  philippines: 'ph',
  indonesian: 'id',
  indonesia: 'id',
  'sri lankan': 'lk',
  'sri-lankan': 'lk',
  ethiopian: 'et',
  ethiopia: 'et',
  indian: 'in',
  india: 'in',
  pakistani: 'pk',
  pakistan: 'pk',
  nepali: 'np',
  nepal: 'np',
  ugandan: 'ug',
  uganda: 'ug',
  kenyan: 'ke',
  kenya: 'ke',
  ghanaian: 'gh',
  ghana: 'gh',
  tanzanian: 'tz',
  tanzania: 'tz',
};

function resolveNationalityCode(w: ErpWorker): string {
  const iso = (w.nationality?.iso2 ?? '').toLowerCase().trim();
  if (iso) return iso === 'bn' ? 'bd' : iso;

  const label = (w.nationality?.en ?? '').toLowerCase().trim();
  if (!label) return '';
  return NATIONALITY_ALIASES[label] || slug(label);
}

export function mapApiWorkerToCV(w: ErpWorker): WorkerCV {
  const natEn = w.nationality?.en ?? '';
  const natAr = w.nationality?.ar ?? natEn;
  const catEn = w.category?.en ?? '';
  const catAr = w.category?.ar ?? catEn;

  const languages = (w.languages ?? []).map((l) => l.name).filter(Boolean);
  const { name, nameAr } = resolvePublicWorkerName({
    firstName: w.first_name,
    name: w.name,
    nameAr: w.name_ar,
    gender: w.gender,
    nationalityEn: natEn,
    seed: w.worker_code || w.first_name || 'worker',
  });

  const jobSlug = slug(w.job_type || catEn);

  const educationHistory = (w.education_history ?? [])
    .map((row) => ({
      from: row.from ?? null,
      to: row.to ?? null,
      institution: (row.institution ?? '').trim(),
      degree: (row.degree ?? '').trim(),
      description: (row.description ?? '').trim() || undefined,
    }))
    .filter((row) => row.institution || row.degree);

  const workExperiences = (w.work_experiences ?? [])
    .map((row) => ({
      from: row.from ?? null,
      to: row.to ?? null,
      company: (row.company ?? '').trim(),
      title: (row.title ?? '').trim(),
      description: (row.description ?? '').trim() || undefined,
    }))
    .filter((row) => row.company || row.title);

  const religion = (w.religion ?? '').trim() || undefined;
  const maritalRaw = (w.marital_status ?? '').toLowerCase().trim();
  const maritalLabels: Record<string, string> = {
    single: 'Single',
    married: 'Married',
    divorced: 'Divorced',
    widowed: 'Widowed',
  };
  const maritalStatus = maritalLabels[maritalRaw] || (w.marital_status ?? '').trim() || undefined;

  return {
    id: w.worker_code,
    name,
    nameAr,
    nationality: resolveNationalityCode(w),
    nationalityNameEn: natEn,
    nationalityNameAr: natAr,
    gender: (w.gender as 'male' | 'female') || 'female',
    age: typeof w.age === 'number' ? w.age : 0,
    jobType: jobSlug,
    jobTypeAr: catAr,
    experience: typeof w.experience_years === 'number' ? w.experience_years : 0,
    experienceCountries: (w.experience_countries ?? [])
      .map((c) => ({
        en: (c.en ?? '').trim(),
        ar: (c.ar ?? c.en ?? '').trim(),
        iso2: c.iso2 ?? undefined,
      }))
      .filter((c) => c.en || c.ar),
    salaryExpectation: typeof w.salary_expectation === 'number' ? w.salary_expectation : 0,
    visaType: 'new',
    // Not inventing a service — empty until ERP exposes one on the worker.
    serviceType: '' as WorkerCV['serviceType'],
    languages,
    languagesAr: languages,
    skills: w.skills ?? [],
    skillsAr: w.skills ?? [],
    bio: w.bio ?? '',
    bioAr: w.bio_ar ?? w.bio ?? '',
    religion,
    religionAr: religion,
    maritalStatus,
    maritalStatusAr: maritalStatus,
    educationHistory,
    workExperiences,
    hasVideo: !!w.video_url,
    videoUrl: w.video_url ?? undefined,
    photoUrl: w.photo_url ?? '',
  };
}

export function mapApiWorkers(list: ErpWorker[]): WorkerCV[] {
  return (list ?? []).map(mapApiWorkerToCV);
}
