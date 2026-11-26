import { useEffect, useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import { PRODUCTS, Product, ProductCategory } from './data/products';
import { Navbar } from './components/Navbar';
import { Carousel3D } from './components/Carousel3D';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailView } from './components/ProductDetailView';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { LookbookSection } from './components/LookbookSection';
import { Footer } from './components/Footer';
import { createOrder } from './data/api';

const CART_STORAGE_KEY = 'oblique_bag_v1';
const SAVED_STORAGE_KEY = 'oblique_saved_v1';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) return JSON.parse(raw) as CartItem[];
    } catch {
      // ignore storage errors
    }
    return [];
  });

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(SAVED_STORAGE_KEY);
      if (raw) return JSON.parse(raw) as string[];
    } catch {
      // ignore storage errors
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore storage errors
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedIds));
    } catch {
      // ignore storage errors
    }
  }, [savedIds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = (
    sectionId?: string,
    category?: ProductCategory
  ) => {
    if (category) {
      setActiveCategory(category);
    }
    setSelectedProduct(null);
    setTimeout(() => {
      if (sectionId) {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 40);
  };

  const handleAddToCart = (
    product: Product,
    size?: string,
    color?: string
  ) => {
    const resolvedSize =
      size ??
      (product.sizes.includes('M')
        ? 'M'
        : product.sizes.includes('32')
          ? '32'
          : product.sizes.includes('EU 42')
            ? 'EU 42'
            : product.sizes[0]);
    const resolvedColor = color ?? product.colors[0].name;
    const key = `${product.id}__${resolvedSize}__${resolvedColor}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          key,
          product,
          size: resolvedSize,
          color: resolvedColor,
          quantity: 1,
        },
      ];
    });

    showToast(`Added ${product.name} (${resolvedSize}) to bag`);
  };

  const handleUpdateQty = (key: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (key: string) => {
    setCartItems((prev) => prev.filter((item) => item.key !== key));
  };

  const handleToggleSave = (productId: string) => {
    setSavedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handlePlaceOrder = async (
    customer: { name: string; email: string; address: string; paymentMethod: 'card' | 'cod' },
    items: CartItem[]
  ) => {
    const { orderNumber } = await createOrder({
      customer,
      items: items.map(({ product, size, color, quantity }) => ({
        productId: product.id,
        size,
        color,
        quantity,
      })),
    });
    setCartItems([]);
    return orderNumber;
  };

  const totalCartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return PRODUCTS.filter((p) => p.id !== selectedProduct.id).slice(0, 3);
  }, [selectedProduct]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0C] text-[#F4F4F6]">
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateHome={handleNavigateHome}
      />

      <main className="flex-1">
        {selectedProduct ? (
          <ProductDetailView
            product={selectedProduct}
            relatedProducts={relatedProducts}
            isSaved={savedIds.includes(selectedProduct.id)}
            onToggleSave={handleToggleSave}
            onAddToCart={handleAddToCart}
            onBack={() => handleNavigateHome()}
            onSelectProduct={handleSelectProduct}
          />
        ) : (
          <>
            <Carousel3D
              products={PRODUCTS}
              onSelectProduct={handleSelectProduct}
              onQuickAdd={(product) => handleAddToCart(product)}
              onBrowseAll={() => {
                const el = document.getElementById('collection-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <ProductGrid
              products={PRODUCTS}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              onSelectProduct={handleSelectProduct}
              onQuickAdd={(product) => handleAddToCart(product)}
            />

            <LookbookSection
              onExploreStage={() => {
                const el = document.getElementById('carousel-stage');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </>
        )}
      </main>

      <Footer
        onNavigateCategory={(cat) =>
          handleNavigateHome('collection-grid', cat)
        }
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Non-intrusive Add-to-Bag Toast Confirmation */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg bg-[#18181D] border border-[#D4FF00]/60 text-xs font-semibold text-[#F4F4F6] shadow-2xl"
        >
          <Check className="w-4 h-4 text-[#D4FF00]" strokeWidth={2.5} />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="ml-2 text-[#D4FF00] underline underline-offset-2 hover:text-white cursor-pointer"
          >
            View Bag
          </button>
        </div>
      )}
    </div>
  );
}
