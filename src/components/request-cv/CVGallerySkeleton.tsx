'use client';

type Props = {
  count?: number;
  viewMode?: 'grid' | 'list';
};

/**
 * Soft blur placeholder for the CV gallery — frosted glass shimmer instead of
 * hard gray skeleton boxes.
 */
export default function CVGallerySkeleton({ count = 8, viewMode = 'grid' }: Props) {
  const items = Array.from({ length: count });

  const card = (key: number, list = false) => (
    <div
      key={key}
      className={`relative overflow-hidden rounded-2xl border border-white/50 bg-white/40 shadow-sm backdrop-blur-md ${
        list ? 'flex flex-col sm:flex-row min-h-[140px]' : 'flex flex-col h-full'
      }`}
    >
      <div
        className={`shrink-0 bg-gradient-to-br from-brand-orange/10 via-white/30 to-sky-100/40 ${
          list ? 'w-full sm:w-48 aspect-[4/3] sm:aspect-square' : 'aspect-[4/3] w-full'
        }`}
      />
      <div className={`flex flex-1 flex-col gap-3 p-4 ${list ? 'sm:p-6' : ''}`}>
        <div className="h-4 w-2/3 rounded-full bg-white/70 backdrop-blur-sm" />
        <div className="h-3 w-1/3 rounded-full bg-white/50 backdrop-blur-sm" />
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/40 pt-4">
          <div className="h-7 w-10 rounded-lg bg-white/60 backdrop-blur-sm" />
          <div className="h-7 w-10 rounded-lg bg-white/60 backdrop-blur-sm" />
          <div className="h-7 w-10 rounded-lg bg-white/60 backdrop-blur-sm" />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/35 to-transparent" />
    </div>
  );

  if (viewMode === 'list') {
    return <div className="flex flex-col gap-4">{items.map((_, i) => card(i, true))}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((_, i) => card(i))}
    </div>
  );
}
