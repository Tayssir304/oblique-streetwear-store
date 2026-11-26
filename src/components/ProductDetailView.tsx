import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Heart,
  Ruler,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { Product } from '../data/products';
import { ProductImage } from './ProductImage';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
  isSaved: boolean;
  onToggleSave: (productId: string) => void;
  onAddToCart: (product: Product, size: string, colorName: string) => void;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
}

export function ProductDetailView({
  product,
  relatedProducts,
  isSaved,
  onToggleSave,
  onAddToCart,
  onBack,
  onSelectProduct,
}: ProductDetailViewProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes.includes('M')
      ? 'M'
      : product.sizes.includes('32')
        ? '32'
        : product.sizes.includes('EU 42')
          ? 'EU 42'
          : product.sizes[0]
  );
  const [justAdded, setJustAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Sync defaults when switching between products inside PDP
  useEffect(() => {
    setSelectedColor(product.colors[0].name);
    setSelectedSize(
      product.sizes.includes('M')
        ? 'M'
        : product.sizes.includes('32')
          ? '32'
          : product.sizes.includes('EU 42')
            ? 'EU 42'
            : product.sizes[0]
    );
    setJustAdded(false);
    setShowSizeGuide(false);
  }, [product]);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-8 md:py-14">
      {/* Breadcrumb Back Navigation */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#A1A1AA] hover:text-[#D4FF00] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF00] rounded-sm py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Drop 04</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
          <span>{product.category}</span>
          <span aria-hidden="true">/</span>
          <span className="text-[#F4F4F6]">{product.garmentType}</span>
        </div>
      </div>

      {/* Main Sticky 2-Column PDP Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
        {/* Left: Sticky High-Resolution Product Gallery */}
        <div className="lg:col-span-7 lg:sticky lg:top-24">
          <div className="group relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#131317] border border-white/10">
            <ProductImage
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 bg-[#131317] border border-white/10 rounded-xl p-6 md:p-8 space-y-7">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#A1A1AA] mb-2">
              <span className="uppercase tracking-[0.14em] text-[#D4FF00]">
                {product.garmentType}
              </span>
              <span aria-hidden="true">·</span>
              <span>{product.fit}</span>
              {product.badge && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#F4F4F6]">{product.badge}</span>
                </>
              )}
            </div>

            <div className="flex items-start justify-between gap-4">
              <h1
                className="font-display font-black tracking-[-0.025em] leading-[1.05] text-[#F4F4F6]"
                style={{
                  fontSize: 'clamp(1.65rem, 2.5vw, 2.35rem)',
                  textWrap: 'balance',
                }}
              >
                {product.name}
              </h1>
              <span className="font-mono tabular-nums text-xl md:text-2xl font-bold text-[#F4F4F6] shrink-0">
                ${product.price}
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[#A1A1AA]">
              {product.description}
            </p>
          </div>

          {/* Colorway Selector */}
          <div className="pt-5 border-t border-white/[0.08]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#A1A1AA]">
                Colorway
              </span>
              <span className="text-xs font-medium text-[#F4F4F6]">
                {selectedColor}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {product.colors.map((color) => {
                const active = selectedColor === color.name;
                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor(color.name)}
                    aria-label={`Select color ${color.name}`}
                    aria-pressed={active}
                    className={`w-9 h-9 rounded-full p-0.5 border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF00] ${
                      active
                        ? 'border-[#D4FF00] scale-105'
                        : 'border-white/20 hover:border-white/50'
                    }`}
                  >
                    <span
                      className="block w-full h-full rounded-full border border-black/30"
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selector */}
          <div className="pt-5 border-t border-white/[0.08]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#A1A1AA]">
                Select Size
              </span>
              <button
                type="button"
                onClick={() => setShowSizeGuide((prev) => !prev)}
                className="inline-flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-[#D4FF00] transition-colors cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>{showSizeGuide ? 'Hide Fit Guide' : 'Fit Guide'}</span>
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {product.sizes.map((size) => {
                const active = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    aria-pressed={active}
                    className={`py-2.5 px-2 text-xs font-mono tabular-nums font-bold rounded-md border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF00] ${
                      active
                        ? 'bg-[#D4FF00] text-[#0A0A0C] border-[#D4FF00]'
                        : 'bg-[#18181D] text-[#F4F4F6] border-white/10 hover:border-white/30'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            {showSizeGuide && (
              <div className="mt-3 p-3.5 rounded-md bg-[#18181D] border border-white/10 text-xs text-[#A1A1AA] space-y-1">
                <p className="font-semibold text-[#F4F4F6]">
                  Fit Note: {product.fit}
                </p>
                <p>
                  Designed with generous room through the chest and shoulders.
                  Take your regular size for the intended relaxed drape, or size
                  down one for a closer standard fit.
                </p>
              </div>
            )}
          </div>

          {/* Primary Actions */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 py-3.5 px-6 rounded-md bg-[#D4FF00] hover:bg-[#E1FF4D] text-[#0A0A0C] font-display text-sm font-extrabold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                  <span>Added to Bag</span>
                </>
              ) : (
                <span>
                  Add to Bag · ${product.price}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onToggleSave(product.id)}
              aria-label={isSaved ? 'Remove from saved items' : 'Save item'}
              aria-pressed={isSaved}
              className={`p-3.5 rounded-md border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF00] ${
                isSaved
                  ? 'bg-[#D4FF00]/15 border-[#D4FF00] text-[#D4FF00]'
                  : 'bg-[#18181D] border-white/10 text-[#A1A1AA] hover:text-[#F4F4F6] hover:border-white/25'
              }`}
            >
              <Heart
                className="w-5 h-5"
                fill={isSaved ? 'currentColor' : 'none'}
                strokeWidth={1.8}
              />
            </button>
          </div>

          {/* Construction & Garment Specs */}
          <div className="pt-5 border-t border-white/[0.08] space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#A1A1AA]">
              Garment Specifications · {product.fabric}
            </p>
            <ul className="space-y-2 text-sm text-[#D4D4D8]">
              {product.details.map((detail) => (
                <li key={detail} className="flex items-start gap-2.5">
                  <span className="mt-2 w-1 h-1 rounded-full bg-[#D4FF00] shrink-0" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Shipping & Guarantee Strip */}
          <div className="pt-5 border-t border-white/[0.08] grid grid-cols-2 gap-4 text-xs text-[#A1A1AA]">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#D4FF00] shrink-0" />
              <span>Free express shipping $250+</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#D4FF00] shrink-0" />
              <span>30-day unworn returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Complete The Fit: Related Pieces */}
      <div className="mt-20 pt-14 border-t border-white/[0.08]">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[#A1A1AA] mb-1.5">
              Styled Together
            </p>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-[#F4F4F6]">
              Complete the Silhouette
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {relatedProducts.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectProduct(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectProduct(item);
                }
              }}
              className="group bg-[#131317] border border-white/[0.08] hover:border-white/25 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF00]"
            >
              <div className="aspect-[3/4] w-full overflow-hidden bg-[#18181D]">
                <ProductImage
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[#A1A1AA]">
                    {item.garmentType}
                  </p>
                  <h3 className="font-display text-base font-bold text-[#F4F4F6] group-hover:text-[#D4FF00] transition-colors truncate">
                    {item.name}
                  </h3>
                </div>
                <span className="font-mono tabular-nums text-sm font-bold text-[#F4F4F6] shrink-0">
                  ${item.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
