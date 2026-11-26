import { ShoppingBag } from 'lucide-react';
import { ProductCategory } from '../data/products';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigateHome: (sectionId?: string, category?: ProductCategory) => void;
}

export function Navbar({ cartCount, onOpenCart, onNavigateHome }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0A0C]/88 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <button
          type="button"
          onClick={() => onNavigateHome('carousel-stage', 'All')}
          className="font-display text-xl md:text-2xl font-black tracking-[-0.04em] text-[#F4F4F6] hover:text-[#D4FF00] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF00] rounded-sm"
        >
          OBLIQUE
        </button>

        {/* Zone 2: 5 concise single-line text nav links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#A1A1AA]"
        >
          <button
            type="button"
            onClick={() => onNavigateHome('carousel-stage')}
            className="hover:text-[#F4F4F6] hover:underline underline-offset-4 decoration-[#D4FF00] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF00] rounded-sm"
          >
            3D Archive
          </button>
          <button
            type="button"
            onClick={() => onNavigateHome('collection-grid', 'Hoodies & Sweats')}
            className="hover:text-[#F4F4F6] hover:underline underline-offset-4 decoration-[#D4FF00] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF00] rounded-sm"
          >
            Hoodies
          </button>
          <button
            type="button"
            onClick={() => onNavigateHome('collection-grid', 'Pants & Denim')}
            className="hover:text-[#F4F4F6] hover:underline underline-offset-4 decoration-[#D4FF00] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF00] rounded-sm"
          >
            Denim & Cargo
          </button>
          <button
            type="button"
            onClick={() => onNavigateHome('collection-grid', 'Footwear & Gear')}
            className="hover:text-[#F4F4F6] hover:underline underline-offset-4 decoration-[#D4FF00] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF00] rounded-sm"
          >
            Sneakers & Gear
          </button>
          <button
            type="button"
            onClick={() => onNavigateHome('lookbook-section')}
            className="hover:text-[#F4F4F6] hover:underline underline-offset-4 decoration-[#D4FF00] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF00] rounded-sm"
          >
            Lookbook
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Open shopping bag, ${cartCount} items`}
            className="inline-flex items-center gap-2.5 px-4 py-2 text-xs font-semibold tracking-wide bg-[#18181D] hover:bg-[#23232A] text-[#F4F4F6] border border-white/12 rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF00]"
          >
            <ShoppingBag className="w-4 h-4 text-[#D4FF00]" strokeWidth={1.8} />
            <span>Bag</span>
            <span className="font-mono tabular-nums text-[#0A0A0C] bg-[#D4FF00] px-1.5 py-0.5 rounded-sm text-[11px] font-bold leading-none">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
