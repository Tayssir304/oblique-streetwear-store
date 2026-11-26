import React, { useState } from 'react';
import {
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { Product } from '../data/products';
import { ProductImage } from './ProductImage';

export interface CartItem {
  key: string;
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

interface OrderCustomer {
  name: string;
  email: string;
  address: string;
  paymentMethod: 'card' | 'cod';
}

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onPlaceOrder: (
    customer: OrderCustomer,
    items: CartItem[]
  ) => Promise<string>;
}

const FREE_SHIPPING_THRESHOLD = 250;

export function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onPlaceOrder,
}: CartDrawerProps) {
  const [checkoutStep, setCheckoutStep] = useState<
    'bag' | 'checkout' | 'confirmed'
  >('bag');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [orderNumber, setOrderNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingCost =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 18;
  const total = subtotal + shippingCost;
  const progressPct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const savedOrderNumber = await onPlaceOrder(
        {
          name: customerName,
          email: customerEmail,
          address: shippingAddress,
          paymentMethod,
        },
        items
      );
      setOrderNumber(savedOrderNumber);
      setCheckoutStep('confirmed');
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Unable to save your order.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseReset = () => {
    if (checkoutStep === 'confirmed') {
      setCheckoutStep('bag');
      setCustomerName('');
      setCustomerEmail('');
      setShippingAddress('');
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      {/* Backdrop */}
      <div
        onClick={handleCloseReset}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative z-10 w-full max-w-md h-full bg-[#111114] border-l border-white/10 flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-[#D4FF00]" />
            <h2 className="font-display text-lg font-extrabold tracking-tight text-[#F4F4F6]">
              {checkoutStep === 'bag'
                ? 'Your Bag'
                : checkoutStep === 'checkout'
                  ? 'Express Checkout'
                  : 'Order Confirmed'}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleCloseReset}
            aria-label="Close bag"
            className="p-2 text-[#A1A1AA] hover:text-[#F4F4F6] rounded-md hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {checkoutStep === 'bag' && items.length > 0 && (
          <div className="px-6 py-3.5 bg-[#16161B] border-b border-white/[0.06]">
            <p className="text-xs text-[#D4D4D8] mb-2">
              {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                <span>
                  Unlocked <strong className="text-[#D4FF00]">Free Express Shipping</strong>
                </span>
              ) : (
                <span>
                  Add{' '}
                  <strong className="font-mono tabular-nums text-[#D4FF00]">
                    ${FREE_SHIPPING_THRESHOLD - subtotal}
                  </strong>{' '}
                  more for free express shipping
                </span>
              )}
            </p>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#D4FF00] transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {checkoutStep === 'confirmed' ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2
                className="w-12 h-12 text-[#D4FF00] mx-auto"
                strokeWidth={1.6}
              />
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#D4FF00] mb-1">
                  Order #{orderNumber} Confirmed
                </p>
                <h3 className="font-display text-2xl font-extrabold text-[#F4F4F6]">
                  Preparing Your Drop
                </h3>
              </div>
              <p className="text-sm text-[#A1A1AA] max-w-xs mx-auto leading-relaxed">
                Your order details have been saved for{' '}
                <span className="text-[#F4F4F6] font-medium">
                  {customerEmail || 'your inbox'}
                </span>
                . This demo does not process payments or send email.
              </p>
              <button
                type="button"
                onClick={handleCloseReset}
                className="mt-4 px-6 py-3 text-xs font-bold uppercase tracking-wider bg-[#D4FF00] text-[#0A0A0C] rounded-md hover:bg-[#E1FF4D] transition-colors cursor-pointer"
              >
                Continue Exploring
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <p className="font-display text-lg font-bold text-[#F4F4F6]">
                Your bag is empty
              </p>
              <p className="text-sm text-[#A1A1AA]">
                Explore the 3D archive or Drop 04 catalog to add pieces.
              </p>
              <button
                type="button"
                onClick={handleCloseReset}
                className="px-5 py-2.5 text-xs font-bold bg-[#18181D] hover:bg-[#23232A] text-[#F4F4F6] border border-white/15 rounded-md transition-colors cursor-pointer"
              >
                Back to Storefront
              </button>
            </div>
          ) : checkoutStep === 'bag' ? (
            <ul className="space-y-5">
              {items.map((item) => (
                <li
                  key={item.key}
                  className="flex gap-4 pb-5 border-b border-white/[0.07]"
                >
                  <div className="w-20 h-26 rounded-md overflow-hidden bg-[#18181D] border border-white/10 shrink-0">
                    <ProductImage
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-sm font-bold text-[#F4F4F6] truncate">
                          {item.product.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.key)}
                          aria-label={`Remove ${item.product.name}`}
                          className="text-[#71717A] hover:text-red-400 transition-colors p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[#A1A1AA] mt-0.5">
                        Size {item.size} · {item.color}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="inline-flex items-center border border-white/12 rounded-md bg-[#18181D]">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.key, -1)}
                          aria-label="Decrease quantity"
                          className="p-1.5 text-[#A1A1AA] hover:text-[#F4F4F6] cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-mono tabular-nums font-bold text-[#F4F4F6]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.key, 1)}
                          aria-label="Increase quantity"
                          className="p-1.5 text-[#A1A1AA] hover:text-[#F4F4F6] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-mono tabular-nums text-sm font-bold text-[#F4F4F6]">
                        ${item.product.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <form
              id="checkout-form"
              onSubmit={handlePlaceOrder}
              className="space-y-4"
            >
              {submitError && (
                <p
                  role="alert"
                  className="rounded-md border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300"
                >
                  {submitError}
                </p>
              )}
              <div>
                <label
                  htmlFor="checkout-name"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Alex Mercer"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#18181D] text-[#F4F4F6] border border-white/12 rounded-md focus:outline-none focus:border-[#D4FF00]"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="alex@domain.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#18181D] text-[#F4F4F6] border border-white/12 rounded-md focus:outline-none focus:border-[#D4FF00]"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-address"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] mb-1.5"
                >
                  Shipping Address & City
                </label>
                <input
                  id="checkout-address"
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="42 Mercer St, New York, NY 10013"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#18181D] text-[#F4F4F6] border border-white/12 rounded-md focus:outline-none focus:border-[#D4FF00]"
                />
              </div>

              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] mb-2">
                  Payment Method
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2.5 px-3 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-[#D4FF00]/15 border-[#D4FF00] text-[#D4FF00]'
                        : 'bg-[#18181D] border-white/10 text-[#A1A1AA]'
                    }`}
                  >
                    Card / Express Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`py-2.5 px-3 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'bg-[#D4FF00]/15 border-[#D4FF00] text-[#D4FF00]'
                        : 'bg-[#18181D] border-white/10 text-[#A1A1AA]'
                    }`}
                  >
                    Cash on Delivery
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && checkoutStep !== 'confirmed' && (
          <div className="p-6 border-t border-white/[0.08] bg-[#131317] space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#A1A1AA]">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-[#F4F4F6]">
                  ${subtotal}
                </span>
              </div>
              <div className="flex justify-between text-[#A1A1AA]">
                <span>Express Shipping</span>
                <span className="font-mono tabular-nums text-[#F4F4F6]">
                  {shippingCost === 0 ? 'Free' : `$${shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-white/[0.08] text-[#F4F4F6]">
                <span>Total</span>
                <span className="font-mono tabular-nums text-[#D4FF00]">
                  ${total}
                </span>
              </div>
            </div>

            {checkoutStep === 'bag' ? (
              <button
                type="button"
                onClick={() => setCheckoutStep('checkout')}
                className="w-full py-3.5 px-6 rounded-md bg-[#D4FF00] hover:bg-[#E1FF4D] text-[#0A0A0C] font-display text-sm font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Proceed to Checkout
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('bag')}
                  className="px-4 py-3.5 rounded-md bg-[#18181D] hover:bg-[#23232A] text-[#F4F4F6] text-xs font-semibold border border-white/12 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 px-6 rounded-md bg-[#D4FF00] hover:bg-[#E1FF4D] disabled:opacity-60 disabled:cursor-wait text-[#0A0A0C] font-display text-sm font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {isSubmitting ? 'Saving Order...' : `Confirm Order · $${total}`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
