import React, { useRef, useState, useMemo } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Scale, 
  Eye, 
  Sparkles, 
  Check, 
  Flame,
  Sun,
  Moon,
  CloudSnow,
  Flower2
} from 'lucide-react';

export default function PerfumeCard({ 
  perfume, 
  onSelect, 
  onAddToCart, 
  isFavorite, 
  onToggleFavorite, 
  isCompared, 
  onToggleCompare 
}) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Temperature label based on best_season (PDF Punto 4)
  const tempLabel = useMemo(() => {
    const season = (perfume.best_season || '').toLowerCase();
    const badge = (perfume.season_badge || '').toLowerCase();
    if (season === 'invierno' || badge.includes('invierno') || badge.includes('frío') || badge.includes('otoño')) {
      return { text: 'Frío', icon: CloudSnow, color: 'text-sky-300', bg: 'bg-sky-500/15 border-sky-500/30' };
    }
    if (season === 'verano' || badge.includes('verano') || badge.includes('calor')) {
      return { text: 'Calor', icon: Sun, color: 'text-amber-300', bg: 'bg-amber-500/15 border-amber-500/30' };
    }
    return { text: 'Templado', icon: Flower2, color: 'text-emerald-300', bg: 'bg-emerald-500/15 border-emerald-500/30' };
  }, [perfume.best_season, perfume.season_badge]);

  const handleMouseMove = (e) => {
    // Only calculate 3D tilt on desktop with mouse, skip completely on touch/mobile to ensure 60fps scroll
    if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -7;
    const rY = ((x - centerX) / centerX) * 7;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseEnter = () => {
    if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
      }}
      className="group relative bg-gradient-to-b from-obsidian-850/90 via-obsidian-900/90 to-obsidian-950/95 rounded-3xl border border-white/10 hover:border-gold-500/40 p-4 sm:p-5 flex flex-col justify-between shadow-luxury hover:shadow-luxury-hover transition-all duration-300"
    >
      
      {/* Top Floating Bar: Number, Brand & Badges */}
      <div className="flex items-center justify-between z-20 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full bg-obsidian-950/90 border border-white/10 font-mono text-[11px] font-bold text-slate-300">
            #{perfume.num}
          </span>
          <span className="text-[11px] uppercase tracking-widest text-gold-400 font-semibold">
            {perfume.brand}
          </span>
        </div>

        {/* Favorite & Compare Quick Icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(perfume);
            }}
            title={isCompared ? 'Quitar del comparador' : 'Agregar al comparador'}
            className={`p-1.5 rounded-full transition-all ${
              isCompared 
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
            title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            className={`p-1.5 rounded-full transition-all ${
              isFavorite 
                ? 'bg-rose-500/20 text-rose-500' 
                : 'bg-black/40 text-slate-400 hover:text-rose-400 hover:bg-black/70'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Image Container */}
      <div 
        onClick={() => onSelect(perfume)}
        className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-black/60 cursor-pointer flex items-center justify-center p-2 mb-4"
      >
        <img
          src={perfume.image}
          alt={perfume.name}
          loading="lazy"
          className="w-full h-full object-cover rounded-xl transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Dynamic Light Specular Reflection */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
        />

        {/* Badge & Price in image */}
        <div className="absolute top-2.5 right-2.5 z-10 px-2.5 py-0.5 rounded-full bg-obsidian-950/95 border border-gold-500/40 font-mono text-[11px] font-bold text-gold-400 shadow-md">
          ${perfume.price ? Number(perfume.price).toFixed(2) : '50.00'}
        </div>

        {perfume.badge && (
          <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-full bg-obsidian-950/95 border border-gold-500/30 text-[10px] text-gold-300 font-medium">
            {perfume.badge}
          </div>
        )}

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-500 text-black font-semibold text-xs tracking-wider uppercase shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            <span>Ficha Sensorial</span>
          </span>
        </div>
      </div>

      {/* Content & Details */}
      <div className="space-y-2.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category / Accord tag + Temperature label */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="truncate max-w-[130px] text-gold-300/80 font-medium">
              {perfume.category}
            </span>
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-medium ${tempLabel.bg} ${tempLabel.color}`}>
              <tempLabel.icon className="w-3 h-3" />
              {tempLabel.text}
            </span>
          </div>

          {/* Perfume Name */}
          <h3 
            onClick={() => onSelect(perfume)}
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

          {/* Quick Notes preview */}
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

        {/* Action Button: Price & Add to Cart */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
          <div>
            <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-semibold leading-none mb-1">Precio</span>
            <span className="font-mono text-base font-bold text-gold-400 leading-none">
              ${perfume.price ? Number(perfume.price).toFixed(2) : '50.00'}
            </span>
          </div>
          <button
            onClick={() => onAddToCart(perfume)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-white/5 hover:bg-gold-500 text-slate-200 hover:text-black font-semibold text-xs tracking-wider uppercase rounded-xl border border-white/10 hover:border-gold-500 transition-all duration-200 active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Pedir</span>
          </button>
        </div>

      </div>

    </div>
  );
}
