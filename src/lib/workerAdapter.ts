import type { ErpWorker } from './erpApi';
import { NATIONALITIES_LIST, type WorkerCV } from '@/data/cvData';

/**
 * Map an ERP PublicWorkerResource into the site's WorkerCV shape so the
 * existing CV components render unchanged. Missing/optional fields get safe
 * defaults; nothing sensitive is invented.
 */

const slug = (s: string | null | undefined): string =>
  (s ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

// The ERP returns a nationality label ("Filipino"); the site's filters and the
// flag CDN key off ISO2 codes ("ph"). Reuse the canonical NATIONALITIES_LIST so
// live workers match the nationality filter and show the right flag.
const NATIONALITY_NAME_TO_CODE = new Map(
  NATIONALITIES_LIST.map((n) => [n.en.toLowerCase(), n.code]),
);

export function mapApiWorkerToCV(w: ErpWorker): WorkerCV {
  const natEn = w.nationality?.en ?? '';
  const natAr = w.nationality?.ar ?? natEn;
  const catEn = w.category?.en ?? '';
  const catAr = w.category?.ar ?? catEn;

  const languages = (w.languages ?? []).map((l) => l.name).filter(Boolean);

  return {
    id: w.worker_code,
    name: w.first_name || 'Worker',
    nameAr: w.first_name || 'عامل',
    nationality: NATIONALITY_NAME_TO_CODE.get(natEn.toLowerCase().trim()) || slug(natEn) || 'other',
    nationalityNameEn: natEn,
    nationalityNameAr: natAr,
    gender: (w.gender as 'male' | 'female') || 'female',
    age: typeof w.age === 'number' ? w.age : 0,
    jobType: slug(w.job_type || catEn) || 'housemaid',
    jobTypeAr: catAr,
    experience: typeof w.experience_years === 'number' ? w.experience_years : 0,
    salaryExpectation: typeof w.salary_expectation === 'number' ? w.salary_expectation : 0,
    visaType: 'new',
    serviceType: 'new_visa',
    languages,
    languagesAr: languages, // ERP exposes one label set; reuse for AR until localized
    skills: w.skills ?? [],
    skillsAr: w.skills ?? [],
    bio: w.bio ?? '',
    bioAr: w.bio_ar ?? w.bio ?? '',
    hasVideo: !!w.video_url,
    videoUrl: w.video_url ?? undefined,
    photoUrl: w.photo_url ?? '',
  };
}

export function mapApiWorkers(list: ErpWorker[]): WorkerCV[] {
  return (list ?? []).map(mapApiWorkerToCV);
}
