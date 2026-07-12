'use client';

type Props = {
  count?: number;
  viewMode?: 'grid' | 'list';
};

/**
 * Loading placeholder for the CV gallery. Shown while the live worker feed
 * (/api/workers) is still in flight so the layout never collapses or flashes
 * the bundled demo data before the real records arrive.
 */
export default function CVGallerySkeleton({ count = 8, viewMode = 'grid' }: Props) {
  const items = Array.from({ length: count });

  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-4">
        {items.map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row"
          >
            <div className="w-full sm:w-48 aspect-[4/3] sm:aspect-square bg-gray-200 animate-pulse shrink-0" />
            <div className="p-4 sm:p-6 flex-1 flex flex-col gap-3">
              <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-1/3 bg-gray-100 rounded animate-pulse" />
              <div className="mt-auto flex gap-6 pt-4">
                <div className="h-8 w-12 bg-gray-100 rounded animate-pulse" />
                <div className="h-8 w-12 bg-gray-100 rounded animate-pulse" />
                <div className="h-8 w-12 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full"
        >
          <div className="aspect-[4/3] w-full bg-gray-200 animate-pulse" />
          <div className="p-4 flex flex-col flex-1 gap-3">
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-1/3 bg-gray-100 rounded animate-pulse" />
            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="h-8 w-10 bg-gray-100 rounded animate-pulse" />
              <div className="h-8 w-10 bg-gray-100 rounded animate-pulse" />
              <div className="h-8 w-10 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
