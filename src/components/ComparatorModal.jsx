import React, { useState } from 'react';
import { 
  X, 
  Scale, 
  ShoppingBag, 
  CloudSnow, 
  Sun, 
  Moon, 
  Trash2, 
  Sparkles, 
  Flame, 
  Eye, 
  MessageCircle, 
  Compass, 
  Briefcase, 
  Heart, 
  Crown, 
  ChevronRight,
  Zap,
  Waves
} from 'lucide-react';

// Specific recommendation verdict for every perfume (PDF p. 7)
const PERFUME_VERDICTS = {
  'khamrah': 'Ideal si buscas un perfume ultra dulce, cálido, especiado e intenso con canela y dátiles de presencia envolvente para citas y clima frío.',
  'khamrah-qahwa': 'Ideal si buscas un perfil dulce similar pero con un toque distintivo de café tostado, cardamomo y un carácter más complejo y versátil.',
  'fakhar-black': 'Ideal si buscas un aroma masculino limpio, pulcro y sofisticado con manzana crujiente y lavanda para oficina y uso diario.',
  'asad': 'Ideal si buscas carácter imponente, masculinidad madura y un perfil especiado oscuro con pimienta negra, café y tabaco ambarino.',
  'honor-and-glory': 'Ideal si buscas dulzura exótica y diferente con piña brulee caramelizada y canela que arranca cumplidos en salidas y eventos.',
  '9-pm': 'Ideal si buscas una máquina insuperable de cumplidos nocturnos: vainilla dulce con manzana y estela potente para fiestas y citas.',
  '9-am-dive': 'Ideal si buscas frescura revitalizante de manzana verde y menta gélida para oficina, días cálidos y actividades diarias.',
  'hawas-ice': 'Ideal si buscas una bomba acuática congelada de altísima proyección para días soleados, eventos casuales y clima caluroso.',
  'hawas-kobra': 'Ideal si buscas exclusividad con cítricos chispeantes, fondo ahumado especiado y presencia magnética para ocasiones especiales.',
  'odyssey-mandarin-sky': 'Ideal si buscas un equilibrio alegre y seductor entre mandarina dulce jugosa y fondo cremoso de caramelo con tonka.',
  'odyssey-homme': 'Ideal si buscas elegancia sobria, sensual e íntima con iris empolvado, vainilla y especias cálidas para noches formales.',
  'club-de-nuit-milestone': 'Ideal si buscas lujo costero con brisa marina salina, bergamota y frutos rojos que transmite distinción veraniega.',
  'yara-pink': 'Ideal si buscas un aroma femenino suave, cremoso y tierno con orquídeas, frutas tropicales y vainilla aterciopelada.',
  'eclaire': 'Ideal si buscas un gourmand reconfortante y ultra apetitoso de leche tibia, caramelo derretido y miel de encanto irresistible.',
  'nitro-red': 'Ideal si buscas energía juvenil y explosiva con sandía dulce acuática y fijación masiva para destacar en cualquier lugar.'
};

// Compute sensory metrics (1 to 5) consistently
const getPerfumeMetrics = (p) => {
  const cat = (p.category || '').toLowerCase();
  const notesAll = [
    ...(p.notes?.salida || []),
    ...(p.notes?.corazon || []),
    ...(p.notes?.base || [])
  ].join(' ').toLowerCase();

  const profile = p.olfactory_profile || {};
  const dulzor = profile.dulzor || (cat.includes('gourmand') || cat.includes('dulce') || notesAll.includes('vainilla') || notesAll.includes('praliné') ? 5 : cat.includes('frutal') ? 4 : cat.includes('ámbar') ? 3 : 2);
  const frescura = profile.frescura || (cat.includes('fresco') || cat.includes('acuático') || cat.includes('cítrico') || notesAll.includes('bergamota') ? 5 : cat.includes('floral') ? 4 : cat.includes('frutal') ? 3 : 1);
  const intensidad = profile.intensidad || (cat.includes('especiado') || cat.includes('gourmand') || cat.includes('amaderado') || cat.includes('oriental') ? 5 : 4);
  const proyeccion = profile.proyeccion || (p.sillage?.toLowerCase().includes('alta') || p.sillage?.toLowerCase().includes('pesada') ? 5 : 4);
  const duracion = profile.duracion || (p.longevity?.includes('12') || p.longevity?.includes('14') ? 5 : 4);
  const versatilidad = profile.versatilidad || (cat.includes('fresco') || cat.includes('cítrico') || p.season_badge?.toLowerCase().includes('versátil') ? 5 : cat.includes('gourmand') ? 3 : 4);

  const occ = (p.occasions || '').toLowerCase();
  const votes = p.votes || {};
  const isDia = (votes.dia || 0) > (votes.noche || 0);
  const isFrio = (votes.invierno || 0) > (votes.verano || 0);

  const dia = isDia ? 5 : (votes.dia > 3000 ? 4 : 3);
  const noche = !isDia ? 5 : (votes.noche > 3000 ? 4 : 3);
  const frio = isFrio ? 5 : (votes.invierno > 4000 ? 4 : 2);
  const calor = !isFrio ? 5 : (votes.verano > 2000 ? 4 : 2);
  const oficina = (occ.includes('oficina') || occ.includes('diario') || cat.includes('fougère') || cat.includes('acuático')) ? 5 : (cat.includes('gourmand') ? 2 : 4);
  const citas = (occ.includes('citas') || occ.includes('románt') || notesAll.includes('vainilla') || notesAll.includes('canela')) ? 5 : 3;
  const fiesta = (occ.includes('fiesta') || p.sillage?.toLowerCase().includes('pesada') || p.id === '9-pm' || p.id === 'asad' || p.id === 'nitro-red') ? 5 : 3;

  return {
    dulzor,
    frescura,
    intensidad,
    proyeccion,
    duracion,
    versatilidad,
    dia,
    noche,
    frio,
    calor,
    oficina,
    citas,
    fiesta
  };
};

// Golden capsules bar renderer
function RatingCapsules({ value = 3, max = 5 }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`h-2 w-4 sm:w-5 rounded-full transition-all ${
            i < value
              ? 'bg-gradient-to-r from-gold-500 to-gold-300 shadow-[0_0_6px_rgba(212,175,55,0.4)]'
              : 'bg-white/10'
          }`}
        />
      ))}
      <span className="text-[11px] font-mono text-gold-400 font-bold ml-1.5">{value}/{max}</span>
    </div>
  );
}

export default function ComparatorModal({ 
  comparedList = [], 
  onClose, 
  onRemoveFromCompare, 
  onAddToCart, 
  onSelectPerfume 
}) {
  const [activeTab, setActiveTab] = useState('sensory'); // 'sensory' | 'occasions' | 'notes'

  const handleWhatsAppConsultComparison = () => {
    const names = comparedList.map((p) => p.name).join(' vs ');
    const text = encodeURIComponent(
      `¡Hola Joufab! Estoy usando el comparador de su web entre *${names}*. ¿Cuál me recomendarían para mis gustos y tienen disponibilidad inmediata?`
    );
    window.open(`https://wa.me/593984526114?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-6xl bg-obsidian-900 border border-gold-500/40 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="px-5 sm:px-8 py-4 border-b border-white/10 flex items-center justify-between bg-obsidian-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-base sm:text-xl font-bold text-white tracking-wide">
                Comparador Olfativo Frente a Frente ({comparedList.length}/3)
              </h2>
              <p className="text-[11px] text-gold-400/90 hidden sm:block">
                Analiza notas, proyección, ocasiones y descubre el veredicto para saber cuál elegir
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View mode toggle tabs */}
        {comparedList.length > 0 && (
          <div className="px-5 sm:px-8 py-2.5 bg-obsidian-950/60 border-b border-white/5 flex items-center justify-between gap-2 overflow-x-auto shrink-0 no-scrollbar">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('sensory')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'sensory'
                    ? 'bg-gold-500 text-black shadow-gold-sm font-bold'
                    : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Perfil Sensorial (Barras)</span>
              </button>

              <button
                onClick={() => setActiveTab('occasions')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'occasions'
                    ? 'bg-gold-500 text-black shadow-gold-sm font-bold'
                    : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Ocasiones & Clima</span>
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'notes'
                    ? 'bg-gold-500 text-black shadow-gold-sm font-bold'
                    : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Pirámide de Notas</span>
              </button>
            </div>

            <button
              onClick={handleWhatsAppConsultComparison}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Preguntar a Joufab por WhatsApp</span>
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="overflow-y-auto p-5 sm:p-7 flex-1 space-y-7">
          {comparedList.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center mx-auto">
                <Scale className="w-8 h-8" />
              </div>
              <h3 className="font-cinzel text-xl text-white font-bold">
                Tu comparador está vacío
              </h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Haz clic en el icono de la balanza en cualquier perfume del catálogo para comparar sus notas, proyección y recibir una conclusión de compra.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-gold-500 text-black font-semibold text-xs uppercase tracking-wider hover:bg-gold-400 transition-all cursor-pointer shadow-gold-sm"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <>
              {/* Product Columns Grid */}
              <div className={`grid grid-cols-1 ${
                comparedList.length === 1 
                  ? 'max-w-md mx-auto' 
                  : comparedList.length === 2 
                  ? 'md:grid-cols-2' 
                  : 'md:grid-cols-3'
              } gap-5`}>
                {comparedList.map((perfume) => {
                  const m = getPerfumeMetrics(perfume);
                  return (
                    <div 
                      key={perfume.id}
                      className="bg-obsidian-950/90 rounded-2xl border border-white/10 p-5 space-y-4 flex flex-col justify-between hover:border-gold-500/40 transition-all shadow-lg"
                    >
                      {/* Top Bar: Brand, Num, Remove */}
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[11px] font-mono text-gold-400 font-bold uppercase tracking-wider">
                            #{perfume.num} • {perfume.brand}
                          </span>
                          <button
                            onClick={() => onRemoveFromCompare(perfume.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
                            title="Quitar de la comparación"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Image Click to dedicated page */}
                        <div 
                          onClick={() => {
                            onClose();
                            onSelectPerfume(perfume);
                          }}
                          className="cursor-pointer relative aspect-[4/3] rounded-xl overflow-hidden bg-black/60 border border-white/10 mb-3 group"
                          title="Clic para ver página completa del perfume"
                        >
                          <img 
                            src={perfume.image} 
                            alt={perfume.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                            <span className="text-xs text-gold-300 font-semibold flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" /> Ver Ficha Dedicada
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-cinzel text-lg font-bold text-white leading-tight">
                              {perfume.name}
                            </h3>
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              {perfume.gender} • {perfume.category}
                            </span>
                          </div>
                          <span className="font-mono text-base font-bold text-gold-400 shrink-0">
                            ${perfume.price ? Number(perfume.price).toFixed(2) : '50.00'}
                          </span>
                        </div>
                      </div>

                      {/* TAB 1: SENSORY BARS (PDF p. 7) */}
                      {activeTab === 'sensory' && (
                        <div className="space-y-3 py-3 border-t border-b border-white/10 text-xs animate-fadeIn">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 font-medium">Dulzor:</span>
                            <RatingCapsules value={m.dulzor} />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 font-medium">Frescura:</span>
                            <RatingCapsules value={m.frescura} />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 font-medium">Intensidad:</span>
                            <RatingCapsules value={m.intensidad} />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 font-medium">Proyección:</span>
                            <RatingCapsules value={m.proyeccion} />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 font-medium">Duración:</span>
                            <RatingCapsules value={m.duracion} />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 font-medium">Versatilidad:</span>
                            <RatingCapsules value={m.versatilidad} />
                          </div>
                        </div>
                      )}

                      {/* TAB 2: OCCASIONS & CLIMATE (PDF p. 7) */}
                      {activeTab === 'occasions' && (
                        <div className="space-y-3 py-3 border-t border-b border-white/10 text-xs animate-fadeIn">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 flex items-center gap-1.5">
                              <Sun className="w-3.5 h-3.5 text-amber-400" /> Día:
                            </span>
                            <RatingCapsules value={m.dia} />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 flex items-center gap-1.5">
                              <Moon className="w-3.5 h-3.5 text-indigo-400" /> Noche:
                            </span>
                            <RatingCapsules value={m.noche} />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 flex items-center gap-1.5">
                              <CloudSnow className="w-3.5 h-3.5 text-cyan-400" /> Clima Frío:
                            </span>
                            <RatingCapsules value={m.frio} />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 flex items-center gap-1.5">
                              <Flame className="w-3.5 h-3.5 text-orange-400" /> Clima Cálido:
                            </span>
                            <RatingCapsules value={m.calor} />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 flex items-center gap-1.5">
                              <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Oficina:
                            </span>
                            <RatingCapsules value={m.oficina} />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 flex items-center gap-1.5">
                              <Heart className="w-3.5 h-3.5 text-rose-400" /> Citas Románticas:
                            </span>
                            <RatingCapsules value={m.citas} />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 flex items-center gap-1.5">
                              <Crown className="w-3.5 h-3.5 text-gold-400" /> Fiesta & Noche:
                            </span>
                            <RatingCapsules value={m.fiesta} />
                          </div>
                        </div>
                      )}

                      {/* TAB 3: NOTES */}
                      {activeTab === 'notes' && (
                        <div className="space-y-2.5 text-xs border-t border-b border-white/10 py-3 animate-fadeIn">
                          <div>
                            <span className="text-slate-400 uppercase font-bold text-[10px] block mb-0.5">
                              Salida (Primeros 15 min):
                            </span>
                            <p className="text-slate-200">
                              {perfume.notes?.salida?.join(', ')}
                            </p>
                          </div>
                          <div>
                            <span className="text-gold-400 uppercase font-bold text-[10px] block mb-0.5">
                              Corazón (Evolución principal):
                            </span>
                            <p className="text-slate-200">
                              {perfume.notes?.corazon?.join(', ')}
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-400 uppercase font-bold text-[10px] block mb-0.5">
                              Fondo (Fijación 8+ horas):
                            </span>
                            <p className="text-slate-200">
                              {perfume.notes?.base?.join(', ')}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Actions: View Product & Add to Cart */}
                      <div className="space-y-2 pt-1">
                        <button
                          onClick={() => {
                            onClose();
                            onSelectPerfume(perfume);
                          }}
                          className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-gold-400" />
                          <span>Ver Ficha Dedicada</span>
                        </button>

                        <button
                          onClick={() => onAddToCart(perfume)}
                          className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-gold-sm cursor-pointer active:scale-95"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Pedir • ${perfume.price ? Number(perfume.price).toFixed(2) : '50.00'}</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* AUTOMATIC VERDICT SECTION: "¿CUÁL ELEGIR?" (PDF p. 7) */}
              <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-gold-950/40 via-obsidian-900 to-obsidian-950 border border-gold-500/50 shadow-xl space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-gold-500/20 text-gold-400 border border-gold-500/40">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-cinzel text-lg sm:text-xl font-bold text-white">
                      ¿Cuál elegir? • Conclusión Olfativa
                    </h4>
                    <p className="text-xs text-gold-400/90 font-light">
                      Guía rápida para tomar la mejor decisión según tu estilo y uso previsto:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                  {comparedList.map((perfume) => (
                    <div 
                      key={perfume.id}
                      className="p-4 rounded-xl bg-obsidian-950/80 border border-white/10 space-y-2 hover:border-gold-500/30 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-cinzel font-bold text-sm text-gold-300">
                          {perfume.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                          ${perfume.price ? Number(perfume.price).toFixed(2) : '50.00'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {PERFUME_VERDICTS[perfume.id] || perfume.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 text-xs text-slate-400">
                  <span className="text-center sm:text-left">
                    ¿Aún no te decides? Te asesoramos en vivo por WhatsApp según tu tipo de piel y ciudad.
                  </span>
                  <button
                    onClick={handleWhatsAppConsultComparison}
                    className="px-4 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Consultar por WhatsApp</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
