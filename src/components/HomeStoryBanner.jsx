import React from 'react';
import { Heart, BookOpen, Sparkles, Quote, ArrowRight } from 'lucide-react';

export default function HomeStoryBanner({ onOpenStory, onOpenLookbook }) {
  return (
    <section className="py-20 bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950 border-t border-white/5 relative overflow-hidden">
      
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[350px] bg-rose-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-8 sm:p-12 md:p-16 rounded-3xl bg-gradient-to-br from-obsidian-900/90 via-obsidian-950/90 to-obsidian-900/90 border border-gold-500/25 shadow-2xl backdrop-blur-xl relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Monogram & Quote */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-[0.25em]">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                Dedicatoria Especial • Faby
              </div>

              <div className="relative">
                <Quote className="w-12 h-12 text-gold-500/20 absolute -top-5 -left-4 -z-10" />
                <h3 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug">
                  "El perfume es el recuerdo más fiel que una persona deja en el mundo."
                </h3>
              </div>

              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                Joufab nace como un tributo a la elegancia eterna y la memoria imborrable de Faby. Cada fragancia de este catálogo 2026 fue seleccionada minuciosamente para evocar carácter, distinción y una presencia que nunca se desvanece.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onOpenStory}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold tracking-wider uppercase transition-all duration-300"
                >
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>Leer Carta de Fundación Completa</span>
                </button>

                <button
                  onClick={onOpenLookbook}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/15 text-xs font-semibold tracking-wider uppercase transition-all duration-300"
                >
                  <BookOpen className="w-4 h-4 text-gold-400" />
                  <span>Ver Catálogo PDF 2026 (18 Páginas)</span>
                </button>
              </div>

            </div>

            {/* Right Column: Visual Frame */}
            <div className="lg:col-span-4 flex justify-center">
              <div 
                onClick={onOpenLookbook}
                className="cursor-pointer group relative max-w-xs rounded-2xl overflow-hidden border border-gold-500/30 shadow-2xl hover:border-gold-400/70 transition-all duration-500 transform hover:scale-105"
              >
                <img
                  src="/assets/all_pages/page_02.png"
                  alt="Dedicatoria a Faby en Catálogo"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <span className="text-[11px] text-gold-300 uppercase tracking-widest font-semibold bg-black/80 px-3 py-1 rounded-full border border-gold-500/30">
                    Página 02 del Catálogo Oficial
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
