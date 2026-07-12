'use client';

import Image from 'next/image';
import { User } from 'lucide-react';

type WorkerPhotoProps = {
  /** ERP worker photo URL; empty/null when the worker has no uploaded photo. */
  src?: string | null;
  alt: string;
  /** Forwarded to next/image (the placeholder ignores it). */
  className?: string;
  /** Icon size for the empty-state placeholder. */
  iconSize?: number;
  sizes?: string;
};

/**
 * Worker photo that never crashes on missing data. The ERP returns a null
 * photo_url for workers without an uploaded photo (the adapter maps that to ''),
 * and next/image throws "empty string was passed to the src attribute" on ''.
 * When there is no photo we render a neutral placeholder that fills the same
 * relatively-positioned box, so the card layout stays intact.
 */
export default function WorkerPhoto({
  src,
  alt,
  className = 'object-cover',
  iconSize = 40,
  // Sized for the gallery card by default (1→4 columns); avatars pass their own.
  sizes = '(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw',
}: WorkerPhotoProps) {
  if (!src) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
        <User size={iconSize} strokeWidth={1.5} aria-label={alt} />
      </div>
    );
  }

  return <Image src={src} alt={alt} fill className={className} sizes={sizes} />;
}
