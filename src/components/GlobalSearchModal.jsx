import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Sparkles, 
  ArrowRight, 
  Flame, 
  Clock, 
  ShoppingBag,
  Eye,
  Tag
} from 'lucide-react';

export default function GlobalSearchModal({ 
  isOpen, 
  onClose, 
  perfumes = [], 
  onSelectPerfume,
  onAddToCart 
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.trim().toLowerCase();

  // Search matching across all fields specified in PDF
  const results = cleanQuery === '' ? [] : perfumes.filter((p) => {
    const nameMatch = p.name?.toLowerCase().includes(cleanQuery);
    const brandMatch = p.brand?.toLowerCase().includes(cleanQuery);
    const catMatch = p.category?.toLowerCase().includes(cleanQuery);
    const descMatch = p.description?.toLowerCase().includes(cleanQuery);
    const occasionsMatch = p.occasions?.toLowerCase().includes(cleanQuery);
    const seasonMatch = p.season_badge?.toLowerCase().includes(cleanQuery);
    const inspMatch = p.inspired_by?.toLowerCase().includes(cleanQuery);

    // Notes match
    const notesAll = [
      ...(p.notes?.salida || []),
      ...(p.notes?.corazon || []),
      ...(p.notes?.base || [])
    ].join(' ').toLowerCase();
    const notesMatch = notesAll.includes(cleanQuery);

    // Tags & Accords match
    const tagsMatch = (p.tags || []).join(' ').toLowerCase().includes(cleanQuery);
    const accordsMatch = (p.accords || []).join(' ').toLowerCase().includes(cleanQuery);

    return nameMatch || brandMatch || catMatch || descMatch || occasionsMatch || seasonMatch || inspMatch || notesMatch || tagsMatch || accordsMatch;
  });

  const popularTags = [
    'Vainilla', 
    'Canela', 
    'Café', 
    'Noche', 
    'Citas', 
    'Gourmand', 
    'Fresco', 
    'Amaderado', 
    'Lattafa', 
    'Rasasi', 
    'Afnan', 
    'Dátiles'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 flex items-start justify-center bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Background click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-obsidian-900 border border-gold-500/40 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 sm:my-14 flex flex-col max-h-[85vh]">
        
        {/* Search Header Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-obsidian-950 flex items-center gap-3">
          <Search className="w-5 h-5 text-gold-400 shrink-0 ml-1" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, nota (vainilla, canela), ocasión (noche, cita), casa o estilo..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs uppercase tracking-wider text-slate-400 hover:text-gold-400 px-2 py-1 rounded-lg border border-white/10 hover:border-gold-500/40 transition-colors shrink-0"
          >
            ESC
          </button>
        </div>

        {/* Popular Tags Quick Navigation */}
        <div className="px-4 sm:px-6 py-2.5 bg-obsidian-950/60 border-b border-white/5 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 tracking-wider">
            Sugerencias:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  cleanQuery === tag.toLowerCase()
                    ? 'bg-gold-500 text-black font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-gold-300 border border-white/5'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1 space-y-3">
          {cleanQuery === '' ? (
            <div className="py-12 text-center space-y-3">
              <Search className="w-10 h-10 text-slate-700 mx-auto" />
              <h3 className="font-cinzel text-base text-white">Buscador Olfativo Joufab</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Escribe una nota que te guste (ej. <span className="text-gold-400 font-medium">vainilla, café, jengibre</span>), una ocasión (ej. <span className="text-gold-400 font-medium">noche, oficina, citas</span>) o la casa de perfumería.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Sparkles className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="font-cinzel text-base text-white">Sin coincidencias para "{query}"</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Prueba buscando por familias olfativas como <em>Gourmand, Cítrico, Amaderado</em> o notas principales.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1 pb-1">
                <span>{results.length} fragancia(s) encontrada(s):</span>
                <span className="text-gold-400 text-[11px]">Haz clic para ver la ficha completa</span>
              </div>

              {results.map((perfume) => (
                <div
                  key={perfume.id}
                  onClick={() => {
                    onSelectPerfume(perfume);
                    onClose();
                  }}
                  className="group cursor-pointer bg-gradient-to-r from-obsidian-950/80 to-obsidian-900/80 hover:from-obsidian-900 hover:to-obsidian-850 p-3 sm:p-4 rounded-2xl border border-white/10 hover:border-gold-500/40 flex items-center justify-between gap-4 transition-all duration-200"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={perfume.image}
                      alt={perfume.name}
                      className="w-12 h-14 sm:w-14 sm:h-16 object-cover rounded-xl border border-white/10 shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-gold-400 font-bold">
                          #{perfume.num} • {perfume.brand}
                        </span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-white/5 border border-white/10 text-slate-300">
                          {perfume.category}
                        </span>
                      </div>
                      
                      <h4 className="font-cinzel text-sm sm:text-base font-bold text-white group-hover:text-gold-300 transition-colors truncate mt-0.5">
                        {perfume.name}
                      </h4>

                      {perfume.inspired_by && (
                        <span className="text-[11px] text-slate-400 block truncate">
                          Insp: <span className="text-gold-200/90 font-medium">{perfume.inspired_by}</span>
                        </span>
                      )}

                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {perfume.notes?.salida?.slice(0, 3).map((note, idx) => (
                          <span 
                            key={idx}
                            className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                              note.toLowerCase().includes(cleanQuery)
                                ? 'bg-gold-500 text-black font-bold'
                                : 'bg-obsidian-800 text-slate-300'
                            }`}
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="font-mono text-sm sm:text-base font-bold text-gold-400">
                      ${perfume.price ? Number(perfume.price).toFixed(2) : '50.00'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 group-hover:text-gold-400 transition-colors">
                      <span>Ver Ficha</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-white/10 bg-obsidian-950 flex items-center justify-between text-[11px] text-slate-400">
          <span>Consejo: Puedes buscar varias palabras clave a la vez</span>
          <span className="text-gold-400/80 font-mono">Joufab Scent Intelligence</span>
        </div>

      </div>
    </div>
  );
}
