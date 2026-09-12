import React from 'react';
import { Sparkles, ArrowRight, Heart, Scale, ShoppingBag, Eye } from 'lucide-react';

export default function FeaturedIcons({ 
  perfumes, 
  onSelectPerfume, 
  onAddToCart, 
  onNavigateToCatalog,
  favorites = [],
  onToggleFavorite,
  comparedList = [],
  onToggleCompare
}) {
  // Select 4 icons: Khamrah (01), 9 PM (03), Hawas Kobra (06), Eclaire (14)
  const flagshipIds = ['khamrah', '9-pm', 'hawas-kobra', 'eclaire'];
  const flagships = flagshipIds
    .map(id => perfumes.find(p => p.id === id))
    .filter(Boolean);

  return (
    <section className="py-20 bg-gradient-to-b from-obsidian-950 via-obsidian-900/60 to-obsidian-950 border-t border-white/5 relative overflow-hidden">
      
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gold-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-semibold uppercase tracking-[0.25em]">
              <Sparkles className="w-3.5 h-3.5" />
              Selección Exclusiva
            </div>
            <h2 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              ÍCONOS DE LA CASA
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl font-light leading-relaxed">
              Las 4 creaciones más codiciadas y virales de nuestra casa. Fórmulas de alta concentración con fijación extrema y estela magnética.
            </p>
          </div>

          <button
            onClick={onNavigateToCatalog}
            className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white/5 hover:bg-gold-500 text-slate-200 hover:text-black border border-gold-500/30 font-semibold text-xs tracking-widest uppercase transition-all duration-300 active:scale-95 shrink-0 shadow-gold-sm"
          >
            <span>Ver Catálogo Completo (15 Fragancias)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

        {/* 4 Flagships Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flagships.map((perfume) => {
            const isFav = favorites.includes(perfume.id);
            const isComp = comparedList.some(p => p.id === perfume.id);

            return (
              <div 
                key={perfume.id}
                className="group relative bg-gradient-to-b from-obsidian-850/90 via-obsidian-900/90 to-obsidian-950/95 rounded-3xl border border-white/10 hover:border-gold-500/40 p-4 sm:p-5 flex flex-col justify-between shadow-luxury hover:shadow-luxury-hover transition-all duration-300"
              >
                {/* Top Number & Brand */}
                <div className="flex items-center justify-between mb-3 z-20">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-obsidian-950 border border-white/10 font-mono text-[11px] font-bold text-slate-300">
                      #{perfume.num}
                    </span>
                    <span className="text-[11px] uppercase tracking-widest text-gold-400 font-semibold">
                      {perfume.brand}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCompare(perfume);
                      }}
                      title={isComp ? 'Quitar del comparador' : 'Agregar al comparador'}
                      className={`p-1.5 rounded-full transition-all ${
                        isComp 
                          ? 'bg-gold-500 text-black shadow-sm font-bold' 
                          : 'bg-black/40 text-slate-400 hover:text-white hover:bg-black/70'
                      }`}
                    >
                      <Scale className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(perfume);
                      }}
                      title={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                      className={`p-1.5 rounded-full transition-all ${
                        isFav 
                          ? 'bg-rose-500/20 text-rose-500' 
                          : 'bg-black/40 text-slate-400 hover:text-rose-400 hover:bg-black/70'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Bottle Frame */}
                <div 
                  onClick={() => onSelectPerfume(perfume)}
                  className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-black/60 cursor-pointer flex items-center justify-center p-2 mb-4"
                >
                  <img
                    src={perfume.image}
                    alt={perfume.name}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-xl transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Badge */}
                  {perfume.badge && (
                    <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-gold-500/30 text-[10px] text-gold-300 font-medium">
                      {perfume.badge}
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-500 text-black font-semibold text-xs tracking-wider uppercase shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ficha Sensorial</span>
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="truncate max-w-[170px] text-gold-300/80 font-medium">
                        {perfume.category}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-slate-400">
                        {perfume.season_badge || 'Versátil'}
                      </span>
                    </div>

                    <h3 
                      onClick={() => onSelectPerfume(perfume)}
                      className="font-cinzel text-lg font-bold text-white group-hover:text-gold-300 transition-colors cursor-pointer leading-snug line-clamp-1"
                    >
                      {perfume.name}
                    </h3>

                    {/* Luxury Inspiration Tag */}
                    {perfume.inspired_by && (
                      <div className="mt-1.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gold-500/10 border border-gold-500/20 text-[11px] text-gold-300">
                        <Sparkles className="w-3 h-3 text-gold-400 shrink-0" />
                        <span className="truncate font-sans">
                          <span className="text-slate-400 text-[9px] uppercase tracking-wider font-bold mr-1">Inspiración:</span>
                          <span className="font-semibold text-gold-200">{perfume.inspired_by}</span>
                        </span>
                      </div>
                    )}

                    {/* Notes Preview */}
                    <div className="pt-2 flex flex-wrap gap-1">
                      {perfume.notes.salida.slice(0, 3).map((note, idx) => (
                        <span 
                          key={idx} 
                          className="px-2 py-0.5 rounded-md bg-obsidian-800/80 text-[10px] text-slate-300 border border-white/5"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Add to Cart */}
                  <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                    <button
                      onClick={() => onAddToCart(perfume)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 hover:bg-gold-500 text-slate-200 hover:text-black font-semibold text-xs tracking-wider uppercase rounded-xl border border-white/10 hover:border-gold-500 transition-all duration-200 active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Agregar a Pedido</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Banner Callout */}
        <div className="mt-12 text-center">
          <button
            onClick={onNavigateToCatalog}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-black font-bold text-xs tracking-widest uppercase shadow-luxury hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <span>Ver la Colección Completa en la Boutique (15 Perfumes)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
