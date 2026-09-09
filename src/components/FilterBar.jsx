import React from 'react';
import { 
  Filter, 
  Sparkles, 
  Search, 
  X, 
  Sun, 
  Moon, 
  CloudSnow, 
  Flower2, 
  Umbrella, 
  Leaf 
} from 'lucide-react';

export default function FilterBar({
  selectedSeason,
  setSelectedSeason,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  selectedMoment,
  setSelectedMoment,
  searchQuery,
  setSearchQuery,
  totalResults,
  onResetFilters
}) {
  const seasons = [
    { id: 'all', label: 'Todas las Estaciones', icon: null },
    { id: 'invierno', label: 'Invierno / Frío', icon: CloudSnow },
    { id: 'verano', label: 'Verano / Calor', icon: Umbrella },
    { id: 'primavera', label: 'Primavera', icon: Flower2 },
    { id: 'otoño', label: 'Otoño', icon: Leaf },
  ];

  const moments = [
    { id: 'all', label: 'Cualquier Momento' },
    { id: 'dia', label: '☀️ Día / Oficina' },
    { id: 'noche', label: '🌙 Noche / Citas / Fiesta' },
    { id: 'versatil', label: '✨ Versátil (Día y Noche)' },
  ];

  const categories = [
    { id: 'all', label: 'Todas las Familias' },
    { id: 'gourmand', label: 'Gourmand Dulce (Café/Caramelo)' },
    { id: 'acuatico', label: 'Acuático / Marino Fresco' },
    { id: 'citrico', label: 'Cítrico Energizante' },
    { id: 'especiado', label: 'Especiado Cálido / Ámbar' },
    { id: 'fougere', label: 'Fougère / Aromático Limpio' },
  ];

  const brands = [
    'Todas', 'Lattafa', 'Rasasi', 'Armaf', 'Afnan', 'Dumont'
  ];

  const hasActiveFilters = 
    selectedSeason !== 'all' || 
    selectedCategory !== 'all' || 
    selectedBrand !== 'Todas' || 
    selectedMoment !== 'all' ||
    searchQuery.trim() !== '';

  return (
    <div id="catalogo" className="pt-12 pb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Title & Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-[0.25em] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Catálogo Interactivo
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white">
            Nuestra Colección
          </h2>
          <p className="text-sm text-slate-400 mt-1 font-light">
            Mostrando <span className="text-gold-400 font-semibold">{totalResults}</span> de 15 fragancias disponibles
          </p>
        </div>

        {/* Global Search Box in Filter Header */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Buscar por nombre, nota (vainilla, café...)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-obsidian-850 border border-white/15 rounded-2xl py-3 pl-11 pr-10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all shadow-inner"
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
      </div>

      {/* Filter Tabs & Badges */}
      <div className="space-y-4">
        
        {/* Season Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium whitespace-nowrap mr-1 flex items-center gap-1.5">
            <CloudSnow className="w-3.5 h-3.5 text-gold-400" />
            Clima:
          </span>
          {seasons.map((s) => {
            const Icon = s.icon;
            const isSelected = selectedSeason === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSeason(s.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gold-500 text-black shadow-gold-sm font-semibold'
                    : 'bg-obsidian-850 hover:bg-obsidian-700 text-slate-300 border border-white/10'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Moment and Category Row */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          
          {/* Moment Filter */}
          <div className="flex items-center gap-1.5 bg-obsidian-900 border border-white/10 rounded-2xl p-1">
            {moments.map((m) => {
              const isSelected = selectedMoment === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMoment(m.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-white/15 text-gold-300 shadow-sm border border-gold-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* Category Dropdown / Select */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-obsidian-850 border border-white/10 rounded-2xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-gold-500 cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-obsidian-900 text-white">
                {c.label}
              </option>
            ))}
          </select>

          {/* Brand Filter */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-obsidian-850 border border-white/10 rounded-2xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-gold-500 cursor-pointer"
          >
            {brands.map((b) => (
              <option key={b} value={b} className="bg-obsidian-900 text-white">
                {b === 'Todas' ? 'Todas las Marcas' : b}
              </option>
            ))}
          </select>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-all ml-auto"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpiar Filtros</span>
            </button>
          )}

        </div>

      </div>

    </div>
  );
}
