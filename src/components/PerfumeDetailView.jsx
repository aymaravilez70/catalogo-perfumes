import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShoppingBag, 
  MessageCircle, 
  Heart, 
  Scale, 
  Share2, 
  Check, 
  Sparkles, 
  Clock, 
  Flame, 
  Sun, 
  Moon, 
  CloudSnow, 
  Umbrella, 
  Leaf, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  ChevronRight,
  Eye,
  Star,
  Layers,
  RotateCcw
} from 'lucide-react';

export default function PerfumeDetailView({ 
  perfume, 
  allPerfumes = [], 
  onAddToCart, 
  isFavorite, 
  onToggleFavorite, 
  isCompared, 
  onToggleCompare, 
  onNavigate,
  onSelectPerfume 
}) {
  const [added, setAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [viewMode, setViewMode] = useState('bottle'); // 'bottle' | 'page'

  // Scroll to top when perfume changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [perfume?.id]);

  if (!perfume) return null;

  const handleAdd = () => {
    onAddToCart(perfume);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#/perfume/${perfume.id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2400);
    }
  };

  const handleWhatsAppOrder = () => {
    const priceFormatted = perfume.price ? `$${Number(perfume.price).toFixed(2)}` : '$50.00';
    const text = encodeURIComponent(
      `¡Hola Joufab! Deseo adquirir la fragancia *#${perfume.num} ${perfume.name}* (${perfume.brand}) - Precio: *${priceFormatted}*. ¿Tienen unidades disponibles para despacho inmediato?`
    );
    window.open(`https://wa.me/593984526114?text=${text}`, '_blank');
  };

  // Find 3-4 Similar Perfumes based on brand, category or tags
  const similarPerfumes = allPerfumes
    .filter((p) => p.id !== perfume.id)
    .map((p) => {
      let score = 0;
      if (p.brand === perfume.brand) score += 3;
      if (p.category === perfume.category) score += 4;
      if (p.gender === perfume.gender) score += 1;
      const commonTags = (p.tags || []).filter(t => (perfume.tags || []).includes(t)).length;
      score += commonTags * 2;
      return { ...p, similarityScore: score };
    })
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, 4);

  // Sensory Profile indicators (1 to 5)
  const profile = perfume.olfactory_profile || {};
  const cat = (perfume.category || '').toLowerCase();
  const notesAll = [
    ...(perfume.notes?.salida || []),
    ...(perfume.notes?.corazon || []),
    ...(perfume.notes?.base || [])
  ].join(' ').toLowerCase();

  const dulzor = profile.dulzor || (cat.includes('gourmand') || cat.includes('dulce') || notesAll.includes('vainilla') || notesAll.includes('praliné') ? 5 : cat.includes('frutal') ? 4 : cat.includes('ámbar') ? 3 : 2);
  const frescura = profile.frescura || (cat.includes('fresco') || cat.includes('acuático') || cat.includes('cítrico') || notesAll.includes('bergamota') ? 5 : cat.includes('floral') ? 4 : cat.includes('frutal') ? 3 : 1);
  const intensidad = profile.intensidad || (cat.includes('especiado') || cat.includes('gourmand') || cat.includes('amaderado') || cat.includes('oriental') ? 5 : 4);
  const proyeccion = profile.proyeccion || (perfume.sillage?.toLowerCase().includes('alta') || perfume.sillage?.toLowerCase().includes('pesada') ? 5 : 4);
  const duracion = profile.duracion || (perfume.longevity?.includes('12') || perfume.longevity?.includes('14') ? 5 : 4);
  const versatilidad = profile.versatilidad || (cat.includes('fresco') || cat.includes('cítrico') || perfume.season_badge?.toLowerCase().includes('versátil') ? 5 : cat.includes('gourmand') ? 3 : 4);

  const sensoryIndicators = [
    { label: 'Dulzor', value: Math.min(5, Math.max(1, dulzor)), desc: dulzor >= 4 ? 'Muy Marcado' : dulzor === 3 ? 'Equilibrado' : 'Sutil' },
    { label: 'Frescura', value: Math.min(5, Math.max(1, frescura)), desc: frescura >= 4 ? 'Vigorizante' : frescura === 3 ? 'Moderada' : 'Cálida' },
    { label: 'Intensidad', value: Math.min(5, Math.max(1, intensidad)), desc: intensidad >= 4 ? 'Potente' : 'Suave' },
    { label: 'Proyección', value: Math.min(5, Math.max(1, proyeccion)), desc: proyeccion >= 4 ? 'Amplia Estela' : 'Moderada' },
    { label: 'Duración', value: Math.min(5, Math.max(1, duracion)), desc: duracion >= 4 ? '8 - 14 Horas' : '6 - 8 Horas' },
    { label: 'Versatilidad', value: Math.min(5, Math.max(1, versatilidad)), desc: versatilidad >= 4 ? 'Todo Ocasión' : 'Ocasión Especial' },
  ];

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

  const currentDisplayImage = viewMode === 'page' && perfume.page_image 
    ? perfume.page_image 
    : perfume.image;

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 pt-24 pb-20 animate-fadeIn">
      
      {/* Top Breadcrumbs & Back Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-white/10">
          
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="hover:text-gold-400 transition-colors"
            >
              Inicio
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <button
              onClick={() => onNavigate && onNavigate('catalog')}
              className="hover:text-gold-400 transition-colors"
            >
              Catálogo
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-gold-300 font-semibold">{perfume.brand}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />
            <span className="text-white font-medium truncate max-w-[150px] hidden sm:inline">
              {perfume.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate && onNavigate('catalog')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la Boutique</span>
            </button>

            <button
              onClick={handleCopyShareLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-xs font-semibold text-gold-300 hover:text-gold-200 transition-all"
              title="Copiar URL directa para compartir en Instagram o WhatsApp"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">¡Enlace Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-gold-400" />
                  <span>Compartir Perfume</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Main Product Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Left Column: Visual Bottle Showcase (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* View Mode Toggle if page image exists */}
            {perfume.page_image && (
              <div className="flex items-center justify-between p-1 bg-obsidian-900 rounded-xl border border-white/10 text-xs">
                <button
                  onClick={() => setViewMode('bottle')}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                    viewMode === 'bottle' ? 'bg-gold-500 text-black font-semibold shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Fotografía de Frasco
                </button>
                <button
                  onClick={() => setViewMode('page')}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                    viewMode === 'page' ? 'bg-gold-500 text-black font-semibold shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Ficha Editorial Catálogo
                </button>
              </div>
            )}

            {/* Main Stage Image */}
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gradient-to-b from-obsidian-900 to-obsidian-950 border border-gold-500/30 shadow-2xl p-4 flex items-center justify-center group">
              <img
                src={currentDisplayImage}
                alt={perfume.name}
                className="w-full h-full object-contain rounded-2xl group-hover:scale-105 transition-transform duration-700 select-none"
              />

              {/* Number Badge */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-gold-500/40 font-mono text-xs font-bold text-gold-400 shadow-xl">
                #{perfume.num}
              </div>

              {/* Rating Star Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-xs font-bold text-amber-300 shadow-xl flex items-center gap-1 font-mono">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{perfume.rating || '4.9'}</span>
              </div>

              {/* Highlight Badge */}
              {perfume.badge && (
                <div className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-full bg-black/90 backdrop-blur-md border border-gold-500/30 text-xs font-semibold text-gold-300 shadow-xl">
                  {perfume.badge}
                </div>
              )}
            </div>

            {/* Quick Action Buttons Below Image */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onToggleCompare(perfume)}
                className={`py-3 px-4 rounded-xl border text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  isCompared 
                    ? 'bg-gold-500 text-black border-gold-400 font-bold shadow' 
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:text-white'
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>{isCompared ? 'En Comparador' : 'Comparar'}</span>
              </button>

              <button
                onClick={() => onToggleFavorite(perfume)}
                className={`py-3 px-4 rounded-xl border text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  isFavorite 
                    ? 'bg-rose-500/20 text-rose-500 border-rose-500/40' 
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:text-rose-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
                <span>{isFavorite ? 'En Favoritos' : 'Guardar'}</span>
              </button>
            </div>

            {/* Micro Confidence Checklist */}
            <div className="bg-obsidian-900/60 border border-white/5 rounded-2xl p-4 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
                <span>100% Original garantizado de fábrica</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Truck className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Entregas ágiles en Quito y envíos nacionales</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CreditCard className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Pago contraentrega o transferencia bancaria</span>
              </div>
            </div>

          </div>

          {/* Right Column: In-Depth Product Specs & Commercial Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header: Brand & Title */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-[0.3em] text-gold-400 font-bold">
                  {perfume.brand}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400 font-medium">
                  {perfume.gender || 'Unisex'}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400 font-medium">
                  {perfume.category}
                </span>
              </div>

              <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-white tracking-tight">
                {perfume.name}
              </h1>

              {/* Inspiration Banner */}
              {perfume.inspired_by && (
                <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/30 text-xs text-gold-300">
                  <Sparkles className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>
                    <span className="text-slate-400 uppercase text-[10px] font-bold mr-1">Inspiración de Alta Gama:</span>
                    <strong className="text-white font-semibold">{perfume.inspired_by}</strong>
                    {perfume.niche_house && <span className="text-gold-400/80 ml-1 font-normal">({perfume.niche_house})</span>}
                  </span>
                </div>
              )}
            </div>

            {/* Price Box & Immediate Order Actions */}
            <div className="bg-gradient-to-r from-obsidian-900 to-obsidian-950 border border-gold-500/30 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 block font-semibold">
                    Precio Oficial Joufab
                  </span>
                  <span className="font-mono text-3xl sm:text-4xl font-bold text-gold-400">
                    ${perfume.price ? Number(perfume.price).toFixed(2) : '50.00'}
                  </span>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  ✓ En Stock para Despacho Inmediato
                </span>
              </div>

              {/* Main Call to Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAdd}
                  className={`py-4 px-6 rounded-2xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all shadow-lg active:scale-95 ${
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
                      <span>Agregar a mi Pedido</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleWhatsAppOrder}
                  className="py-4 px-6 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Pedir por WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Sensorial Description */}
            <div className="space-y-2">
              <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span>Descripción Sensorial</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                {perfume.description}
              </p>
              {perfume.occasions && (
                <div className="pt-1 text-xs text-slate-400 italic">
                  <strong>Ocasiones ideales:</strong> {perfume.occasions}
                </div>
              )}
            </div>

            {/* Visual Olfactory Profile (6 Bars - Page 2 PDF) */}
            <div className="bg-obsidian-900/80 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gold-400 uppercase tracking-widest flex items-center gap-2">
                  <Flame className="w-4 h-4 text-gold-400" />
                  <span>Perfil Olfativo Sensorial</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Escala de 1 a 5</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {sensoryIndicators.map((item, idx) => (
                  <div key={idx} className="bg-obsidian-950/80 border border-white/5 p-3 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-200 font-semibold">{item.label}</span>
                      <span className="text-[11px] text-gold-300 font-mono font-bold">{item.desc}</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <div
                          key={dot}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            dot <= item.value
                              ? 'bg-gradient-to-r from-gold-500 to-amber-400 shadow-[0_0_8px_rgba(212,175,55,0.4)]'
                              : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Olfactory Pyramid (Salida, Corazón, Fondo) */}
            <div className="bg-obsidian-900/80 border border-white/10 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-gold-400 uppercase tracking-widest flex items-center gap-2">
                <Layers className="w-4 h-4 text-gold-400" />
                <span>Pirámide Olfativa Detallada</span>
              </h3>

              <div className="space-y-3">
                {/* Salida */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Notas de Salida (Primeros 15-30 min)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {perfume.notes?.salida?.map((n, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg bg-obsidian-950 text-xs text-slate-200 border border-white/10 font-medium">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Corazón */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gold-400/90 tracking-wider block">
                    Notas de Corazón (2 a 4 horas)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {perfume.notes?.corazon?.map((n, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg bg-gold-500/10 text-xs text-gold-200 border border-gold-500/20 font-medium">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Base / Fondo */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Notas de Fondo / Fijación (Fondo y Secado en Piel)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {perfume.notes?.base?.map((n, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg bg-obsidian-950 text-xs text-slate-200 border border-white/10 font-medium">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance & Moments Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-obsidian-900/60 border border-white/10 p-3 rounded-xl text-center">
                <Clock className="w-4 h-4 text-gold-400 mx-auto mb-1" />
                <span className="text-[10px] uppercase text-slate-400 block">Longevidad</span>
                <span className="text-xs font-bold text-white mt-0.5 block">{perfume.longevity || '8 - 12h'}</span>
              </div>

              <div className="bg-obsidian-900/60 border border-white/10 p-3 rounded-xl text-center">
                <Flame className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <span className="text-[10px] uppercase text-slate-400 block">Estela</span>
                <span className="text-xs font-bold text-white mt-0.5 block">{perfume.sillage || 'Alta'}</span>
              </div>

              <div className="bg-obsidian-900/60 border border-white/10 p-3 rounded-xl text-center">
                <Sun className="w-4 h-4 text-amber-300 mx-auto mb-1" />
                <span className="text-[10px] uppercase text-slate-400 block">Día</span>
                <span className="text-xs font-bold text-white mt-0.5 block">{votes.dia.toLocaleString()} votos</span>
              </div>

              <div className="bg-obsidian-900/60 border border-white/10 p-3 rounded-xl text-center">
                <Moon className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                <span className="text-[10px] uppercase text-slate-400 block">Noche</span>
                <span className="text-xs font-bold text-white mt-0.5 block">{votes.noche.toLocaleString()} votos</span>
              </div>
            </div>

          </div>

        </div>

        {/* Similar Perfumes Section (Page 6 of PDF) */}
        {similarPerfumes.length > 0 && (
          <div className="mt-20 pt-12 border-t border-white/10">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-gold-400 font-bold block">
                  Recomendaciones del Asesor
                </span>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
                  Si te gusta {perfume.name}, también te encantará:
                </h2>
              </div>
              <button
                onClick={() => onNavigate && onNavigate('catalog')}
                className="text-xs text-gold-400 hover:underline hidden sm:inline"
              >
                Ver todo el catálogo →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarPerfumes.map((sim) => (
                <div
                  key={sim.id}
                  onClick={() => onSelectPerfume(sim)}
                  className="group cursor-pointer bg-gradient-to-b from-obsidian-900/90 to-obsidian-950/90 rounded-2xl border border-white/10 hover:border-gold-500/40 p-4 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-black/60 mb-3 flex items-center justify-center p-2">
                    <img
                      src={sim.image}
                      alt={sim.name}
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 font-mono text-[10px] text-slate-300 font-bold">
                      #{sim.num}
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/80 font-mono text-[10px] text-gold-400 font-bold border border-gold-500/30">
                      ${sim.price ? Number(sim.price).toFixed(2) : '50.00'}
                    </div>
                  </div>

                  <span className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold block">
                    {sim.brand}
                  </span>
                  <h4 className="font-cinzel text-base font-bold text-white group-hover:text-gold-300 transition-colors truncate">
                    {sim.name}
                  </h4>
                  <span className="text-xs text-slate-400 block truncate mt-0.5">
                    {sim.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
