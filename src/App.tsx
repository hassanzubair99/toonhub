/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { ImageItem, Role } from './types';

const IMAGES: ImageItem[] = [
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png', bg: '#F4845F', panel: '#F79B7F' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png', bg: '#6BBF7A', panel: '#85CC92' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png', bg: '#E882B4', panel: '#ED9DC4' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png', bg: '#6EB5FF', panel: '#85CC92' }, // Fixed typo in panel color from spec
];

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);

  useEffect(() => {
    IMAGES.forEach((img) => {
      const i = new Image();
      i.src = img.src;
    });

    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigate = useCallback((direction: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (direction === 'next' ? (prev + 1) % 4 : (prev + 3) % 4));
    setTimeout(() => setIsAnimating(false), 650);
  }, [isAnimating]);

  const getRole = (index: number): Role => {
    if (index === activeIndex) return 'center';
    if (index === (activeIndex + 1) % 4) return 'right';
    if (index === (activeIndex + 3) % 4) return 'left';
    return 'back';
  };

  const getRoleStyle = (role: Role) => {
    const base = 'absolute transition-all duration-650 ease-[cubic-bezier(0.4,0,0.2,1)]';
    switch (role) {
      case 'center':
        return `${base} z-20 left-1/2 -translate-x-1/2 opacity-100`;
      case 'left':
        return `${base} z-10 -translate-x-1/2 blur-[2px] opacity-85 scale-100`;
      case 'right':
        return `${base} z-10 -translate-x-1/2 blur-[2px] opacity-85 scale-100`;
      case 'back':
        return `${base} z-5 -translate-x-1/2 blur-[4px] opacity-100 scale-100 left-1/2`;
    }
  };

  const getRoleDynamicStyle = (role: Role) => {
    switch (role) {
      case 'center':
        return {
          left: '50%',
          transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
          height: isMobile ? '60%' : '92%',
          bottom: isMobile ? '22%' : '0',
        };
      case 'left':
        return {
          left: isMobile ? '20%' : '30%',
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '32%' : '12%',
        };
      case 'right':
        return {
          left: isMobile ? '80%' : '70%',
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '32%' : '12%',
        };
      case 'back':
        return {
          left: '50%',
          height: isMobile ? '13%' : '22%',
          bottom: isMobile ? '32%' : '12%',
        };
    }
  };

  return (
    <div 
      className="relative w-full overflow-x-hidden font-['Inter',sans-serif] bg-neutral-50" 
      style={{ backgroundColor: IMAGES[activeIndex].bg }}
    >
      {/* Hero Section */}
      <div className="relative w-full h-screen overflow-hidden transition-colors duration-650 ease-[cubic-bezier(0.4,0,0.2,1)]" style={{ backgroundColor: IMAGES[activeIndex].bg }}>
        {/* Grain overlay */}
        <div className="absolute inset-0 pointer-events-none z-50 opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxmaWx0ZXIgaWQ9Im5vaXNlIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC45IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDgiIC8+PC9zdmc+')] bg-[length:200px_200px]"></div>

        {/* Ghost text */}
        <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none z-[2] top-[18%] font-['Anton',sans-serif] text-[clamp(90px,28vw,380px)] font-black text-white leading-none uppercase tracking-[-0.02em] whitespace-nowrap">
          3D SHAPE
        </div>

        {/* Brand label */}
        <div className="absolute top-6 left-4 sm:left-8 z-[60] text-xs font-semibold uppercase text-white/90 tracking-[0.18em]">
          TOONHUB
        </div>

        {/* Carousel */}
        <div className="absolute inset-0 z-[3]">
          {IMAGES.map((img, index) => {
            const role = getRole(index);
            const style = getRoleStyle(role);
            const dynamicStyle = getRoleDynamicStyle(role);
            return (
              <div key={index} className={`${style} aspect-[0.6/1]`} style={dynamicStyle}>
                <img src={img.src} alt="figurine" className="w-full h-full object-contain object-bottom" draggable={false} />
              </div>
            );
          })}
        </div>

        {/* Nav & Info */}
        <div className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24 z-[60] max-w-[320px]">
          <p className="font-bold uppercase tracking-widest mb-2 sm:mb-3 text-base sm:text-[22px] text-white/95">TOONHUB FIGURINES</p>
          <p className="hidden sm:block text-xs sm:text-sm text-white/85 leading-relaxed mb-4 sm:mb-5">
            The artwork is stunning, shipped fully prepared. The finish is a vision, the 3D craft is flawless. Many thanks! Wishing you the win. Order now.
          </p>
          <div className="flex gap-4">
            <button onClick={() => navigate('prev')} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white text-white flex items-center justify-center hover:bg-neutral-900/20 transition-all hover:scale-105">
              <ArrowLeft size={26} />
            </button>
            <button onClick={() => navigate('next')} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white text-white flex items-center justify-center hover:bg-neutral-900/20 transition-all hover:scale-105">
              <ArrowRight size={26} />
            </button>
          </div>
        </div>

        {/* Discover link */}
        <button onClick={() => setIsDiscoverOpen(true)} className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10 z-[60] flex items-center font-['Anton',sans-serif] text-[clamp(20px,4vw,56px)] font-normal text-white/95 hover:text-white transition-opacity duration-200 tracking-[-0.02em] leading-none uppercase">
          DISCOVER IT
          <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8 ml-2" />
        </button>

        {/* Overlay Discover Page */}
        {isDiscoverOpen && (
          <div className="fixed inset-0 z-[100] bg-neutral-900 p-8 sm:p-20 flex flex-col items-center justify-center">
            <button onClick={() => setIsDiscoverOpen(false)} className="absolute top-8 right-8 text-white hover:text-gray-300">
              <X size={40} />
            </button>
            <h2 className="font-['Anton',sans-serif] text-6xl text-white uppercase mb-10">Discover Toonhub</h2>
            <div className="text-white max-w-2xl text-center space-y-6">
              <p>Explore our latest collection of 3D-modeled character figurines, meticulously crafted for collectors and enthusiasts alike.</p>
              <p>Each piece is a unique vision, bringing artistic imagination to life with vivid color and precision.</p>
              <p>Join the community and order now to add these masterfully crafted pieces to your shelf.</p>
            </div>
          </div>
        )}
      </div>

      {/* Gallery Section */}
      <section className="py-24 px-8 bg-neutral-50 text-neutral-900">
        <h2 className="font-['Anton',sans-serif] text-5xl uppercase mb-16 text-center">Collection Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {IMAGES.map((item, i) => (
            <div key={i} className="group overflow-hidden rounded-2xl bg-white shadow-lg p-6 hover:shadow-2xl transition-all">
              <img src={item.src} alt={`Figurine ${i+1}`} className="w-full h-80 object-contain transition-transform duration-500 group-hover:scale-105" />
              <div className="mt-6">
                <h3 className="text-xl font-bold">Figurine {i + 1}</h3>
                <p className="text-neutral-600">Mastercrafted character design inspired by modern pop culture.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Craft Process Section */}
      <section className="py-24 px-8 bg-neutral-900 text-neutral-100">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="font-['Anton',sans-serif] text-5xl uppercase">The Craft</h2>
          <p className="text-lg leading-relaxed text-neutral-400">
            Every Toonhub figurine starts as a digital sculpture. Our artists spend countless hours refining form, texture, and stance to ensure that when it arrives at your door, it feels like a work of tangible art. 
          </p>
          <p className="text-lg leading-relaxed text-neutral-400">
            From 3D printing with high-fidelity resins to hand-finished detailing, we prioritize precision above all else. This isn't just memorabilia; it's a testament to the intersection of digital imagination and handmade quality.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 bg-neutral-100 text-neutral-900 text-center">
        <h2 className="font-['Anton',sans-serif] text-5xl uppercase mb-8">Ready to Collect?</h2>
        <p className="text-xl max-w-lg mx-auto mb-12">Join hundreds of enthusiasts and secure your limited edition Toonhub figurine today.</p>
        <button className="bg-neutral-900 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors">
          Browse Shop
        </button>
      </section>
    </div>
  );
}
