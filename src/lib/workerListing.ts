/**
 * Hire vs rent listings. The ERP keeps for-rent workers (incl. returned workers housed in
 * accommodation) OUT of the normal Browse CVs pool and serves them with `listing=rent`.
 * Mirrors WebsiteApi WorkerListing::isRentToken on the ERP side.
 */
export type WorkerListing = 'hire' | 'rent';

export function isRentToken(value: string | null | undefined): boolean {
  const slug = (value ?? '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
  if (!slug) return false;
  return slug.includes('rent') && !slug.includes('recruit');
}

/** `/request-cv?listing=rent` (also accepts ?service= / ?category= rent tokens). */
export function listingFromParams(params: URLSearchParams): WorkerListing {
  if ((params.get('listing') ?? '').toLowerCase() === 'rent') return 'rent';
  return isRentToken(params.get('service')) || isRentToken(params.get('category')) ? 'rent' : 'hire';
}

export function rentCvsHref(locale: string): string {
  return `/${locale}/request-cv?listing=rent`;
}
