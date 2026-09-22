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
  RotateCcw,
  ThumbsUp,
  MapPin,
  X
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

  // Customer Reviews State (PDF p. 11 Punto 19)
  const [reviews, setReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewToast, setReviewToast] = useState(null);

  // Load reviews for this perfume from localStorage
  useEffect(() => {
    if (!perfume?.id) return;
    try {
      const saved = localStorage.getItem(`joufab_reviews_${perfume.id}`);
      if (saved) {
        setReviews(JSON.parse(saved));
      } else {
        setReviews([]);
      }
    } catch {
      setReviews([]);
    }
  }, [perfume?.id]);

  // Dynamic OpenGraph & Document Title Meta Tags (PDF p. 11, Punto 21)
  useEffect(() => {
    if (!perfume) return;

    const originalTitle = document.title;
    const priceFormatted = perfume.price ? `$${Number(perfume.price).toFixed(2)}` : '$50.00';
    document.title = `#${perfume.num} ${perfume.name} (${perfume.brand}) - ${priceFormatted} | JOUFAB`;

    const setMetaTag = (attr, val, content) => {
      let el = document.querySelector(`meta[${attr}="${val}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, val);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const ogTitle = `#${perfume.num} ${perfume.name} - ${perfume.brand} (${priceFormatted})`;
    const ogDesc = `${perfume.name} de ${perfume.brand}. ${perfume.category}. ${perfume.description ? perfume.description.slice(0, 130) + '...' : ''} Precio oficial: ${priceFormatted}. Entrega inmediata en Ecuador.`;
    const fullImageUrl = perfume.image?.startsWith('http') 
      ? perfume.image 
      : `${window.location.origin}${perfume.image}`;

    setMetaTag('property', 'og:title', ogTitle);
    setMetaTag('property', 'og:description', ogDesc);
    setMetaTag('property', 'og:image', fullImageUrl);
    setMetaTag('property', 'og:url', window.location.href);
    setMetaTag('name', 'twitter:title', ogTitle);
    setMetaTag('name', 'twitter:description', ogDesc);
    setMetaTag('name', 'twitter:image', fullImageUrl);

    return () => {
      document.title = originalTitle;
    };
  }, [perfume]);

  const [reviewForm, setReviewForm] = useState({
    name: '',
    city: '',
    rating: 5,
    longevity: '10 - 14 horas',
    occasion: 'Citas & Noches',
    recommend: true,
    comment: ''
  });
  const [reviewHoverRating, setReviewHoverRating] = useState(0);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) return;

    const newReview = {
      id: `rev_${Date.now()}`,
      name: reviewForm.name.trim(),
      city: reviewForm.city.trim() || 'Ecuador',
      rating: reviewForm.rating,
      longevity: reviewForm.longevity,
      occasion: reviewForm.occasion,
      recommend: reviewForm.recommend,
      comment: reviewForm.comment.trim(),
      date: new Date().toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric' }),
      verified: true
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem(`joufab_reviews_${perfume.id}`, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setReviewForm({
      name: '',
      city: '',
      rating: 5,
      longevity: '10 - 14 horas',
      occasion: 'Citas & Noches',
      recommend: true,
      comment: ''
    });
    setIsReviewModalOpen(false);
    setReviewToast('¡Gracias por tu opinión! Reseña publicada con éxito.');
    setTimeout(() => setReviewToast(null), 3500);
  };

  // Scroll to top when perfume changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [perfume?.id]);

  if (!perfume) return null;

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + Number(r.rating || 5), 0) / reviews.length).toFixed(1)
    : null;
  const recommendPercent = reviews.length > 0
    ? Math.round((reviews.filter(r => r.recommend !== false).length / reviews.length) * 100)
    : null;

  const handleAdd = () => {
    onAddToCart(perfume);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Native Social Share & Clipboard Fallback (PDF p. 11, Punto 21)
  const handleShare = async () => {
    const priceFormatted = perfume.price ? `$${Number(perfume.price).toFixed(2)}` : '$50.00';
    const shareUrl = `${window.location.origin}${window.location.pathname}#/perfume/${perfume.id}`;
    const shareTitle = `#${perfume.num} ${perfume.name} (${perfume.brand}) - ${priceFormatted} | JOUFAB`;
    const shareText = `¡Descubre #${perfume.num} ${perfume.name} de ${perfume.brand} en JOUFAB! Precio oficial: ${priceFormatted}.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(shareUrl);
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

  // Comparative Relationship Helper (PDF p. 6, Punto 9)
  const getComparativeRelation = (sim) => {
    const curPrice = Number(perfume.price) || 50;
    const simPrice = Number(sim.price) || 50;

    // 1. Price comparison
    if (simPrice < curPrice - 2) {
      return {
        label: 'Alternativa más económica',
        color: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
      };
    }

    const simProf = sim.olfactory_profile || {};
    const simCat = (sim.category || '').toLowerCase();
    const simNotes = [
      ...(sim.notes?.salida || []),
      ...(sim.notes?.corazon || []),
      ...(sim.notes?.base || [])
    ].join(' ').toLowerCase();

    const sFrescura = simProf.frescura || (simCat.includes('fresco') || simCat.includes('acuático') || simCat.includes('cítrico') || simNotes.includes('bergamota') ? 5 : simCat.includes('floral') ? 4 : 2);
    const sDulzor = simProf.dulzor || (simCat.includes('gourmand') || simCat.includes('dulce') || simNotes.includes('vainilla') || simNotes.includes('praliné') ? 5 : 2);
    const sIntensidad = simProf.intensidad || (simCat.includes('especiado') || simCat.includes('oriental') || simCat.includes('amaderado') ? 5 : 3);

    if (sFrescura - frescura >= 1.5) {
      return {
        label: 'Similar pero más fresco',
        color: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
      };
    }
    if (sDulzor - dulzor >= 1.5) {
      return {
        label: 'Similar pero más dulce',
        color: 'bg-amber-500/15 border-amber-500/30 text-amber-300'
      };
    }
    if (sIntensidad - intensidad >= 1.5) {
      return {
        label: 'Similar pero más intenso',
        color: 'bg-rose-500/15 border-rose-500/30 text-rose-300'
      };
    }
    if (simCat.includes('amaderado') || simCat.includes('oriental') || simNotes.includes('oud')) {
      return {
        label: 'Similar pero más elegante',
        color: 'bg-gold-500/15 border-gold-500/30 text-gold-300'
      };
    }

    return {
      label: 'Misma vibra olfativa',
      color: 'bg-white/5 border-white/10 text-slate-300'
    };
  };

  // Find 3-4 Similar Perfumes based on brand, category or tags with Comparative Relation (PDF p. 6, Punto 9)
  const similarPerfumes = allPerfumes
    .filter((p) => p.id !== perfume.id)
    .map((p) => {
      let score = 0;
      if (p.brand === perfume.brand) score += 3;
      if (p.category === perfume.category) score += 4;
      if (p.gender === perfume.gender) score += 1;
      const commonTags = (p.tags || []).filter(t => (perfume.tags || []).includes(t)).length;
      score += commonTags * 2;
      return { 
        ...p, 
        similarityScore: score,
        relationBadge: getComparativeRelation(p)
      };
    })
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, 4);

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
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-xs font-semibold text-gold-300 hover:text-gold-200 transition-all cursor-pointer"
              title="Compartir perfume por WhatsApp, redes o copiar enlace"
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

        {/* Customer Reviews & Feedback Section (PDF p. 11 Punto 19) */}
        <div className="mt-20 pt-12 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-cinzel text-2xl sm:text-3xl text-white font-normal tracking-[0.15em] uppercase flex items-center gap-3">
                <span>Reseñas de Clientes</span>
                {reviews.length > 0 && (
                  <span className="text-xs font-sans font-normal px-2.5 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20">
                    {reviews.length}
                  </span>
                )}
              </h2>
            </div>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-bold tracking-wider uppercase transition-all shadow-gold-sm hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 self-start sm:self-auto"
            >
              <Star className="w-4 h-4 fill-black" />
              <span>Escribir Reseña</span>
            </button>
          </div>

          {/* Toast Notification for Review Submission */}
          {reviewToast && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{reviewToast}</span>
            </div>
          )}

          {reviews.length === 0 ? (
            /* Clean Luxury Empty State - Strictly NO fake reviews (PDF p. 9 y 11) */
            <div className="rounded-3xl bg-gradient-to-b from-obsidian-900/60 to-obsidian-950/60 border border-white/10 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
              <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center mx-auto">
                <Star className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white">
                  Sé el primero en calificar #{perfume.num} {perfume.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
                  Esta fragancia aún no tiene opiniones registradas. Tu experiencia sobre su fijación en piel, proyección y notas ayudará a otros apasionados del perfume a elegir su próximo aroma.
                </p>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black text-xs font-bold tracking-wider uppercase transition-all shadow-gold-sm hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center gap-2"
              >
                <span>✦ Compartir mi Experiencia</span>
              </button>
            </div>
          ) : (
            /* Real Reviews Grid & Summary */
            <div className="space-y-6">
              {/* Summary Stats Card */}
              <div className="p-6 rounded-2xl bg-obsidian-900/80 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                <div className="text-center sm:text-left sm:border-r border-white/10 sm:pr-6 space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-4xl font-bold font-cinzel text-white">{averageRating}</span>
                    <div className="flex items-center text-gold-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          className={`w-4 h-4 ${s <= Math.round(Number(averageRating)) ? 'fill-gold-400 text-gold-400' : 'text-slate-600'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">Basado en {reviews.length} valoraciones verificadas</span>
                </div>

                <div className="text-center sm:border-r border-white/10 sm:px-6 space-y-1">
                  <span className="text-2xl font-bold text-emerald-400 font-cinzel">{recommendPercent}%</span>
                  <span className="text-xs text-slate-400 block">De compradores recomiendan esta fragancia</span>
                </div>

                <div className="text-center sm:text-right sm:pl-6 space-y-1">
                  <span className="text-xs text-gold-400 font-semibold block">100% Opiniones Reales</span>
                  <span className="text-xs text-slate-400 block">Comentarios auténticos de compradores</span>
                </div>
              </div>

              {/* Reviews List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-obsidian-900/60 border border-white/10 space-y-3 hover:border-gold-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 font-bold text-xs flex items-center justify-center font-cinzel">
                          {rev.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{rev.name}</span>
                            {rev.verified && (
                              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                <Check className="w-3 h-3" /> Verificado
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-500" /> {rev.city} • {rev.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center text-gold-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-gold-400 text-gold-400' : 'text-slate-700'}`} 
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[10px]">
                      {rev.longevity && (
                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gold-400" /> {rev.longevity}
                        </span>
                      )}
                      {rev.occasion && (
                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10">
                          {rev.occasion}
                        </span>
                      )}
                      {rev.recommend && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" /> Recomienda este perfume
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Similar Perfumes Section (Page 6 of PDF) */}
        {similarPerfumes.length > 0 && (
          <div className="mt-20 pt-12 border-t border-white/10">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-cinzel text-2xl sm:text-3xl text-white font-normal tracking-[0.15em] uppercase">
                  Fragancias Similares
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
                  className="group cursor-pointer bg-gradient-to-b from-obsidian-900/90 to-obsidian-950/90 rounded-2xl border border-white/10 hover:border-gold-500/40 p-4 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
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

                  {/* Comparative Relationship Tag (PDF p. 6, Punto 9) */}
                  {sim.relationBadge && (
                    <div className={`mt-3 px-2.5 py-1 rounded-lg text-[10px] font-medium border text-center truncate ${sim.relationBadge.color}`}>
                      {sim.relationBadge.label}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Review Submission Modal (PDF p. 11 Punto 19) */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-obsidian-950 border border-gold-500/30 p-6 sm:p-8 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 text-left">
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-bold block">
                Tu Experiencia Olfativa
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                Calificar #{perfume.num} {perfume.name}
              </h3>
              <p className="text-xs text-slate-400 font-light">
                Comparte cómo se comporta en tu piel, duración y tus impresiones reales.
              </p>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-left">
              {/* Interactive Star Rating */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Calificación General *
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onMouseEnter={() => setReviewHoverRating(star)}
                        onMouseLeave={() => setReviewHoverRating(0)}
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="p-1 text-gold-400 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= (reviewHoverRating || reviewForm.rating)
                              ? 'fill-gold-400 text-gold-400'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-gold-400 ml-2">
                    {(reviewHoverRating || reviewForm.rating) === 5 && 'Extraordinario (5/5)'}
                    {(reviewHoverRating || reviewForm.rating) === 4 && 'Muy Bueno (4/5)'}
                    {(reviewHoverRating || reviewForm.rating) === 3 && 'Aceptable (3/5)'}
                    {(reviewHoverRating || reviewForm.rating) === 2 && 'Regular (2/5)'}
                    {(reviewHoverRating || reviewForm.rating) === 1 && 'Pobre (1/5)'}
                  </span>
                </div>
              </div>

              {/* Name and City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Tu Nombre o Iniciales *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Mateo V."
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Ciudad / Provincia
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Guayaquil"
                    value={reviewForm.city}
                    onChange={(e) => setReviewForm({ ...reviewForm, city: e.target.value })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Longevity & Occasion */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Duración en tu piel
                  </label>
                  <select
                    value={reviewForm.longevity}
                    onChange={(e) => setReviewForm({ ...reviewForm, longevity: e.target.value })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                  >
                    <option value="Más de 12 horas">Más de 12 horas (Bomba)</option>
                    <option value="8 - 12 horas">8 - 12 horas (Excelente)</option>
                    <option value="6 - 8 horas">6 - 8 horas (Moderada)</option>
                    <option value="4 - 6 horas">4 - 6 horas (Ligera)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Ocasión preferida
                  </label>
                  <select
                    value={reviewForm.occasion}
                    onChange={(e) => setReviewForm({ ...reviewForm, occasion: e.target.value })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                  >
                    <option value="Citas & Noches">Citas & Noches</option>
                    <option value="Oficina & Trabajo">Oficina & Trabajo</option>
                    <option value="Eventos & Fiestas">Eventos & Fiestas</option>
                    <option value="Uso Diario Casual">Uso Diario Casual</option>
                    <option value="Todo momento">Todo momento</option>
                  </select>
                </div>
              </div>

              {/* Recommend Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="recommendCheck"
                  checked={reviewForm.recommend}
                  onChange={(e) => setReviewForm({ ...reviewForm, recommend: e.target.checked })}
                  className="rounded border-white/20 bg-obsidian-900 text-gold-500 focus:ring-gold-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="recommendCheck" className="text-xs text-slate-300 cursor-pointer">
                  ¿Recomendarías este perfume a un amigo o conocido?
                </label>
              </div>

              {/* Comment */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">
                  Tu opinión sincera *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe las notas que más percibes, la estela y si has recibido cumplidos usándolo..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 leading-relaxed resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black font-bold text-xs tracking-wider uppercase shadow-gold-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Publicar Opinión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
