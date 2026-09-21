import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Heart, 
  Scale, 
  MessageCircle, 
  CloudSnow, 
  Flower2, 
  Umbrella, 
  Leaf, 
  Sun, 
  Moon, 
  Sparkles, 
  BookOpen, 
  Layers,
  Check,
  Clock,
  Flame
} from 'lucide-react';

export default function PerfumeModal({ 
  perfume, 
  onClose, 
  onAddToCart, 
  isFavorite, 
  onToggleFavorite, 
  isCompared, 
  onToggleCompare 
}) {
  if (!perfume) return null;

  const [viewMode, setViewMode] = useState('bottle'); // 'bottle' | 'slide'
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(perfume);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleWhatsAppInquiry = () => {
    const priceFormatted = perfume.price ? `$${Number(perfume.price).toFixed(2)}` : '$50.00';
    const text = encodeURIComponent(
      `¡Hola Joufab! Me interesa información y disponibilidad de la fragancia *#${perfume.num} ${perfume.name}* (${perfume.brand}) - Precio: *${priceFormatted}*. ¿Tienen unidades disponibles?`
    );
    window.open(`https://wa.me/593984526114?text=${text}`, '_blank');
  };

  // Find maximum votes to calculate percentage bar
  const pVotes = perfume.votes || {};
  const votes = {
    invierno: Number(pVotes.invierno) || 5000,
    primavera: Number(pVotes.primavera) || 2000,
    verano: Number(pVotes.verano) || 1000,
    otoño: Number(pVotes.otoño) || 4000,
    dia: Number(pVotes.dia) || 3000,
    noche: Number(pVotes.noche) || 7000
  };
  const maxSeasonVotes = Math.max(votes.invierno, votes.primavera, votes.verano, votes.otoño) || 1;
  const maxMomentVotes = Math.max(votes.dia, votes.noche) || 1;

  const inspiredBy = perfume.inspired_by || pVotes.inspired_by;
  const nicheHouse = perfume.niche_house || pVotes.niche_house;
  const longevity = perfume.longevity || pVotes.longevity || '8 - 10 horas';
  const sillage = perfume.sillage || pVotes.sillage || 'Alta / Pesada';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-fadeIn">
      
      {/* Background click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-5xl bg-obsidian-900 border border-gold-500/30 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col my-auto max-h-[92vh]">
        
        {/* Header bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-obsidian-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-gold-500 text-black font-mono font-bold text-xs">
              #{perfume.num}
            </span>
            <div>
              <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block">
                {perfume.brand}
              </span>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white leading-none">
                {perfume.name}
              </h2>
            </div>
            <div className="ml-2 sm:ml-4 px-3 py-1 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-baseline gap-1.5">
              <span className="text-[10px] uppercase text-slate-400 font-semibold">Precio</span>
              <span className="font-mono text-base sm:text-lg font-bold text-gold-400">
                ${perfume.price ? Number(perfume.price).toFixed(2) : '50.00'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleCompare(perfume)}
              className={`p-2 rounded-full border transition-all ${
                isCompared 
                  ? 'bg-gold-500 text-black border-gold-400 font-bold' 
                  : 'bg-white/5 text-slate-300 border-white/10 hover:text-white'
              }`}
              title="Comparar"
            >
              <Scale className="w-4 h-4" />
            </button>

            <button
              onClick={() => onToggleFavorite(perfume)}
              className={`p-2 rounded-full border transition-all ${
                isFavorite 
                  ? 'bg-rose-500/20 text-rose-500 border-rose-500/40' 
                  : 'bg-white/5 text-slate-300 border-white/10 hover:text-rose-400'
              }`}
              title="Favorito"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Visual Column */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between p-1 bg-obsidian-950 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setViewMode('bottle')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                  viewMode === 'bottle' ? 'bg-gold-500 text-black font-semibold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Retrato de Botella
              </button>
              <button
                onClick={() => setViewMode('slide')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                  viewMode === 'slide' ? 'bg-gold-500 text-black font-semibold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Página Catálogo PDF
              </button>
            </div>

            {/* Visual Frame */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center p-2 shadow-inner">
              <img
                src={viewMode === 'bottle' ? perfume.image : perfume.page_image}
                alt={perfume.name}
                className={`w-full h-full ${viewMode === 'bottle' ? 'object-cover' : 'object-contain'} rounded-xl transition-all duration-300`}
              />

              {perfume.badge && viewMode === 'bottle' && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-md border border-gold-500/40 rounded-full text-xs text-gold-300 font-medium">
                  {perfume.badge}
                </div>
              )}
            </div>

            {/* Banner preview if available */}
            {perfume.banner_image && (
              <div className="rounded-xl overflow-hidden border border-white/10 shadow">
                <img 
                  src={perfume.banner_image} 
                  alt={`${perfume.name} banner`} 
                  className="w-full h-24 object-cover"
                />
              </div>
            )}

          </div>

          {/* Right Sensory & Pyramid Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Luxury Inspiration & Performance Card */}
            {(inspiredBy || perfume.longevity || perfume.sillage) && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-gold-950/40 via-obsidian-900 to-obsidian-950 border border-gold-500/30 space-y-2.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold-400" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gold-400">
                      Inspiración de Alta Perfumería
                    </span>
                  </div>
                  {perfume.gender && (
                    <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-300 font-medium">
                      {perfume.gender}
                    </span>
                  )}
                </div>

                {inspiredBy ? (
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-base sm:text-lg font-cinzel font-bold text-white">
                      {inspiredBy}
                    </span>
                    {nicheHouse && (
                      <span className="text-xs text-gold-300/80 font-medium">
                        • {nicheHouse}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-light">
                    Composición exclusiva seleccionada por Joufab Perfumes
                  </p>
                )}

                {/* Performance Specs */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Fijación en Piel</span>
                      <span className="font-semibold text-white">{longevity}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Proyección / Estela</span>
                      <span className="font-semibold text-white">{sillage}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-gold-400 font-semibold mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Perfil Olfativo
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed font-light">
                {perfume.description}
              </p>
            </div>

            {/* Pirámide Olfativa */}
            <div className="space-y-3 bg-obsidian-950/60 p-5 rounded-2xl border border-white/10">
              <h3 className="text-xs uppercase tracking-widest text-gold-400 font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4 text-gold-400" />
                Pirámide Olfativa (Acordes)
              </h3>

              {/* Salida */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Notas de Salida (Apertura)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {perfume.notes.salida.map((n, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-obsidian-800 text-xs text-white border border-white/10 font-medium">
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              {/* Corazón */}
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-300/80">
                  Notas de Corazón (Cuerpo)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {perfume.notes.corazon.map((n, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-gold-900/30 text-xs text-gold-200 border border-gold-500/20 font-medium">
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              {/* Base */}
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Notas de Fondo / Base (Fijación)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {perfume.notes.base.map((n, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-obsidian-800 text-xs text-slate-300 border border-white/10">
                      {n}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Cuándo usarlo: Votos y Temporadas */}
            <div className="space-y-4 bg-obsidian-950/60 p-5 sm:p-6 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-widest text-gold-400 font-semibold flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Cuándo Usarlo (Votos y Rendimiento)</span>
                </h3>
                {perfume.season_badge && (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-300 font-medium">
                    {perfume.season_badge}
                  </span>
                )}
              </div>

              {perfume.occasions && (
                <p className="text-xs text-slate-300 italic">
                  "{perfume.occasions}"
                </p>
              )}

              {/* Performance Quick Badges */}
              <div className="grid grid-cols-2 gap-3 py-2 border-y border-white/5 text-xs">
                <div className="flex items-center gap-2 text-slate-300 bg-obsidian-900/60 p-2.5 rounded-xl border border-white/5">
                  <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-medium">Fijación en Piel</span>
                    <span className="font-semibold text-white text-xs">{longevity}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-300 bg-obsidian-900/60 p-2.5 rounded-xl border border-white/5">
                  <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-medium">Proyección / Estela</span>
                    <span className="font-semibold text-white text-xs">{sillage}</span>
                  </div>
                </div>
              </div>

              {/* Season Bars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                
                {/* Invierno */}
                <div className="bg-obsidian-900/80 p-2.5 rounded-xl border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-cyan-300">
                      <CloudSnow className="w-3.5 h-3.5" /> Invierno
                    </span>
                    <span className="font-mono text-slate-300 text-[10px] font-bold">
                      {votes.invierno.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-cyan-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, Math.max(6, (votes.invierno / maxSeasonVotes) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Primavera */}
                <div className="bg-obsidian-900/80 p-2.5 rounded-xl border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-emerald-300">
                      <Flower2 className="w-3.5 h-3.5" /> Primavera
                    </span>
                    <span className="font-mono text-slate-300 text-[10px] font-bold">
                      {votes.primavera.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, Math.max(6, (votes.primavera / maxSeasonVotes) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Verano */}
                <div className="bg-obsidian-900/80 p-2.5 rounded-xl border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-rose-300">
                      <Umbrella className="w-3.5 h-3.5" /> Verano
                    </span>
                    <span className="font-mono text-slate-300 text-[10px] font-bold">
                      {votes.verano.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-rose-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, Math.max(6, (votes.verano / maxSeasonVotes) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Otoño */}
                <div className="bg-obsidian-900/80 p-2.5 rounded-xl border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-amber-300">
                      <Leaf className="w-3.5 h-3.5" /> Otoño
                    </span>
                    <span className="font-mono text-slate-300 text-[10px] font-bold">
                      {votes.otoño.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-amber-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, Math.max(6, (votes.otoño / maxSeasonVotes) * 100))}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Day vs Night Bars */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-obsidian-900/80 p-2.5 rounded-xl border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-amber-300">
                      <Sun className="w-3.5 h-3.5" /> Día
                    </span>
                    <span className="font-mono text-slate-300 text-[10px] font-bold">
                      {votes.dia.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-amber-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, Math.max(6, (votes.dia / maxMomentVotes) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="bg-obsidian-900/80 p-2.5 rounded-xl border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-indigo-300">
                      <Moon className="w-3.5 h-3.5" /> Noche
                    </span>
                    <span className="font-mono text-slate-300 text-[10px] font-bold">
                      {votes.noche.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-indigo-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, Math.max(6, (votes.noche / maxMomentVotes) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleAdd}
                className={`w-full sm:flex-1 py-3.5 px-6 rounded-2xl font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                  added 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gold-500 hover:bg-gold-400 text-black shadow-gold-sm'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡Agregado al Pedido!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Agregar a mi Pedido • ${perfume.price ? Number(perfume.price).toFixed(2) : '50.00'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleWhatsAppInquiry}
                className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Consultar por WhatsApp</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
