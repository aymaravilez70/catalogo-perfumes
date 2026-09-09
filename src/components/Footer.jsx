import React from 'react';
import { Sparkles, MessageCircle, ShieldCheck, Truck, Clock } from 'lucide-react';

export default function Footer({ onOpenQuiz, onOpenLookbook }) {
  return (
    <footer className="bg-obsidian-950 border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Propositions Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-white/10 text-center md:text-left">
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-gold-500/10 border border-gold-500/20 text-gold-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-cinzel text-base font-bold text-white">100% Fragancias Originales</h4>
              <p className="text-xs text-slate-400 mt-0.5">Procedencia verificada de las casas árabes más prestigiosas.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-gold-500/10 border border-gold-500/20 text-gold-400">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-cinzel text-base font-bold text-white">Envíos & Entregas Seguras</h4>
              <p className="text-xs text-slate-400 mt-0.5">Empaque reforzado para proteger cada frasco y caja de colección.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <MessageCircle className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-cinzel text-base font-bold text-white">Atención Personalizada</h4>
              <p className="text-xs text-slate-400 mt-0.5">Asesoría directa en WhatsApp para elegir tu fragancia ideal.</p>
            </div>
          </div>

        </div>

        {/* Main Footer Info */}
        <div className="pt-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-between">
          
          <div className="md:col-span-6 text-center md:text-left space-y-3">
            <div className="flex items-center justify-center md:justify-start gap-3">
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
            </div>

            <p className="text-xs text-slate-400 max-w-sm mx-auto md:mx-0 leading-relaxed">
              "Where Elegance Meets Obsession". Especialistas en perfumería árabe de nicho y alta gama. Lattafa, Rasasi, Armaf, Afnan y Dumont.
            </p>
          </div>

          <div className="md:col-span-6 flex flex-wrap items-center justify-center md:justify-end gap-6 text-xs text-slate-300">
            <a href="#catalogo" className="hover:text-gold-400 transition-colors">
              Colección Completa
            </a>
            <button onClick={onOpenQuiz} className="hover:text-gold-400 transition-colors">
              Test Olfativo
            </button>
            <button onClick={onOpenLookbook} className="hover:text-gold-400 transition-colors">
              Catálogo Original PDF
            </button>
            <a 
              href="https://wa.me/" 
              target="_blank" 
              rel="noreferrer"
              className="px-4 py-2 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-600/30 transition-all font-semibold flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Contactar por WhatsApp</span>
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
