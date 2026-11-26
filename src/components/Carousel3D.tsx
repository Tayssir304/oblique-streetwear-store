import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  MoveHorizontal,
  Pause,
  Play,
  Plus,
} from 'lucide-react';
import { Product } from '../data/products';
import { ProductImage } from './ProductImage';

interface Carousel3DProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onBrowseAll: () => void;
}

function normalizeAngleDiff(diff: number): number {
  let d = diff % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
}

export function Carousel3D({
  products,
  onSelectProduct,
  onQuickAdd,
  onBrowseAll,
}: Carousel3DProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(1280);
  const [rotation, setRotation] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const rotationRef = useRef(0);
  const targetRotationRef = useRef<number | null>(null);
  const velocityRef = useRef(0);
  const dragStartXRef = useRef(0);
  const dragStartRotRef = useRef(0);
  const dragMovedRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const prefersReducedMotionRef = useRef(false);

  const count = products.length;
  const stepAngle = (Math.PI * 2) / count;

  useEffect(() => {
    prefersReducedMotionRef.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotionRef.current) {
      setIsAutoPlaying(false);
    }
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setStageWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Main 60fps animation loop for smooth 3D orbit + inertia + snap targets
  useEffect(() => {
    let rafId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (!isDragging) {
        if (targetRotationRef.current !== null) {
          const diff = targetRotationRef.current - rotationRef.current;
          rotationRef.current += diff * Math.min(1, dt * 8.5);
          if (Math.abs(diff) < 0.001) {
            rotationRef.current = targetRotationRef.current;
            targetRotationRef.current = null;
          }
          setRotation(rotationRef.current);
        } else if (Math.abs(velocityRef.current) > 0.0004) {
          rotationRef.current += velocityRef.current;
          velocityRef.current *= Math.pow(0.92, dt * 60);
          setRotation(rotationRef.current);
        } else if (
          isAutoPlaying &&
          !isHovered &&
          !prefersReducedMotionRef.current
        ) {
          rotationRef.current -= dt * 0.165;
          setRotation(rotationRef.current);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isAutoPlaying, isDragging, isHovered]);

  // Determine which product is currently closest to center front (angle ~ 0)
  let activeIndex = 0;
  let smallestAbs = Infinity;
  for (let i = 0; i < count; i++) {
    const theta = normalizeAngleDiff(i * stepAngle + rotation);
    if (Math.abs(theta) < smallestAbs) {
      smallestAbs = Math.abs(theta);
      activeIndex = i;
    }
  }
  const activeProduct = products[activeIndex];

  const rotateToIndex = useCallback(
    (index: number) => {
      const current = rotationRef.current;
      const desiredBase = -index * stepAngle;
      const delta = normalizeAngleDiff(desiredBase - current);
      velocityRef.current = 0;
      targetRotationRef.current = current + delta;
    },
    [stepAngle]
  );

  const handleStep = useCallback(
    (direction: -1 | 1) => {
      const nextIndex = (activeIndex + direction + count) % count;
      rotateToIndex(nextIndex);
    },
    [activeIndex, count, rotateToIndex]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Allow buttons inside stage to handle clicks directly
    if ((e.target as HTMLElement).closest('button[data-carousel-control]')) {
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    targetRotationRef.current = null;
    velocityRef.current = 0;
    dragStartXRef.current = e.clientX;
    dragStartRotRef.current = rotationRef.current;
    dragMovedRef.current = 0;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = performance.now();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartXRef.current;
    dragMovedRef.current = Math.max(dragMovedRef.current, Math.abs(dx));

    const sensitivity = stageWidth < 640 ? 0.0055 : 0.0032;
    rotationRef.current = dragStartRotRef.current + dx * sensitivity;
    setRotation(rotationRef.current);

    const now = performance.now();
    const dt = Math.max(8, now - lastPointerTimeRef.current);
    const stepDx = e.clientX - lastPointerXRef.current;
    velocityRef.current = (stepDx * sensitivity * 16) / dt;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = now;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
  };

  const handleCardClick = (index: number, product: Product) => {
    // Ignore click if the user just dragged the carousel
    if (dragMovedRef.current > 8) return;
    if (index === activeIndex) {
      onSelectProduct(product);
    } else {
      rotateToIndex(index);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleStep(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleStep(-1);
    } else if (e.key === 'Enter') {
      onSelectProduct(activeProduct);
    }
  };

  // Responsive 3D orbit radii & card dimensions
  const isMobile = stageWidth < 640;
  const isTablet = stageWidth >= 640 && stageWidth < 1024;
  const cardWidth = isMobile ? 210 : isTablet ? 250 : 300;
  const cardHeight = Math.round(cardWidth * 1.33);
  const radiusX = isMobile
    ? Math.max(155, stageWidth * 0.42)
    : isTablet
      ? 330
      : Math.min(480, stageWidth * 0.36);
  const radiusZ = isMobile ? 160 : isTablet ? 260 : 340;

  return (
    <section
      id="carousel-stage"
      className="relative overflow-hidden border-b border-white/[0.08] bg-[#0A0A0C]"
    >
      {/* Subtle architectural floor spotlight glow behind center item */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto w-[680px] h-[420px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(212,255,0,0.09)_0%,rgba(255,255,255,0.03)_42%,transparent_72%)] blur-2xl"
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-10 pt-8 pb-12 md:pt-12 md:pb-16">
        {/* Editorial Hero Intro Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-4 md:mb-6">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-[0.18em] uppercase text-[#A1A1AA] mb-2.5">
              Drop 04 · Heavyweight Silhouette Archive
            </p>
            <h1
              className="font-display font-black tracking-[-0.03em] leading-[0.95] text-[#F4F4F6]"
              style={{
                fontSize: 'clamp(2.35rem, 4.4vw, 4.25rem)',
                textWrap: 'balance',
              }}
            >
              Volume built for the street.
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2 text-xs text-[#A1A1AA]">
              <MoveHorizontal className="w-4 h-4 text-[#D4FF00]" strokeWidth={1.75} />
              <span>Drag, swipe, or click any piece to inspect</span>
            </span>
            <button
              type="button"
              onClick={onBrowseAll}
              className="px-4 py-2 text-xs font-semibold tracking-wide bg-white/[0.06] hover:bg-white/[0.12] text-[#F4F4F6] border border-white/12 rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF00]"
            >
              Browse Full Catalog
            </button>
          </div>
        </div>

        {/* 3D Interactive Product Carousel Viewport */}
        <div
          ref={stageRef}
          tabIndex={0}
          role="region"
          aria-roledescription="3D product carousel"
          aria-label="Featured Drop 04 Streetwear 3D Carousel"
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`relative w-full select-none outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF00]/60 rounded-xl ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            height: `${cardHeight + (isMobile ? 90 : 120)}px`,
            perspective: '1450px',
            perspectiveOrigin: '50% 48%',
            touchAction: 'pan-y',
          }}
        >
          {/* Ambient radial floor ring */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 bottom-6 -translate-x-1/2 w-[78%] max-w-[820px] h-16 rounded-[100%] border border-white/[0.07] bg-gradient-to-b from-white/[0.03] to-transparent"
            style={{ transform: 'rotateX(76deg)' }}
          />

          {/* 3D Orbital Cards */}
          <div
            className="relative w-full h-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {products.map((product, index) => {
              const theta = normalizeAngleDiff(index * stepAngle + rotation);
              const cosTheta = Math.cos(theta);
              const sinTheta = Math.sin(theta);

              // depthFactor ranges from 0 (far back) to 1 (dead center front)
              const depthFactor = (cosTheta + 1) / 2;
              const isCenter = index === activeIndex;

              const translateX = sinTheta * radiusX;
              const translateZ = cosTheta * radiusZ - radiusZ;
              const rotateY = -sinTheta * 28;
              const scale = 0.56 + 0.48 * Math.pow(depthFactor, 1.15);
              const opacity = 0.22 + 0.78 * Math.pow(depthFactor, 1.35);
              const brightness = 0.42 + 0.58 * depthFactor;
              const zIndex = Math.round(depthFactor * 100);

              return (
                <div
                  key={product.id}
                  onClick={() => handleCardClick(index, product)}
                  role="button"
                  tabIndex={isCenter ? 0 : -1}
                  aria-label={`${product.name} — $${product.price}. ${
                    isCenter ? 'Click to view details' : 'Click to bring to front'
                  }`}
                  style={{
                    width: `${cardWidth}px`,
                    height: `${cardHeight}px`,
                    left: '50%',
                    top: '50%',
                    zIndex,
                    opacity,
                    transform: `translate3d(-50%, -50%, 0) translate3d(${translateX.toFixed(
                      2
                    )}px, 0px, ${translateZ.toFixed(
                      2
                    )}px) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(
                      4
                    )})`,
                    filter: `brightness(${brightness.toFixed(3)})`,
                    willChange: 'transform, opacity',
                  }}
                  className="absolute group focus-visible:outline-none"
                >
                  <div
                    className={`relative w-full h-full rounded-xl overflow-hidden bg-[#131317] transition-all duration-300 ${
                      isCenter
                        ? 'animate-float-slow border border-[#D4FF00]/65 shadow-[0_28px_70px_rgba(0,0,0,0.85),0_0_32px_rgba(212,255,0,0.12)]'
                        : 'border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.65)] hover:border-white/30'
                    }`}
                  >
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      draggable={false}
                      className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
                        isCenter ? 'group-hover:scale-[1.07]' : 'group-hover:scale-[1.03]'
                      }`}
                    />

                    {/* Measured bottom contrast scrim */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                    {/* Card Overlay Info */}
                    <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#D4FF00] truncate">
                          {product.garmentType}
                        </p>
                        <h2 className="font-display text-base md:text-lg font-bold tracking-tight text-[#F4F4F6] truncate">
                          {product.name}
                        </h2>
                      </div>
                      <span className="font-mono tabular-nums text-sm md:text-base font-bold text-[#F4F4F6] shrink-0">
                        ${product.price}
                      </span>
                    </div>

                    {/* Hover prompt on center active item */}
                    {isCenter && (
                      <div className="pointer-events-none absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#0A0A0C]/85 border border-white/15 text-[11px] font-semibold text-[#F4F4F6]">
                        <span>View Piece</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#D4FF00]" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Left / Right Floating Carousel Controls */}
          <button
            type="button"
            data-carousel-control="true"
            onClick={() => handleStep(-1)}
            aria-label="Previous garment"
            className="absolute left-1 md:left-4 top-1/2 -translate-y-1/2 z-[120] w-11 h-11 rounded-full bg-[#131317]/90 hover:bg-[#D4FF00] text-[#F4F4F6] hover:text-[#0A0A0C] border border-white/15 flex items-center justify-center transition-colors duration-150 cursor-pointer shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF00]"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          </button>

          <button
            type="button"
            data-carousel-control="true"
            onClick={() => handleStep(1)}
            aria-label="Next garment"
            className="absolute right-1 md:right-4 top-1/2 -translate-y-1/2 z-[120] w-11 h-11 rounded-full bg-[#131317]/90 hover:bg-[#D4FF00] text-[#F4F4F6] hover:text-[#0A0A0C] border border-white/15 flex items-center justify-center transition-colors duration-150 cursor-pointer shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF00]"
          >
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Active Spotlight Bar below 3D Stage */}
        <div className="mt-4 pt-6 border-t border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Active Item Details */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                <span className="font-mono tabular-nums text-[#D4FF00]">
                  {String(activeIndex + 1).padStart(2, '0')} /{' '}
                  {String(count).padStart(2, '0')}
                </span>
                <span aria-hidden="true">·</span>
                <span>{activeProduct.garmentType}</span>
                <span aria-hidden="true">·</span>
                <span>{activeProduct.fabric}</span>
              </div>
              <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight text-[#F4F4F6] mt-0.5">
                {activeProduct.name}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onSelectProduct(activeProduct)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-wide bg-[#D4FF00] hover:bg-[#E1FF4D] text-[#0A0A0C] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Open Product Page</span>
                <ArrowUpRight className="w-4 h-4" strokeWidth={2.2} />
              </button>

              <button
                type="button"
                onClick={() => onQuickAdd(activeProduct)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold tracking-wide bg-[#18181D] hover:bg-[#23232A] text-[#F4F4F6] border border-white/12 rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF00]"
              >
                <Plus className="w-3.5 h-3.5 text-[#D4FF00]" strokeWidth={2.2} />
                <span>Quick Add · ${activeProduct.price}</span>
              </button>
            </div>
          </div>

          {/* Carousel Controls: Index Dots + Orbit Toggle */}
          <div className="flex items-center justify-between md:justify-end gap-5">
            <div
              className="flex items-center gap-1.5"
              role="tablist"
              aria-label="Select featured product"
            >
              {products.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={idx === activeIndex}
                  aria-label={`Focus ${p.name}`}
                  onClick={() => rotateToIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF00] ${
                    idx === activeIndex
                      ? 'w-7 bg-[#D4FF00]'
                      : 'w-2 bg-white/20 hover:bg-white/45'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsAutoPlaying((prev) => !prev)}
              aria-label={isAutoPlaying ? 'Pause 3D orbit' : 'Play 3D orbit'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#A1A1AA] hover:text-[#F4F4F6] bg-[#131317] border border-white/10 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF00]"
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#D4FF00]" />
                  <span>Pause Orbit</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[#D4FF00]" />
                  <span>Auto Orbit</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
