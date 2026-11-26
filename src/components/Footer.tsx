import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { ProductCategory } from '../data/products';

interface FooterProps {
  onNavigateCategory: (category: ProductCategory) => void;
}

export function Footer({ onNavigateCategory }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#0A0A0C] text-[#A1A1AA]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/[0.08]">
          {/* Brand Summary */}
          <div className="md:col-span-4 space-y-3">
            <span className="font-display text-2xl font-black tracking-[-0.04em] text-[#F4F4F6] block">
              OBLIQUE
            </span>
            <p className="text-sm leading-relaxed max-w-xs">
              Independent contemporary streetwear label based in London, Tokyo,
              and New York. Small-batch drops, zero restocks.
            </p>
          </div>

          {/* Quick Category Links */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6 text-sm">
            <div className="space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#F4F4F6]">
                Categories
              </p>
              <ul className="space-y-2">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateCategory('Hoodies & Sweats')}
                    className="hover:text-[#D4FF00] transition-colors cursor-pointer"
                  >
                    Oversized Hoodies
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateCategory('Pants & Denim')}
                    className="hover:text-[#D4FF00] transition-colors cursor-pointer"
                  >
                    Baggy Jeans & Cargos
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateCategory('Tees & Outerwear')}
                    className="hover:text-[#D4FF00] transition-colors cursor-pointer"
                  >
                    Graphic Tees & Jackets
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateCategory('Footwear & Gear')}
                    className="hover:text-[#D4FF00] transition-colors cursor-pointer"
                  >
                    Sneakers & Accessories
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#F4F4F6]">
                Client Care
              </p>
              <ul className="space-y-2 text-xs leading-relaxed">
                <li>Worldwide DHL Express</li>
                <li>Free shipping over $250</li>
                <li>30-day unworn exchanges</li>
                <li>support@oblique-archive.com</li>
              </ul>
            </div>
          </div>

          {/* Drop Dispatch Signup */}
          <div className="md:col-span-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#F4F4F6]">
              Early Access List
            </p>
            <p className="text-xs text-[#A1A1AA]">
              Get private passcodes 2 hours before public drop releases.
            </p>

            {subscribed ? (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#131317] border border-[#D4FF00]/50 text-xs font-medium text-[#D4FF00]">
                <Check className="w-4 h-4" />
                <span>You are on the Drop 05 early access list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  aria-label="Email for drop alerts"
                  className="flex-1 min-w-0 px-3.5 py-2.5 text-sm bg-[#131317] text-[#F4F4F6] placeholder-[#71717A] border border-white/10 rounded-md focus:outline-none focus:border-[#D4FF00]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#D4FF00] hover:bg-[#E1FF4D] text-[#0A0A0C] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#71717A]">
          <p>© {new Date().getFullYear()} OBLIQUE ARCHIVE. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>London</span>
            <span aria-hidden="true">·</span>
            <span>Tokyo</span>
            <span aria-hidden="true">·</span>
            <span>New York</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
