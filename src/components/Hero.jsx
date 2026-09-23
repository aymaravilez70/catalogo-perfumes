import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Compass, Star } from 'lucide-react';

export default function Hero({ onExplore, onOpenQuiz, onOpenLookbook, onOpenStory, onSelectPerfume, featuredPerfumes }) {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-obsidian-950">
      
      {/* Cinematic Ambient Glow Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] bg-[radial-gradient(circle,rgba(217,119,6,0.16)_0%,transparent_70%)] rounded-full" />
        <div className="hidden sm:block absolute -top-10 left-10 w-96 h-96 bg-gold-600/10 rounded-full blur-[80px]" />
        <div className="hidden sm:block absolute bottom-10 right-10 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[90px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Main Title */}
            <div className="space-y-3">
              <h1 className="font-cinzel text-4xl sm:text-6xl xl:text-7xl font-bold tracking-wider leading-[1.08] text-white uppercase">
                WHERE ELEGANCE<br />MEETS OBSESSION
              </h1>
              <p className="text-xs sm:text-sm tracking-[0.35em] text-gold-400 uppercase font-sans font-medium">
                The Fragrance Collection — Joufab
              </p>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Las 15 fragancias árabes y de autor más codiciadas. Concentración extrema, fijación prolongada y presencia inolvidable.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                type="button"
                onClick={onExplore}
                className="group relative inline-flex items-center gap-3 px-7 py-3.5 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-black font-semibold text-sm tracking-wider uppercase rounded-full shadow-luxury hover:shadow-luxury-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <span>Explorar Colección</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onOpenQuiz}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-gold-500/40 text-gold-200 font-medium text-sm tracking-wider uppercase rounded-full backdrop-blur-md hover:border-gold-400 transition-all duration-300 group"
              >
                <Sparkles className="w-4 h-4 text-gold-400 group-hover:rotate-12 transition-transform" />
                <span>Test Olfativo</span>
              </button>
            </div>

            {/* Guarantee / Highlights Bar */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <span className="block font-cinzel text-xl sm:text-2xl font-bold text-white">15</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Fragancias TOP</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="block font-cinzel text-xl sm:text-2xl font-bold text-gold-400">100%</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Originales</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="block font-cinzel text-xl sm:text-2xl font-bold text-white">Directo</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Por WhatsApp</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Flagship Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Visual Halo */}
            <div className="absolute inset-0 bg-gold-500/10 rounded-3xl filter blur-3xl transform -rotate-3 scale-95" />

            {/* Main Featured Showcase Card */}
            {featuredPerfumes && featuredPerfumes[0] && (
              <div 
                onClick={() => onSelectPerfume(featuredPerfumes[0])}
                className="relative cursor-pointer group w-full max-w-md bg-gradient-to-b from-obsidian-850/90 to-obsidian-900/90 p-5 rounded-3xl border border-gold-500/30 backdrop-blur-xl shadow-luxury hover:border-gold-400/70 transition-all duration-500"
              >
                
                {/* Badge */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 bg-obsidian-950/80 border border-gold-500/50 rounded-full text-[11px] text-gold-300 font-medium">
                  <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                  <span>Destacado de la Semana</span>
                </div>

                <div className="absolute top-4 right-4 z-20 px-2.5 py-0.5 bg-black/60 border border-white/10 rounded-full text-[10px] text-slate-300 font-mono">
                  #{featuredPerfumes[0].num}
                </div>

                {/* Bottle Image */}
                <div className="relative w-full h-80 sm:h-96 overflow-hidden rounded-2xl bg-black/40 flex items-center justify-center p-2">
                  <img
                    src={featuredPerfumes[0].image}
                    alt={featuredPerfumes[0].name}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent opacity-80" />
                  
                  {/* Floating Action Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="px-5 py-2.5 rounded-full bg-gold-500 text-black font-semibold text-xs tracking-wider uppercase shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      Ver Ficha Sensorial
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="pt-4 space-y-1.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] uppercase tracking-widest text-gold-400/90 font-medium">
                        {featuredPerfumes[0].brand}
                      </span>
                      <h3 className="font-cinzel text-xl font-bold text-white group-hover:text-gold-300 transition-colors">
                        {featuredPerfumes[0].name}
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-slate-300">
                      {featuredPerfumes[0].category}
                    </span>
                  </div>

                  {featuredPerfumes[0].inspired_by && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gold-500/10 border border-gold-500/20 text-[11px] text-gold-300">
                      <Sparkles className="w-3 h-3 text-gold-400 shrink-0" />
                      <span className="truncate">
                        <span className="text-slate-400 text-[9px] uppercase font-bold mr-1">Inspiración:</span>
                        <span className="font-semibold text-white">{featuredPerfumes[0].inspired_by}</span>
                      </span>
                    </div>
                  )}
                  
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {featuredPerfumes[0].description}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-gold-400 font-medium">
                    <span>Salida: {featuredPerfumes[0].notes.salida.slice(0, 3).join(', ')}</span>
                    <span className="group-hover:translate-x-1 transition-transform">Ver pirámide →</span>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
