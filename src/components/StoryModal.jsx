import React from 'react';
import { X, Sparkles, Heart, BookOpen, Quote } from 'lucide-react';

export default function StoryModal({ isOpen, onClose, onOpenLookbook }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-gradient-to-b from-obsidian-900 via-obsidian-950 to-black border border-gold-500/40 rounded-3xl shadow-2xl p-6 sm:p-10 z-10 overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs uppercase tracking-widest font-mono">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Nuestra Esencia • Catálogo 2026</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            La Historia Detrás de <span className="gold-text-gradient">Joufab</span>
          </h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">
            Página Oficial de Dedicatoria
          </p>
        </div>

        {/* Dedication Card */}
        <div className="relative bg-white/[0.03] border border-gold-500/20 rounded-2xl p-6 sm:p-8 space-y-5 text-slate-200 leading-relaxed font-serif text-sm sm:text-base">
          <Quote className="w-8 h-8 text-gold-500/30 absolute top-4 left-4 pointer-events-none" />
          
          <p className="italic relative z-10 pt-2 text-slate-300">
            "Desde niño, los perfumes despertaron en mí una pasión y una curiosidad que, con el tiempo, se convirtieron en un sueño: crear mi propia colección y descubrir el mundo detrás de cada aroma."
          </p>

          <p className="italic relative z-10 text-slate-300">
            "Hoy, agradezco a Dios por guiar mi camino, abrir oportunidades y poner a las personas correctas a mi lado. Entre ellas, <span className="text-gold-300 font-semibold not-italic">Faby, mi novia, mi pilar y compañera</span>, cuyo apoyo y confianza han sido fundamentales para convertir este sueño en realidad."
          </p>

          <p className="italic relative z-10 text-slate-300">
            "Así nace este proyecto: desde la pasión, la fe y el deseo de descubrir, aprender y ayudar a otros a encontrar una fragancia que realmente los represente."
          </p>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-sans text-slate-400">
            <span className="flex items-center gap-1 text-rose-300/80 font-medium">
              <Heart className="w-3.5 h-3.5 fill-rose-400/60 text-rose-400" />
              Dedicatoria Especial a Faby
            </span>
            <span className="text-gold-400 font-cinzel font-semibold">
              Joufab Perfume House
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              onClose();
              if (onOpenLookbook) onOpenLookbook();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-black font-semibold text-xs tracking-wider uppercase shadow-gold-sm hover:brightness-110 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Hojear Catálogo 2026 en PDF</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 text-xs tracking-wider uppercase transition-colors"
          >
            Volver a la Tienda
          </button>
        </div>

      </div>
    </div>
  );
}
