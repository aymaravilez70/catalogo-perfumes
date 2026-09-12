import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function FeaturedIcons({ 
  perfumes, 
  onSelectPerfume, 
  onNavigateToCatalog 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine how many cards are visible
  const itemsPerView = windowWidth >= 1280 ? 4 : windowWidth >= 1024 ? 3 : windowWidth >= 640 ? 2 : 1;
  const maxIndex = Math.max(0, perfumes.length - itemsPerView);

  // Auto-rolling timer (ruedan solas)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 2600);
    return () => clearInterval(interval);
  }, [isPaused, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <section 
      className="py-16 bg-gradient-to-b from-obsidian-950 via-obsidian-900/60 to-obsidian-950 border-t border-white/5 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gold-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Minimalist Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold-400 font-semibold block">
              Colección 2026
            </span>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-white tracking-tight">
              ÍCONOS DE LA CASA
            </h2>
          </div>

          {/* Slider Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-obsidian-900 hover:bg-gold-500 text-slate-300 hover:text-black border border-white/10 hover:border-gold-500 transition-all active:scale-95"
              title="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-2.5 rounded-full bg-obsidian-900 hover:bg-gold-500 text-slate-300 hover:text-black border border-white/10 hover:border-gold-500 transition-all active:scale-95"
              title="Siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Auto-Rolling Slider Carousel */}
        <div className="overflow-hidden rounded-3xl">
          <div 
            className="flex transition-transform duration-700 ease-out"
            style={{ 
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` 
            }}
          >
            {perfumes.map((perfume) => (
              <div 
                key={perfume.id}
                style={{ width: `${100 / itemsPerView}%` }}
                className="shrink-0 px-2.5"
              >
                <div 
                  onClick={() => onSelectPerfume(perfume)}
                  className="group cursor-pointer bg-gradient-to-b from-obsidian-900/90 to-obsidian-950/90 rounded-2xl border border-white/10 hover:border-gold-500/50 p-3 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Perfume Bottle Image (Clean Focus) */}
                  <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-black/60 flex items-center justify-center p-2 mb-3">
                    <img
                      src={perfume.image}
                      alt={perfume.name}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Number Badge */}
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/80 font-mono text-[10px] text-slate-300 font-bold border border-white/10">
                      #{perfume.num}
                    </div>

                    {/* Subtle Hover Lens Badge */}
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <span className="px-3.5 py-1.5 rounded-full bg-gold-500 text-black font-semibold text-[11px] tracking-wider uppercase shadow-lg">
                        Ver Ficha
                      </span>
                    </div>
                  </div>

                  {/* Clean Minimal Info: Precise Words */}
                  <div className="space-y-1 text-center px-1 pb-1">
                    <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">
                      {perfume.brand}
                    </span>

                    <h3 className="font-cinzel text-base font-bold text-white group-hover:text-gold-300 transition-colors truncate">
                      {perfume.name}
                    </h3>

                    {perfume.inspired_by && (
                      <div className="pt-0.5">
                        <span className="text-[11px] text-slate-300 truncate block font-sans">
                          <span className="text-slate-500 text-[10px] mr-1 uppercase">Inspirado en:</span>
                          <span className="text-gold-200/90 font-medium">{perfume.inspired_by}</span>
                        </span>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Minimal Bottom CTA */}
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={onNavigateToCatalog}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-black font-bold text-xs tracking-widest uppercase shadow-luxury hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <span>Ver Catálogo Completo (15 Fragancias)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
