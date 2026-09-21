import React from 'react';
import { 
  X, 
  Scale, 
  ShoppingBag, 
  CloudSnow, 
  Umbrella, 
  Sun, 
  Moon, 
  Trash2, 
  Plus, 
  Sparkles 
} from 'lucide-react';

export default function ComparatorModal({ 
  comparedList, 
  onClose, 
  onRemoveFromCompare, 
  onAddToCart, 
  onSelectPerfume 
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-5xl bg-obsidian-900 border border-gold-500/30 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-obsidian-950/80">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-gold-400" />
            <h2 className="font-cinzel text-lg font-bold text-white tracking-wide">
              Comparador de Fragancias ({comparedList.length}/3)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">
          {comparedList.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <Scale className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="font-cinzel text-xl text-white">
                No has seleccionado perfumes para comparar
              </h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Haz clic en el icono de la balanza en cualquier tarjeta del catálogo para agregar fragancias y ver sus notas y votos frente a frente.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-gold-500 text-black font-semibold text-xs uppercase tracking-wider hover:bg-gold-400 transition-all"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comparedList.map((perfume) => (
                <div 
                  key={perfume.id}
                  className="bg-obsidian-950/80 rounded-2xl border border-white/10 p-5 space-y-4 flex flex-col justify-between"
                >
                  
                  {/* Top image & remove */}
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[11px] font-mono text-gold-400 font-bold">
                        #{perfume.num} • {perfume.brand}
                      </span>
                      <button
                        onClick={() => onRemoveFromCompare(perfume.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Quitar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div 
                      onClick={() => {
                        onClose();
                        onSelectPerfume(perfume);
                      }}
                      className="cursor-pointer relative aspect-square rounded-xl overflow-hidden bg-black/60 border border-white/10 mb-3"
                    >
                      <img 
                        src={perfume.image} 
                        alt={perfume.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <h3 className="font-cinzel text-lg font-bold text-white">
                      {perfume.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2 mt-1.5">
                      <span className="inline-block px-2 py-0.5 rounded bg-white/5 text-[11px] text-gold-300 font-medium">
                        {perfume.category}
                      </span>
                      <span className="font-mono text-xs font-bold text-gold-400">
                        ${perfume.price ? Number(perfume.price).toFixed(2) : '50.00'}
                      </span>
                    </div>
                  </div>

                  {/* Notes comparison */}
                  <div className="space-y-3 text-xs border-t border-b border-white/10 py-3">
                    <div>
                      <span className="text-slate-500 uppercase font-semibold text-[10px] block mb-1">
                        Salida:
                      </span>
                      <p className="text-slate-200">
                        {perfume.notes.salida.join(', ')}
                      </p>
                    </div>

                    <div>
                      <span className="text-gold-400/80 uppercase font-semibold text-[10px] block mb-1">
                        Corazón:
                      </span>
                      <p className="text-slate-200">
                        {perfume.notes.corazon.join(', ')}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-500 uppercase font-semibold text-[10px] block mb-1">
                        Fondo:
                      </span>
                      <p className="text-slate-200">
                        {perfume.notes.base.join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Suitability stats */}
                  <div className="space-y-2 text-xs">
                    <span className="text-slate-400 uppercase font-semibold text-[10px] block">
                      Votos de Rendimiento:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-obsidian-800/80 p-2 rounded-lg flex items-center justify-between">
                        <span className="flex items-center gap-1 text-cyan-300 text-[11px]">
                          <CloudSnow className="w-3 h-3" /> Invierno
                        </span>
                        <span className="font-mono font-bold text-slate-300">
                          {perfume.votes.invierno}
                        </span>
                      </div>

                      <div className="bg-obsidian-800/80 p-2 rounded-lg flex items-center justify-between">
                        <span className="flex items-center gap-1 text-rose-300 text-[11px]">
                          <Umbrella className="w-3 h-3" /> Verano
                        </span>
                        <span className="font-mono font-bold text-slate-300">
                          {perfume.votes.verano}
                        </span>
                      </div>

                      <div className="bg-obsidian-800/80 p-2 rounded-lg flex items-center justify-between">
                        <span className="flex items-center gap-1 text-amber-300 text-[11px]">
                          <Sun className="w-3 h-3" /> Día
                        </span>
                        <span className="font-mono font-bold text-slate-300">
                          {perfume.votes.dia}
                        </span>
                      </div>

                      <div className="bg-obsidian-800/80 p-2 rounded-lg flex items-center justify-between">
                        <span className="flex items-center gap-1 text-indigo-300 text-[11px]">
                          <Moon className="w-3 h-3" /> Noche
                        </span>
                        <span className="font-mono font-bold text-slate-300">
                          {perfume.votes.noche}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={() => onAddToCart(perfume)}
                    className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Agregar a Pedido • ${perfume.price ? Number(perfume.price).toFixed(2) : '50.00'}</span>
                  </button>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
