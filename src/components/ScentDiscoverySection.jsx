import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Coffee, 
  Flame, 
  Waves, 
  Wind, 
  Zap, 
  Crown, 
  Heart, 
  Briefcase, 
  Moon, 
  Sun, 
  CloudSnow, 
  ArrowRight, 
  Eye, 
  ShoppingBag, 
  Flower2,
  Check,
  Compass
} from 'lucide-react';

export default function ScentDiscoverySection({ 
  perfumes = [], 
  onSelectPerfume, 
  onAddToCart,
  onNavigateToCatalog 
}) {
  // Active discovery tab: 'notes' | 'vibe' | 'moment'
  const [activeTab, setActiveTab] = useState('notes');
  const [selectedItem, setSelectedItem] = useState('vainilla');

  // 1. EXPLORA POR NOTAS (PDF p. 5, Punto 6)
  const notesList = [
    { 
      id: 'vainilla', 
      name: 'Vainilla', 
      desc: 'Dulzura sensual, cremosa y reconfortante', 
      icon: Sparkles,
      filter: (p) => {
        const text = [p.category, ...(p.notes?.salida || []), ...(p.notes?.corazon || []), ...(p.notes?.base || []), ...(p.accords || [])].join(' ').toLowerCase();
        return text.includes('vainilla');
      }
    },
    { 
      id: 'cafe', 
      name: 'Café Tostado', 
      desc: 'Calidez profunda, energizante y adictiva', 
      icon: Coffee,
      filter: (p) => {
        const text = [p.category, ...(p.notes?.salida || []), ...(p.notes?.corazon || []), ...(p.notes?.base || []), ...(p.accords || [])].join(' ').toLowerCase();
        return text.includes('café') || text.includes('coffee') || text.includes('qahwa');
      }
    },
    { 
      id: 'canela', 
      name: 'Canela & Especias', 
      desc: 'Carácter cálido, exótico y picante', 
      icon: Flame,
      filter: (p) => {
        const text = [p.category, ...(p.notes?.salida || []), ...(p.notes?.corazon || []), ...(p.notes?.base || []), ...(p.accords || [])].join(' ').toLowerCase();
        return text.includes('canela') || text.includes('cardamomo') || text.includes('pimienta');
      }
    },
    { 
      id: 'menta', 
      name: 'Menta Gélida & Frescura', 
      desc: 'Sensación glacial, limpia y vigorizante', 
      icon: Wind,
      filter: (p) => {
        const text = [p.category, ...(p.notes?.salida || []), ...(p.notes?.corazon || []), ...(p.notes?.base || []), ...(p.accords || [])].join(' ').toLowerCase();
        return text.includes('menta') || text.includes('hielo') || text.includes('ice');
      }
    },
    { 
      id: 'citricos', 
      name: 'Cítricos & Bergamota', 
      desc: 'Chispeante, moderno y de porte ejecutivo', 
      icon: Zap,
      filter: (p) => {
        const text = [p.category, ...(p.notes?.salida || []), ...(p.notes?.corazon || []), ...(p.notes?.base || []), ...(p.accords || [])].join(' ').toLowerCase();
        return text.includes('bergamota') || text.includes('cítrico') || text.includes('mandarina') || text.includes('limón');
      }
    },
    { 
      id: 'acuatico', 
      name: 'Notas Acuáticas & Marinas', 
      desc: 'Brisa de mar, frescura salina y elegancia estival', 
      icon: Waves,
      filter: (p) => {
        const text = [p.category, ...(p.notes?.salida || []), ...(p.notes?.corazon || []), ...(p.notes?.base || []), ...(p.accords || [])].join(' ').toLowerCase();
        return text.includes('acuático') || text.includes('marino') || text.includes('sal') || text.includes('mar');
      }
    },
    { 
      id: 'frutal', 
      name: 'Frutas & Sandía', 
      desc: 'Aromas jugosos, alegres y adictivos', 
      icon: Sparkles,
      filter: (p) => {
        const text = [p.category, ...(p.notes?.salida || []), ...(p.notes?.corazon || []), ...(p.notes?.base || []), ...(p.accords || [])].join(' ').toLowerCase();
        return text.includes('sandía') || text.includes('piña') || text.includes('manzana') || text.includes('frutal');
      }
    },
    { 
      id: 'maderas', 
      name: 'Maderas & Cedro', 
      desc: 'Fijación duradera, madurez y presencia', 
      icon: Crown,
      filter: (p) => {
        const text = [p.category, ...(p.notes?.salida || []), ...(p.notes?.corazon || []), ...(p.notes?.base || []), ...(p.accords || [])].join(' ').toLowerCase();
        return text.includes('madera') || text.includes('cedro') || text.includes('oud') || text.includes('akigalawood');
      }
    }
  ];

  // 2. BUSCAR POR PERSONALIDAD: ¿QUÉ QUIERES TRANSMITIR? (PDF p. 5, Punto 7)
  const vibesList = [
    { 
      id: 'seductor', 
      name: 'Seductor & Magnético', 
      desc: 'Aromas que desatan cumplidos y cercanía en citas', 
      icon: Heart,
      filter: (p) => ['khamrah', 'khamrah-qahwa', '9-pm', 'eclaire', 'honor-and-glory'].includes(p.id)
    },
    { 
      id: 'elegante', 
      name: 'Elegante & Distinguido', 
      desc: 'Porte formal, prestigio y sobriedad ejecutiva', 
      icon: Crown,
      filter: (p) => ['fakhar-black', 'asad', 'club-de-nuit-milestone', 'odyssey-homme'].includes(p.id)
    },
    { 
      id: 'fresco', 
      name: 'Fresco & Impecable', 
      desc: 'Sensación de pulcritud, vitalidad y energía limpia', 
      icon: Wind,
      filter: (p) => ['hawas-ice', '9-am-dive', 'club-de-nuit-milestone', 'fakhar-black'].includes(p.id)
    },
    { 
      id: 'misterioso', 
      name: 'Misterioso & Oscuro', 
      desc: 'Especias, tabaco y maderas que dejan una firma única', 
      icon: Moon,
      filter: (p) => ['asad', 'hawas-kobra', 'khamrah-qahwa', 'odyssey-homme'].includes(p.id)
    },
    { 
      id: 'juvenil', 
      name: 'Juvenil & Alegre', 
      desc: 'Aromas chispeantes con frutas y dulzura moderna', 
      icon: Sparkles,
      filter: (p) => ['nitro-red', 'honor-and-glory', 'yara-pink', 'odyssey-mandarin-sky'].includes(p.id)
    },
    { 
      id: 'poderoso', 
      name: 'Poderoso & Imponente', 
      desc: 'Gran proyección y estela para ser el centro de atención', 
      icon: Flame,
      filter: (p) => ['9-pm', 'asad', 'nitro-red', 'khamrah'].includes(p.id)
    }
  ];

  // 3. BUSCAR POR OCASIÓN: PARA CADA MOMENTO (PDF p. 6, Punto 8)
  const momentsList = [
    { 
      id: 'citas', 
      name: 'Citas & Romance', 
      desc: 'Encuentros íntimos donde el aroma habla por ti', 
      icon: Heart,
      filter: (p) => (p.occasions || '').toLowerCase().includes('cita') || ['khamrah', 'khamrah-qahwa', '9-pm', 'eclaire'].includes(p.id)
    },
    { 
      id: 'oficina', 
      name: 'Oficina & Negocios', 
      desc: 'Elegancia no invasiva para el entorno profesional', 
      icon: Briefcase,
      filter: (p) => (p.occasions || '').toLowerCase().includes('oficina') || ['fakhar-black', '9-am-dive', 'club-de-nuit-milestone', 'odyssey-homme'].includes(p.id)
    },
    { 
      id: 'fiesta', 
      name: 'Fiestas & Noche', 
      desc: 'Proyección arrolladora para eventos y celebraciones', 
      icon: Crown,
      filter: (p) => (p.occasions || '').toLowerCase().includes('fiesta') || ['9-pm', 'nitro-red', 'asad', 'khamrah'].includes(p.id)
    },
    { 
      id: 'calor', 
      name: 'Calor & Sol Radiante', 
      desc: 'Aromas acuáticos y cítricos que resisten la temperatura', 
      icon: Sun,
      filter: (p) => (p.votes && p.votes.verano > 2000) || ['hawas-ice', '9-am-dive', 'nitro-red', 'club-de-nuit-milestone'].includes(p.id)
    },
    { 
      id: 'frio', 
      name: 'Clima Frío & Invierno', 
      desc: 'Acordes cálidos y densos que abrazan en el frío', 
      icon: CloudSnow,
      filter: (p) => (p.votes && p.votes.invierno > 6000) || ['khamrah', 'khamrah-qahwa', 'asad', '9-pm', 'eclaire'].includes(p.id)
    },
    { 
      id: 'diario', 
      name: 'Uso Diario & Casual', 
      desc: 'Comodines versátiles para cualquier momento del día', 
      icon: Compass,
      filter: (p) => ['fakhar-black', '9-am-dive', 'odyssey-mandarin-sky', 'nitro-red'].includes(p.id)
    }
  ];

  // Active items list based on current tab
  const currentList = activeTab === 'notes' ? notesList : activeTab === 'vibe' ? vibesList : momentsList;

  // Selected filter definition
  const currentSelection = currentList.find((item) => item.id === selectedItem) || currentList[0];

  // Filtered perfumes based on active selection
  const matchingPerfumes = useMemo(() => {
    if (!currentSelection) return perfumes.slice(0, 4);
    const filtered = perfumes.filter(currentSelection.filter);
    return filtered.length > 0 ? filtered : perfumes.slice(0, 4);
  }, [perfumes, currentSelection]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    const nextList = newTab === 'notes' ? notesList : newTab === 'vibe' ? vibesList : momentsList;
    setSelectedItem(nextList[0].id);
  };

  return (
    <section className="py-20 bg-obsidian-950 border-t border-b border-white/5 relative overflow-hidden">
      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <h2 className="font-cinzel text-2xl sm:text-3xl text-white font-normal tracking-[0.15em] uppercase">
              Descubrimiento Olfativo
            </h2>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-obsidian-900 border border-white/10 shrink-0">
            <button
              onClick={() => handleTabChange('notes')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'notes'
                  ? 'bg-gold-500 text-black shadow-gold-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Explora por Notas
            </button>

            <button
              onClick={() => handleTabChange('vibe')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'vibe'
                  ? 'bg-gold-500 text-black shadow-gold-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ¿Qué quieres transmitir?
            </button>

            <button
              onClick={() => handleTabChange('moment')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'moment'
                  ? 'bg-gold-500 text-black shadow-gold-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Para cada Momento
            </button>
          </div>
        </div>

        {/* Chips Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {currentList.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedItem === item.id;
            const matchCount = perfumes.filter(item.filter).length;

            return (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item.id)}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 group cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-gold-950/40 via-obsidian-850 to-obsidian-900 border-gold-500/70 shadow-lg ring-1 ring-gold-500/30'
                    : 'bg-obsidian-900/60 hover:bg-obsidian-850 border-white/10 hover:border-gold-500/30'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className={`p-2 rounded-xl transition-all ${
                    isSelected 
                      ? 'bg-gold-500 text-black shadow-sm' 
                      : 'bg-white/5 text-gold-400 group-hover:bg-gold-500/20'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-gold-500/20 text-gold-300' : 'text-slate-500'
                  }`}>
                    {matchCount}
                  </span>
                </div>

                <div>
                  <h4 className={`text-xs font-bold transition-colors ${
                    isSelected ? 'text-gold-300' : 'text-white group-hover:text-gold-400'
                  }`}>
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-light">
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Results Display Grid */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-400" />
              <span className="text-xs uppercase tracking-wider text-white font-semibold">
                Mostrando {matchingPerfumes.length} {matchingPerfumes.length === 1 ? 'fragancia' : 'fragancias'} con acorde de <strong className="text-gold-400">{currentSelection?.name}</strong>
              </span>
            </div>

            <button
              onClick={() => onNavigateToCatalog && onNavigateToCatalog()}
              className="text-xs text-gold-400 hover:text-gold-300 font-semibold flex items-center gap-1 group cursor-pointer"
            >
              <span>Ver Catálogo Completo</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {matchingPerfumes.slice(0, 4).map((perfume) => (
              <div 
                key={perfume.id}
                className="bg-obsidian-900/90 rounded-2xl border border-white/10 hover:border-gold-500/40 p-4 space-y-3 transition-all duration-300 group shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div 
                    onClick={() => onSelectPerfume(perfume)}
                    className="cursor-pointer relative aspect-[4/3] rounded-xl overflow-hidden bg-black/60 border border-white/10 mb-3"
                    title="Ver página individual"
                  >
                    <img 
                      src={perfume.image} 
                      alt={perfume.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 font-mono text-[10px] text-gold-400 font-bold border border-gold-500/30">
                      #{perfume.num}
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider">
                      {perfume.brand}
                    </span>
                    <span className="font-mono text-xs font-bold text-gold-400">
                      ${perfume.price ? Number(perfume.price).toFixed(2) : '50.00'}
                    </span>
                  </div>

                  <h3 
                    onClick={() => onSelectPerfume(perfume)}
                    className="font-cinzel text-base font-bold text-white group-hover:text-gold-300 transition-colors cursor-pointer truncate mt-0.5"
                  >
                    {perfume.name}
                  </h3>

                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-1 font-light">
                    {perfume.notes?.salida?.slice(0, 3).join(', ')}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => onSelectPerfume(perfume)}
                    className="py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-gold-400" />
                    <span>Ver</span>
                  </button>

                  <button
                    onClick={() => onAddToCart(perfume)}
                    className="py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-gold-sm cursor-pointer active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Pedir</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
