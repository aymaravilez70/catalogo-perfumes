import React, { useState, useMemo } from 'react';
import PerfumeCard from './PerfumeCard';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Sparkles, 
  Heart, 
  Grid3X3, 
  LayoutList, 
  ArrowUpDown, 
  CloudSnow, 
  Sun, 
  Moon, 
  Umbrella, 
  Flower2, 
  Leaf, 
  ChevronRight,
  ShoppingBag,
  Clock,
  Flame,
  Scale,
  Eye
} from 'lucide-react';

export default function CatalogView({
  perfumes,
  onSelectPerfume,
  onAddToCart,
  favorites,
  onToggleFavorite,
  comparedList,
  onToggleCompare,
  onOpenQuiz,
  onNavigateHome,
  initialSearchQuery = ''
}) {
  // Filters
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedBrand, setSelectedBrand] = useState('Todas');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [selectedMoment, setSelectedMoment] = useState('all');
  const [selectedNote, setSelectedNote] = useState('all');
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'rating' | 'price_asc' | 'price_desc' | 'name_asc'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Quick Collections (PDF p. 9, Punto 14)
  const [activeCollection, setActiveCollection] = useState('all');

  const collections = [
    { id: 'all', label: 'Todos los perfumes' },
    { id: 'hombre', label: 'Hombre' },
    { id: 'mujer', label: 'Mujer' },
    { id: 'unisex', label: 'Unisex' },
    { id: 'recomendados', label: 'Más recomendados' },
    { id: 'recientes', label: 'Recién llegados' },
    { id: 'tendencias', label: 'Tendencias' }
  ];

  const handleSelectCollection = (id) => {
    setActiveCollection(id);
    if (id === 'all') {
      setSelectedGender('all');
      setSortBy('featured');
    } else if (id === 'hombre') {
      setSelectedGender('Masculino');
    } else if (id === 'mujer') {
      setSelectedGender('Femenino');
    } else if (id === 'unisex') {
      setSelectedGender('Unisex');
    } else if (id === 'recientes') {
      setSelectedGender('all');
      setSortBy('featured');
    } else if (id === 'recomendados') {
      setSelectedGender('all');
      setSortBy('rating');
    } else if (id === 'tendencias') {
      setSelectedGender('all');
    }
  };

  // Popular Key Notes (PDF p. 4)
  const popularNotes = [
    { id: 'all', label: 'Todas las Notas' },
    { id: 'vainilla', label: 'Vainilla' },
    { id: 'café', label: 'Café' },
    { id: 'canela', label: 'Canela' },
    { id: 'menta', label: 'Menta Gélida' },
    { id: 'manzana', label: 'Manzana' },
    { id: 'sandía', label: 'Sandía' },
    { id: 'caramelo', label: 'Caramelo / Praliné' },
    { id: 'maderas', label: 'Maderas' },
    { id: 'bergamota', label: 'Bergamota / Cítricos' },
  ];

  // Brands with dynamic counts
  const brands = useMemo(() => {
    const counts = {};
    perfumes.forEach(p => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return [
      { id: 'Todas', name: 'Todas las Marcas', count: perfumes.length },
      ...Object.keys(counts).sort().map(b => ({
        id: b,
        name: b,
        count: counts[b]
      }))
    ];
  }, [perfumes]);

  // Categories
  const categories = [
    { id: 'all', label: 'Todas las Familias' },
    { id: 'gourmand', label: 'Gourmand Dulce (Café / Caramelo)' },
    { id: 'acuatico', label: 'Acuático & Marino Fresco' },
    { id: 'citrico', label: 'Cítrico Energizante' },
    { id: 'especiado', label: 'Especiado Cálido & Ámbar' },
    { id: 'fougere', label: 'Fougère & Aromático Limpio' },
  ];

  // Seasons
  const seasons = [
    { id: 'all', label: 'Todos los Climas', icon: null },
    { id: 'invierno', label: 'Invierno / Frío', icon: CloudSnow },
    { id: 'verano', label: 'Verano / Calor', icon: Umbrella },
    { id: 'primavera', label: 'Primavera', icon: Flower2 },
    { id: 'otoño', label: 'Otoño', icon: Leaf },
  ];

  // Moments
  const moments = [
    { id: 'all', label: 'Cualquier Momento' },
    { id: 'noche', label: 'Noche / Citas / Fiesta' },
    { id: 'dia', label: 'Día / Oficina' },
    { id: 'versatil', label: 'Versátil (Día y Noche)' },
  ];

  // Genders
  const genders = [
    { id: 'all', label: 'Todos los Géneros' },
    { id: 'Masculino', label: 'Hombre / Masculino' },
    { id: 'Unisex', label: 'Unisex' },
    { id: 'Femenino', label: 'Mujer / Femenino' },
  ];

  // Filter and Sort Logic
  const filteredPerfumes = useMemo(() => {
    let result = perfumes.filter(p => {
      // Favorites filter
      if (showFavoritesOnly && !favorites.includes(p.id)) {
        return false;
      }

      // Brand filter
      if (selectedBrand !== 'Todas' && p.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }

      // Gender filter
      if (selectedGender !== 'all') {
        const gen = (p.gender || '').toLowerCase();
        if (selectedGender === 'Femenino' && !gen.includes('femenino') && !gen.includes('mujer')) return false;
        if (selectedGender === 'Masculino' && !gen.includes('masculino') && !gen.includes('hombre')) return false;
        if (selectedGender === 'Unisex' && !gen.includes('unisex')) return false;
      }

      // Season filter
      if (selectedSeason !== 'all') {
        const match = p.best_season === selectedSeason || (p.votes && p.votes[selectedSeason] > 2000);
        if (!match) return false;
      }

      // Moment filter
      if (selectedMoment !== 'all') {
        if (selectedMoment === 'versatil') {
          if (p.best_moment !== 'versatil') return false;
        } else {
          const match = p.best_moment === selectedMoment || (p.votes && p.votes[selectedMoment] > 3000);
          if (!match) return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all') {
        const cat = (p.category || '').toLowerCase();
        const accords = (p.accords || []).map(a => a.toLowerCase()).join(' ');
        if (selectedCategory === 'gourmand' && !cat.includes('gourmand') && !accords.includes('gourmand') && !accords.includes('café') && !accords.includes('dulce')) return false;
        if (selectedCategory === 'acuatico' && !cat.includes('acuático') && !accords.includes('acuático') && !accords.includes('marino')) return false;
        if (selectedCategory === 'citrico' && !cat.includes('cítrico') && !accords.includes('cítrico')) return false;
        if (selectedCategory === 'especiado' && !cat.includes('especiado') && !accords.includes('especiado') && !accords.includes('ámbar')) return false;
        if (selectedCategory === 'fougere' && !cat.includes('fougère') && !accords.includes('fougère') && !accords.includes('limpio')) return false;
      }

      // Key Note filter (PDF p. 4)
      if (selectedNote !== 'all') {
        const nTarget = selectedNote.toLowerCase();
        const allNotesAndAccords = [
          ...(p.notes?.salida || []),
          ...(p.notes?.corazon || []),
          ...(p.notes?.base || []),
          ...(p.accords || []),
          ...(p.tags || [])
        ].join(' ').toLowerCase();

        if (nTarget === 'caramelo') {
          if (!allNotesAndAccords.includes('caramelo') && !allNotesAndAccords.includes('praliné') && !allNotesAndAccords.includes('dulce')) return false;
        } else if (nTarget === 'maderas') {
          if (!allNotesAndAccords.includes('madera') && !allNotesAndAccords.includes('cedro') && !allNotesAndAccords.includes('akigalawood') && !allNotesAndAccords.includes('sándalo')) return false;
        } else if (nTarget === 'bergamota') {
          if (!allNotesAndAccords.includes('bergamota') && !allNotesAndAccords.includes('cítrico') && !allNotesAndAccords.includes('mandarina') && !allNotesAndAccords.includes('limón')) return false;
        } else {
          if (!allNotesAndAccords.includes(nTarget)) return false;
        }
      }

      // Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const inName = p.name.toLowerCase().includes(q);
        const inBrand = p.brand.toLowerCase().includes(q);
        const inCategory = (p.category || '').toLowerCase().includes(q);
        const inInspired = (p.inspired_by || '').toLowerCase().includes(q);
        const inNicheHouse = (p.niche_house || '').toLowerCase().includes(q);
        const inNotes = [
          ...(p.notes?.salida || []),
          ...(p.notes?.corazon || []),
          ...(p.notes?.base || [])
        ].some(n => n.toLowerCase().includes(q));
        const inTags = (p.tags || []).some(t => t.toLowerCase().includes(q));

        if (!inName && !inBrand && !inCategory && !inNotes && !inTags && !inInspired && !inNicheHouse) {
          return false;
        }
      }

      // Collection filter (PDF p. 9, Punto 14)
      if (activeCollection === 'recomendados') {
        const isRec = (p.rating || 4.8) >= 4.9 || (p.badge || '').toLowerCase().includes('rey') || (p.badge || '').toLowerCase().includes('recomendado');
        if (!isRec) return false;
      }
      if (activeCollection === 'tendencias') {
        const isTrending = ['khamrah', 'khamrah-qahwa', '9-pm', 'hawas-ice', 'asad', 'yara-pink', 'nitro-red', 'honor-and-glory'].includes(p.id);
        if (!isTrending) return false;
      }

      return true;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'featured') {
        const timeA = new Date(a.created_at || 0).getTime();
        const timeB = new Date(b.created_at || 0).getTime();
        if (timeB !== timeA) {
          return timeB - timeA; // Newly added products appear FIRST
        }
        return (parseInt(a.num, 10) || 999) - (parseInt(b.num, 10) || 999);
      }
      if (sortBy === 'catalog_num') {
        return (parseInt(a.num, 10) || 999) - (parseInt(b.num, 10) || 999);
      }
      if (sortBy === 'rating') return (b.rating || 4.8) - (a.rating || 4.8);
      if (sortBy === 'price_asc') return (a.price || 50) - (b.price || 50);
      if (sortBy === 'price_desc') return (b.price || 50) - (a.price || 50);
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [
    perfumes,
    showFavoritesOnly,
    favorites,
    selectedBrand,
    selectedGender,
    selectedSeason,
    selectedMoment,
    selectedCategory,
    selectedNote,
    activeCollection,
    searchQuery,
    sortBy
  ]);

  const hasActiveFilters = 
    selectedBrand !== 'Todas' || 
    selectedGender !== 'all' || 
    selectedSeason !== 'all' || 
    selectedMoment !== 'all' || 
    selectedCategory !== 'all' || 
    selectedNote !== 'all' ||
    activeCollection !== 'all' ||
    searchQuery.trim() !== '' ||
    showFavoritesOnly;

  const handleResetFilters = () => {
    setSelectedBrand('Todas');
    setSelectedGender('all');
    setSelectedSeason('all');
    setSelectedMoment('all');
    setSelectedCategory('all');
    setSelectedNote('all');
    setActiveCollection('all');
    setSearchQuery('');
    setShowFavoritesOnly(false);
  };

  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        
        {/* Clean Luxury Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <h1 className="font-cinzel text-2xl sm:text-4xl text-white font-normal tracking-wide">
              Boutique de Fragancias
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
              {filteredPerfumes.length} {filteredPerfumes.length === 1 ? 'fragancia disponible' : 'fragancias disponibles'} para entrega inmediata en Ecuador.
            </p>
          </div>

          {/* Search Bar & Mobile Filter Trigger */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            
            {/* Live Search */}
            <div className="relative flex-1 md:w-80">
              <input
                type="text"
                placeholder="Buscar perfume, nota o inspiración..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-obsidian-900 border border-white/15 rounded-2xl py-3 pl-11 pr-10 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-gold-500 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Filter Drawer Button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden p-3 rounded-2xl bg-obsidian-900 border border-white/15 text-gold-400 hover:border-gold-500 flex items-center gap-2 shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Filtros</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
              )}
            </button>

          </div>
        </div>

        {/* Quick Collection Tabs (PDF p. 9, Punto 14) */}
        <div className="pt-4 pb-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {collections.map((col) => {
            const isSelected = activeCollection === col.id;
            return (
              <button
                key={col.id}
                onClick={() => handleSelectCollection(col.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gold-500 text-black shadow-gold-sm font-bold'
                    : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
              >
                {col.label}
              </button>
            );
          })}
        </div>

        {/* Active Filters Pills & Sort Bar */}
        <div className="py-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/5">
          
          {/* Active Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {hasActiveFilters && (
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mr-1">
                Filtros Activos:
              </span>
            )}

            {selectedBrand !== 'Todas' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs">
                <span>Marca: {selectedBrand}</span>
                <button onClick={() => setSelectedBrand('Todas')}><X className="w-3.5 h-3.5 hover:text-white" /></button>
              </span>
            )}

            {selectedGender !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs">
                <span>Género: {selectedGender}</span>
                <button onClick={() => setSelectedGender('all')}><X className="w-3.5 h-3.5 hover:text-white" /></button>
              </span>
            )}

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs">
                <span>Familia: {categories.find(c => c.id === selectedCategory)?.label}</span>
                <button onClick={() => setSelectedCategory('all')}><X className="w-3.5 h-3.5 hover:text-white" /></button>
              </span>
            )}

            {selectedSeason !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs">
                <span>Clima: {seasons.find(s => s.id === selectedSeason)?.label}</span>
                <button onClick={() => setSelectedSeason('all')}><X className="w-3.5 h-3.5 hover:text-white" /></button>
              </span>
            )}

            {selectedMoment !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs">
                <span>Momento: {moments.find(m => m.id === selectedMoment)?.label}</span>
                <button onClick={() => setSelectedMoment('all')}><X className="w-3.5 h-3.5 hover:text-white" /></button>
              </span>
            )}

            {selectedNote !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs">
                <span>Nota: {popularNotes.find(n => n.id === selectedNote)?.label}</span>
                <button onClick={() => setSelectedNote('all')}><X className="w-3.5 h-3.5 hover:text-white" /></button>
              </span>
            )}

            {activeCollection !== 'all' && activeCollection !== 'hombre' && activeCollection !== 'mujer' && activeCollection !== 'unisex' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs">
                <span>Colección: {collections.find(c => c.id === activeCollection)?.label}</span>
                <button onClick={() => handleSelectCollection('all')}><X className="w-3.5 h-3.5 hover:text-white" /></button>
              </span>
            )}

            {showFavoritesOnly && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                <Heart className="w-3 h-3 fill-rose-400" />
                <span>Solo Favoritos</span>
                <button onClick={() => setShowFavoritesOnly(false)}><X className="w-3.5 h-3.5 hover:text-white" /></button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-slate-200 text-xs">
                <span>Búsqueda: "{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')}><X className="w-3.5 h-3.5 hover:text-white" /></button>
              </span>
            )}

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-400 hover:text-rose-300 underline uppercase tracking-wider font-semibold ml-2"
              >
                Limpiar todo
              </button>
            )}
          </div>

          {/* Sort Dropdown & View Mode Switcher */}
          <div className="flex items-center gap-3 ml-auto">
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider hidden sm:inline">
                Ordenar por:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-obsidian-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-gold-500 cursor-pointer"
              >
                <option value="featured">Nuevos Ingresos Primero (Recomendado)</option>
                <option value="catalog_num">Catálogo Numérico (#01 a #15)</option>
                <option value="rating">Mejor Calificación (Rating)</option>
                <option value="price_asc">Precio: Menor a Mayor</option>
                <option value="price_desc">Precio: Mayor a Menor</option>
                <option value="name_asc">Alfabético (A - Z)</option>
              </select>
            </div>

            {/* Grid / List Switcher */}
            <div className="flex items-center bg-obsidian-900 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                title="Vista Cuadrícula"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-gold-500 text-black shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                title="Vista Detallada"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-gold-500 text-black shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Main Catalog Layout: Sidebar + Perfumes Grid */}
        <div className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-3 2xl:col-span-2 space-y-5 sticky top-24 max-h-[calc(100vh-6.5rem)] overflow-y-auto pr-2 bg-obsidian-900/80 p-5 rounded-3xl border border-white/10 backdrop-blur-xl">
            
            <div className="flex items-center justify-between pb-3.5 border-b border-white/10 gap-2">
              <div className="flex items-center gap-2 shrink-0">
                <SlidersHorizontal className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="font-cinzel text-xs font-bold uppercase tracking-wider text-white">
                  Filtros
                </span>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-medium px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 transition-all shrink-0 hover:bg-rose-500/20"
                >
                  Restablecer
                </button>
              )}
            </div>

            {/* Brands Filter */}
            <div className="space-y-2">
              <h4 className="text-[11px] uppercase tracking-widest text-gold-400 font-bold">
                Casa / Marca
              </h4>
              <div className="space-y-1">
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBrand(b.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                      selectedBrand === b.id 
                        ? 'bg-gold-500 text-black font-bold shadow-sm' 
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span>{b.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      selectedBrand === b.id ? 'bg-black text-gold-400' : 'bg-white/10 text-slate-400'
                    }`}>
                      {b.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Filter */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <h4 className="text-[11px] uppercase tracking-widest text-gold-400 font-bold">
                Género
              </h4>
              <div className="grid grid-cols-2 gap-1.5">
                {genders.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGender(g.id)}
                    className={`px-3 py-2 rounded-xl text-xs text-center transition-all ${
                      selectedGender === g.id 
                        ? 'bg-gold-500 text-black font-semibold' 
                        : 'text-slate-300 bg-obsidian-850 hover:bg-obsidian-800 border border-white/5'
                    }`}
                  >
                    {g.label.split('/')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Olfactory Family Filter */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <h4 className="text-[11px] uppercase tracking-widest text-gold-400 font-bold">
                Familia Olfativa
              </h4>
              <div className="space-y-1">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all ${
                      selectedCategory === c.id 
                        ? 'bg-gold-500 text-black font-semibold' 
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Season & Climate */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <h4 className="text-[11px] uppercase tracking-widest text-gold-400 font-bold">
                Clima y Estación
              </h4>
              <div className="space-y-1">
                {seasons.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSeason(s.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all ${
                        selectedSeason === s.id 
                          ? 'bg-gold-500 text-black font-semibold' 
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      {Icon && <Icon className="w-3.5 h-3.5 text-gold-400" />}
                      <span>{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Moment / Occasion */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <h4 className="text-[11px] uppercase tracking-widest text-gold-400 font-bold">
                Ocasión de Uso
              </h4>
              <div className="space-y-1">
                {moments.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMoment(m.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all ${
                      selectedMoment === m.id 
                        ? 'bg-gold-500 text-black font-semibold' 
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Key Notes Filter (PDF p. 4) */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <h4 className="text-[11px] uppercase tracking-widest text-gold-400 font-bold">
                Notas Olfativas Clave
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {popularNotes.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setSelectedNote(n.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                      selectedNote === n.id 
                        ? 'bg-gold-500 text-black font-bold shadow-sm' 
                        : 'text-slate-300 bg-obsidian-850 hover:bg-obsidian-800 border border-white/5'
                    }`}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quiz Banner in Sidebar */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={onOpenQuiz}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-gold-600/20 to-amber-600/20 border border-gold-500/40 text-left hover:border-gold-400 transition-all space-y-1 group"
              >
                <span className="text-[10px] uppercase tracking-wider text-gold-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Asistente Virtual
                </span>
                <h5 className="font-cinzel text-xs font-bold text-white group-hover:text-gold-300">
                  ¿No sabes cuál elegir?
                </h5>
                <p className="text-[11px] text-slate-400">
                  Haz el test olfativo en 3 preguntas rápidas →
                </p>
              </button>
            </div>

          </aside>

          {/* Right Perfume Grid / List Area */}
          <div className="lg:col-span-9 2xl:col-span-10 space-y-6 min-h-[750px]">
            {filteredPerfumes.length === 0 ? (
              <div className="py-24 text-center space-y-4 rounded-3xl bg-obsidian-900/60 border border-white/10 p-8">
                <Search className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="font-cinzel text-2xl text-white">No se encontraron fragancias</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  No hay perfumes que coincidan con la combinación de filtros seleccionada. Prueba ampliando la búsqueda o restableciendo los filtros.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-full bg-gold-500 text-black font-semibold text-xs tracking-wider uppercase hover:bg-gold-400 transition-all shadow-gold-sm"
                >
                  Restablecer Filtros
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              
              /* Grid View (Responsive 3 to 4 Columns) */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPerfumes.map((perfume) => (
                  <PerfumeCard
                    key={perfume.id}
                    perfume={perfume}
                    onSelect={onSelectPerfume}
                    onAddToCart={onAddToCart}
                    isFavorite={favorites.includes(perfume.id)}
                    onToggleFavorite={onToggleFavorite}
                    isCompared={comparedList.some((p) => p.id === perfume.id)}
                    onToggleCompare={onToggleCompare}
                  />
                ))}
              </div>

            ) : (

              /* Detailed List View */
              <div className="space-y-4">
                {filteredPerfumes.map((perfume) => {
                  const isFav = favorites.includes(perfume.id);
                  const isComp = comparedList.some(p => p.id === perfume.id);

                  return (
                    <div
                      key={perfume.id}
                      className="group bg-gradient-to-r from-obsidian-900/90 to-obsidian-950/90 rounded-3xl border border-white/10 hover:border-gold-500/40 p-5 flex flex-col sm:flex-row items-center gap-6 shadow-luxury hover:shadow-luxury-hover transition-all duration-300"
                    >
                      {/* Bottle Thumbnail */}
                      <div 
                        onClick={() => onSelectPerfume(perfume)}
                        className="relative w-36 h-44 shrink-0 rounded-2xl overflow-hidden bg-black/60 cursor-pointer p-1.5 border border-white/5"
                      >
                        <img
                          src={perfume.image}
                          alt={perfume.name}
                          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 font-mono text-[10px] text-slate-300 font-bold">
                          #{perfume.num}
                        </div>
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/80 font-mono text-[10px] text-gold-400 font-bold border border-gold-500/30">
                          ${perfume.price ? Number(perfume.price).toFixed(2) : '50.00'}
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                        
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                          <div>
                            <span className="text-[11px] uppercase tracking-widest text-gold-400 font-semibold block">
                              {perfume.brand} • {perfume.gender || 'Unisex'}
                            </span>
                            <h3 
                              onClick={() => onSelectPerfume(perfume)}
                              className="font-cinzel text-xl font-bold text-white hover:text-gold-300 transition-colors cursor-pointer"
                            >
                              {perfume.name}
                            </h3>
                          </div>

                          <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 w-fit mx-auto sm:mx-0">
                            {perfume.category}
                          </span>
                        </div>

                        {/* Luxury Inspiration */}
                        {perfume.inspired_by && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gold-500/10 border border-gold-500/20 text-xs text-gold-300">
                            <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                            <span>
                              <span className="text-slate-400 text-[10px] uppercase tracking-wider font-bold mr-1">Inspiración:</span>
                              <span className="font-semibold text-white">{perfume.inspired_by}</span>
                            </span>
                          </div>
                        )}

                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {perfume.description}
                        </p>

                        {/* Notes Badges & Performance */}
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 mr-2">
                            <Clock className="w-3.5 h-3.5 text-gold-400" />
                            <span>{perfume.longevity || '8-10 horas'}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 mr-2">
                            <Flame className="w-3.5 h-3.5 text-amber-400" />
                            <span>{perfume.sillage || 'Alta'}</span>
                          </div>
                          {perfume.notes.salida.slice(0, 3).map((n, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-obsidian-800 text-[10px] text-slate-300 border border-white/5">
                              {n}
                            </span>
                          ))}
                        </div>

                      </div>

                      {/* Right Action Column */}
                      <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-2.5 shrink-0 w-full sm:w-36 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-white/10 sm:pl-5">
                        <div className="text-left sm:text-center">
                          <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-semibold leading-none mb-1">Precio</span>
                          <span className="font-mono text-lg font-bold text-gold-400 leading-none">
                            ${perfume.price ? Number(perfume.price).toFixed(2) : '50.00'}
                          </span>
                        </div>

                        <button
                          onClick={() => onAddToCart(perfume)}
                          className="flex-1 sm:w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-semibold text-xs tracking-wider uppercase shadow-gold-sm transition-all active:scale-95"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Pedir</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSelectPerfume(perfume)}
                            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                            title="Ver Ficha Sensorial"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onToggleFavorite(perfume)}
                            className={`p-2.5 rounded-xl border transition-all ${
                              isFav ? 'bg-rose-500/20 text-rose-500 border-rose-500/30' : 'bg-white/5 text-slate-300 border-white/10 hover:text-rose-400'
                            }`}
                            title="Guardar en favoritos"
                          >
                            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                          </button>

                          <button
                            onClick={() => onToggleCompare(perfume)}
                            className={`p-2.5 rounded-xl border transition-all ${
                              isComp ? 'bg-gold-500 text-black border-gold-400 font-bold' : 'bg-white/5 text-slate-300 border-white/10 hover:text-white'
                            }`}
                            title="Comparar"
                          >
                            <Scale className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            )}

          </div>

        </div>

      </div>

      {/* Mobile Filters Slide-over Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileFiltersOpen(false)}
          />

          <div className="relative ml-auto w-full max-w-xs bg-obsidian-950 border-l border-gold-500/30 h-full p-6 overflow-y-auto space-y-6 shadow-2xl z-10 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gold-400" />
                Filtros de Catálogo
              </span>
              <button 
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Brands */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-widest text-gold-400 font-bold">Marcas</h4>
              <div className="space-y-1">
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => { setSelectedBrand(b.id); setMobileFiltersOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs ${
                      selectedBrand === b.id ? 'bg-gold-500 text-black font-bold' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span>{b.name}</span>
                    <span className="text-[10px]">{b.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Genders */}
            <div className="space-y-2 pt-3 border-t border-white/10">
              <h4 className="text-xs uppercase tracking-widest text-gold-400 font-bold">Género</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {genders.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => { setSelectedGender(g.id); setMobileFiltersOpen(false); }}
                    className={`p-2 rounded-xl text-xs text-center ${
                      selectedGender === g.id ? 'bg-gold-500 text-black font-semibold' : 'bg-obsidian-900 text-slate-300'
                    }`}
                  >
                    {g.label.split('/')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Families */}
            <div className="space-y-2 pt-3 border-t border-white/10">
              <h4 className="text-xs uppercase tracking-widest text-gold-400 font-bold">Familias</h4>
              <div className="space-y-1">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCategory(c.id); setMobileFiltersOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs ${
                      selectedCategory === c.id ? 'bg-gold-500 text-black font-semibold' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Notes (Mobile) */}
            <div className="space-y-2 pt-3 border-t border-white/10">
              <h4 className="text-xs uppercase tracking-widest text-gold-400 font-bold">Notas Clave</h4>
              <div className="flex flex-wrap gap-1.5">
                {popularNotes.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => { setSelectedNote(n.id); setMobileFiltersOpen(false); }}
                    className={`px-2.5 py-1 rounded-lg text-xs ${
                      selectedNote === n.id 
                        ? 'bg-gold-500 text-black font-bold' 
                        : 'bg-obsidian-900 text-slate-300 border border-white/5'
                    }`}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleResetFilters}
                className="w-full py-2.5 rounded-xl border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider hover:bg-rose-500/10"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
