import { useState } from 'react';
import { Shirt } from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  draggable?: boolean;
}

export function ProductImage({
  src,
  alt,
  className = '',
  draggable = false,
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#1A1A20] via-[#121215] to-[#0B0B0D] text-[#A1A1AA] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Shirt className="w-8 h-8 mb-3 text-[#D4FF00]/70" strokeWidth={1.5} />
        <span className="font-display text-xs uppercase tracking-widest text-[#F4F4F6]/80">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      draggable={draggable}
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
