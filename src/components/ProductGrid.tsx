import { useMemo, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { Product, ProductCategory } from '../data/products';
import { ProductImage } from './ProductImage';

interface ProductGridProps {
  products: Product[];
  activeCategory: ProductCategory;
  onCategoryChange: (cat: ProductCategory) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

const CATEGORIES: ProductCategory[] = [
  'All',
  'Hoodies & Sweats',
  'Pants & Denim',
  'Tees & Outerwear',
  'Footwear & Gear',
];

type SortOrder = 'featured' | 'price-asc' | 'price-desc';

export function ProductGrid({
  products,
  activeCategory,
  onCategoryChange,
  onSelectProduct,
  onQuickAdd,
}: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('featured');

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = products.filter((item) => {
      const matchesCategory =
        activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.garmentType.toLowerCase().includes(query) ||
        item.fabric.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });

    if (sortOrder === 'price-asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortOrder === 'price-desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [products, activeCategory, searchQuery, sortOrder]);

  return (
    <section
      id="collection-grid"
      className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 md:py-24 border-b border-white/[0.08]"
    >
      {/* Section Header + Search & Sort Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] uppercase text-[#A1A1AA] mb-2">
            Seasonal Capsule
          </p>
          <h2
            className="font-display font-extrabold tracking-[-0.025em] text-[#F4F4F6]"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)' }}
          >
            Drop 04 Full Collection
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Live Search Input */}
          <div className="relative min-w-[240px]">
            <Search
              className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              strokeWidth={1.75}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hoodies, cargos, denim..."
              aria-label="Search collection"
              className="w-full pl-10 pr-9 py-2.5 text-sm bg-[#131317] text-[#F4F4F6] placeholder-[#71717A] border border-white/10 rounded-md focus:outline-none focus:border-[#D4FF00] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-[#F4F4F6] p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Select */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            aria-label="Sort products"
            className="px-3.5 py-2.5 text-sm bg-[#131317] text-[#F4F4F6] border border-white/10 rounded-md focus:outline-none focus:border-[#D4FF00] cursor-pointer"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Filter Segmented Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-10 pb-6 border-b border-white/[0.06]">
        <div
          className="flex flex-wrap items-center gap-2"
          role="tablist"
          aria-label="Product category filter"
        >
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onCategoryChange(category)}
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF00] ${
                  isActive
                    ? 'bg-[#D4FF00] text-[#0A0A0C]'
                    : 'bg-[#131317] text-[#A1A1AA] hover:text-[#F4F4F6] border border-white/10 hover:border-white/25'
                }`}
              >
                {category === 'All' ? 'All Pieces' : category}
              </button>
            );
          })}
        </div>

        <span className="text-xs font-mono tabular-nums text-[#A1A1AA]">
          {filteredProducts.length}{' '}
          {filteredProducts.length === 1 ? 'Piece' : 'Pieces'}
        </span>
      </div>

      {/* Product Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-[#131317] border border-white/10 rounded-xl">
          <p className="font-display text-lg font-bold text-[#F4F4F6] mb-2">
            No matching pieces found
          </p>
          <p className="text-sm text-[#A1A1AA] mb-6">
            Try clearing your search or switching back to all categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              onCategoryChange('All');
            }}
            className="px-5 py-2.5 text-xs font-bold bg-[#D4FF00] text-[#0A0A0C] rounded-md hover:bg-[#E1FF4D] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-8">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="group flex flex-col bg-[#131317] border border-white/[0.08] hover:border-white/25 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
            >
              {/* Product Image Frame (75% card presence, aspect 3:4) */}
              <div
                onClick={() => onSelectProduct(product)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectProduct(product);
                  }
                }}
                className="relative aspect-[3/4] w-full overflow-hidden bg-[#18181D] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D4FF00]"
              >
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                <div className="absolute bottom-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#0A0A0C]/90 border border-white/15 text-xs font-semibold text-[#F4F4F6]">
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#D4FF00]" />
                  </span>
                </div>
              </div>

              {/* Clean Metadata & Direct Add Action */}
              <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#A1A1AA] mb-1.5">
                    <span className="uppercase tracking-[0.12em]">
                      {product.garmentType}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{product.fit}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectProduct(product)}
                    className="text-left font-display text-lg font-bold tracking-tight text-[#F4F4F6] group-hover:text-[#D4FF00] transition-colors cursor-pointer"
                  >
                    {product.name}
                  </button>
                </div>

                <div className="pt-3 border-t border-white/[0.07] flex items-center justify-between gap-4">
                  <span className="font-mono tabular-nums text-base font-bold text-[#F4F4F6]">
                    ${product.price}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Colorway Swatches Preview */}
                    <div className="flex items-center gap-1.5 mr-1">
                      {product.colors.map((c) => (
                        <span
                          key={c.name}
                          title={c.name}
                          style={{ backgroundColor: c.hex }}
                          className="w-3 h-3 rounded-full border border-white/25"
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => onQuickAdd(product)}
                      className="px-3.5 py-2 text-xs font-semibold bg-white/[0.06] hover:bg-[#D4FF00] text-[#F4F4F6] hover:text-[#0A0A0C] border border-white/10 rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF00]"
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
