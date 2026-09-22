import React from 'react';
import { MessageCircle, Heart, Lock } from 'lucide-react';

export default function Footer({ onNavigate, onOpenQuiz, onOpenLookbook, onOpenStory, onOpenAdmin }) {
  return (
    <footer className="bg-obsidian-950 border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Info */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-between">
          
          <div className="md:col-span-6 text-center md:text-left space-y-3">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <button 
                onClick={() => onNavigate && onNavigate('home')} 
                className="flex items-center gap-3 text-left"
              >
                <img 
                  src="/assets/brand/logo.png" 
                  alt="Joufab Logo" 
                  className="h-10 w-auto object-contain"
                />
                <div>
                  <span className="font-cinzel text-xl font-bold tracking-[0.2em] text-white block">
                    JOUFAB
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-gold-400 block -mt-1">
                    Perfume House
                  </span>
                </div>
              </button>
            </div>

            <p className="text-xs text-slate-400 max-w-sm mx-auto md:mx-0 leading-relaxed">
              "Where Elegance Meets Obsession". Especialistas en perfumería árabe de nicho y alta gama. Lattafa, Rasasi, Armaf, Afnan y Dumont.
            </p>
          </div>

          <div className="md:col-span-6 flex flex-wrap items-center justify-center md:justify-end gap-6 text-xs text-slate-300">
            <button 
              onClick={() => onNavigate && onNavigate('catalog')} 
              className="hover:text-gold-400 transition-colors"
            >
              Boutique Catálogo
            </button>
            <button 
              onClick={() => {
                if (onNavigate) onNavigate('home');
                setTimeout(() => {
                  const el = document.getElementById('academia');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 150);
              }} 
              className="hover:text-gold-400 transition-colors"
            >
              Academia & Guía
            </button>
            <button onClick={onOpenQuiz} className="hover:text-gold-400 transition-colors">
              Test Olfativo
            </button>
            <button onClick={onOpenLookbook} className="hover:text-gold-400 transition-colors">
              Catálogo PDF 2026
            </button>
            <button onClick={onOpenStory} className="hover:text-rose-400 transition-colors flex items-center gap-1.5 text-rose-300/90">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>Nuestra Historia</span>
            </button>
            <button 
              onClick={onOpenAdmin}
              className="text-gold-400/80 hover:text-gold-300 font-medium transition-colors flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-gold-500/20"
            >
              <Lock className="w-3.5 h-3.5 text-gold-400" />
              <span>Panel Admin</span>
            </button>
            <a 
              href="https://wa.me/593984526114?text=Hola%20Joufab%2C%20quisiera%20consultar%20sobre%20el%20cat%C3%A1logo%20de%20perfumes" 
              target="_blank" 
              rel="noreferrer"
              className="px-4 py-2 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-600/30 transition-all font-semibold flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: 0984526114</span>
            </a>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <span>© {new Date().getFullYear()} JOUFAB Perfume House. Todos los derechos reservados.</span>
          <span>Catálogo digital interactivo desarrollado para exhibición y venta directa.</span>
        </div>

      </div>
    </footer>
  );
}
