import { ArrowUpRight } from 'lucide-react';
import { EDITORIAL_LOOKBOOK_IMAGE } from '../data/products';
import { ProductImage } from './ProductImage';

interface LookbookSectionProps {
  onExploreStage: () => void;
}

export function LookbookSection({ onExploreStage }: LookbookSectionProps) {
  return (
    <section
      id="lookbook-section"
      className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 md:py-24 border-b border-white/[0.08]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        {/* Left: Editorial Campaign Image */}
        <div className="lg:col-span-7 rounded-xl overflow-hidden bg-[#131317] border border-white/10 min-h-[320px]">
          <ProductImage
            src={EDITORIAL_LOOKBOOK_IMAGE}
            alt="OBLIQUE Drop 04 concrete courtyard lookbook"
            className="w-full h-full lg:h-full object-cover"
          />
        </div>

        {/* Right: Textile Craftsmanship & Silhouette Philosophy */}
        <div className="lg:col-span-5 bg-[#131317] border border-white/10 rounded-xl p-8 md:p-10 flex flex-col justify-between gap-8">
          <div>
            <p className="text-xs font-medium tracking-[0.16em] uppercase text-[#A1A1AA] mb-3">
              Lookbook & Material Study
            </p>
            <h2
              className="font-display font-black tracking-[-0.025em] leading-[1.02] text-[#F4F4F6] mb-5"
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                textWrap: 'balance',
              }}
            >
              Heavyweight textiles cut for exaggerated drape.
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-[#A1A1AA]">
              Every silhouette in Drop 04 starts with custom-milled fabrics—from
              500gsm sun-faded loopback cotton hoodies to 14.5oz Japanese raw
              denim and water-repellent parachute ripstop. Built to stack,
              layer, and hold architectural shape.
            </p>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/[0.08]">
            <div className="grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="font-mono tabular-nums text-lg font-bold text-[#F4F4F6]">
                  500gsm
                </p>
                <p className="text-xs text-[#A1A1AA]">French Terry</p>
              </div>
              <div>
                <p className="font-mono tabular-nums text-lg font-bold text-[#F4F4F6]">
                  14.5oz
                </p>
                <p className="text-xs text-[#A1A1AA]">Raw Denim</p>
              </div>
              <div>
                <p className="font-mono tabular-nums text-lg font-bold text-[#F4F4F6]">
                  1680D
                </p>
                <p className="text-xs text-[#A1A1AA]">Ballistic Nylon</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onExploreStage}
              className="w-full py-3.5 px-5 rounded-md bg-white/[0.06] hover:bg-[#D4FF00] text-[#F4F4F6] hover:text-[#0A0A0C] border border-white/12 font-display text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF00]"
            >
              <span>Return to 3D Stage</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
