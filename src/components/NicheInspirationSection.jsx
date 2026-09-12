import React from 'react';
import { Sparkles, ArrowRight, Check, Flame, ShieldCheck, Gem, Compass } from 'lucide-react';

export default function NicheInspirationSection({ onNavigateToCatalogWithFilter }) {
  const comparisons = [
    {
      arab: 'Khamrah',
      house: 'Lattafa',
      niche: "Angels' Share",
      nicheBrand: 'Kilian Paris',
      profile: 'Canela, Dátiles & Praliné',
      filterQuery: 'khamrah',
      tag: 'Gourmand de Culto'
    },
    {
      arab: 'Hawas Kobra',
      house: 'Rasasi',
      niche: "L'Immensité",
      nicheBrand: 'Louis Vuitton',
      profile: 'Jengibre, Pomelo & Ambroxan',
      filterQuery: 'hawas kobra',
      tag: 'Lujo Cítrico Ambarado'
    },
    {
      arab: 'Asad',
      house: 'Lattafa',
      niche: 'Sauvage Elixir',
      nicheBrand: 'Dior',
      profile: 'Pimienta, Café & Tabaco',
      filterQuery: 'asad',
      tag: 'Elegancia Bestial'
    },
    {
      arab: 'Club De Nuit Milestone',
      house: 'Armaf',
      niche: 'Millésime Impérial',
      nicheBrand: 'Creed',
      profile: 'Melón Marino & Brisa Salada',
      filterQuery: 'milestone',
      tag: 'Realeza Marina'
    },
    {
      arab: 'Eclaire',
      house: 'Lattafa',
      niche: 'Bianco Latte',
      nicheBrand: 'Giardini di Toscana',
      profile: 'Leche Tibia, Miel & Caramelo',
      filterQuery: 'eclaire',
      tag: 'La Obsesión Gourmand'
    },
    {
      arab: '9 PM',
      house: 'Afnan',
      niche: 'Ultra Male',
      nicheBrand: 'Jean Paul Gaultier',
      profile: 'Manzana Dulce, Canela & Vainilla',
      filterQuery: '9 pm',
      tag: 'El Rey de la Noche'
    }
  ];

  return (
    <section className="py-24 bg-obsidian-950 border-t border-white/5 relative overflow-hidden">
      
      {/* Background radial accent */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-[10px] uppercase tracking-[0.35em] text-gold-400 font-bold block">
            Equivalencias de Ultra Lujo
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white tracking-tight">
            ALTA INSPIRACIÓN
          </h2>
          <p className="text-sm text-slate-300 font-light">
            Formulaciones de alta concentración inspiradas en los iconos más exclusivos de la perfumería mundial.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comparisons.map((c, i) => (
            <div 
              key={i}
              onClick={() => onNavigateToCatalogWithFilter(c.filterQuery)}
              className="group cursor-pointer bg-gradient-to-b from-obsidian-900/90 to-obsidian-950/90 rounded-2xl border border-white/10 hover:border-gold-500/50 p-6 space-y-4 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Badge */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-gold-500/10 text-gold-300 border border-gold-500/20">
                  {c.tag}
                </span>
                <span className="text-xs text-slate-400 group-hover:text-gold-400 font-mono flex items-center gap-1 transition-colors">
                  Ver en boutique →
                </span>
              </div>

              {/* Fragrance Duo */}
              <div className="space-y-2">
                <div className="flex items-baseline justify-between border-b border-white/5 pb-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-sans font-semibold">Fragancia Joufab</span>
                    <h3 className="font-cinzel text-lg font-bold text-white group-hover:text-gold-300 transition-colors">
                      {c.arab}
                    </h3>
                    <span className="text-[11px] text-gold-400 font-sans">{c.house}</span>
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-[10px] uppercase tracking-wider text-gold-400/90 block font-sans font-semibold">Inspirada en el icono de:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-200">
                      {c.niche}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({c.nicheBrand})
                    </span>
                  </div>
                </div>
              </div>

              {/* Olfactory profile */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span className="truncate max-w-[220px] italic">
                  "{c.profile}"
                </span>
                <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              </div>

            </div>
          ))}
        </div>

        {/* Highlighting 3 Pillars */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-white/10 pt-12">
          
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-obsidian-900/50 border border-white/5">
            <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 shrink-0">
              <Flame className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-cinzel text-base font-bold text-white">Fijación Extrema</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Concentraciones altas en aceites esenciales que aseguran entre 8 y 14 horas de duración real en piel.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-obsidian-900/50 border border-white/5">
            <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-cinzel text-base font-bold text-white">Originales de Fábrica</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Empaques sellados al vacío, con hologramas y códigos de lote genuinos de Dubái y Emiratos Árabes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-obsidian-900/50 border border-white/5">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <Gem className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-cinzel text-base font-bold text-white">Lujo Accesible</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                El mismo perfil aromático y sofisticación que botellas de \$400 por una fracción de su valor.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
