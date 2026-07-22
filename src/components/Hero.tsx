import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Edit3, Image } from 'lucide-react';
import { Banner } from '../types';
import { getDirectImageUrl } from '../utils/imageUtils';

interface HeroProps {
  banners: Banner[];
  setActivePage: (page: 'home' | 'products' | 'about' | 'inquiry' | 'admin') => void;
  setSelectedCategory: (cat: string) => void;
  isAdminLoggedIn?: boolean;
  onEditBanners?: () => void;
}

export default function Hero({ banners, setActivePage, setSelectedCategory, isAdminLoggedIn = false, onEditBanners }: HeroProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  if (!banners || banners.length === 0) return null;

  return (
    <div className="relative h-[480px] sm:h-[580px] lg:h-[650px] bg-neutral-950 overflow-hidden" id="hero-slider-container">
      
      {/* Admin Hero Slide Control Floating Overlay */}
      {isAdminLoggedIn && onEditBanners && (
        <div className="absolute top-6 right-6 z-40">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditBanners();
            }}
            className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-white font-sans font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg border border-amber-400 transition-all cursor-pointer"
          >
            <Edit3 size={14} />
            <span>메인 배너 편집</span>
          </button>
        </div>
      )}

      {/* Slider Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/85 via-neutral-950/50 to-neutral-950/20 z-10" />
          <img
            src={getDirectImageUrl(banners[current].imageUrl)}
            alt={banners[current].title}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
            id={`hero-bg-img-${current}`}
          />

          {/* Slide Text */}
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl text-white">
                
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-sans tracking-tight leading-tight sm:leading-none text-neutral-50"
                >
                  {banners[current].title}
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="mt-4 text-base sm:text-lg text-neutral-300 font-sans tracking-wide font-light leading-relaxed"
                >
                  {banners[current].subtitle}
                </motion.p>
                

              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Manual Slide Controls */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-neutral-900/40 backdrop-blur-sm border border-white/10 hover:bg-neutral-900/75 text-white p-2.5 rounded-full hover:scale-105 transition-all focus:outline-none cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-neutral-900/40 backdrop-blur-sm border border-white/10 hover:bg-neutral-900/75 text-white p-2.5 rounded-full hover:scale-105 transition-all focus:outline-none cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  current === idx ? 'w-8 bg-neutral-50' : 'w-2 bg-white/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}



    </div>
  );
}
