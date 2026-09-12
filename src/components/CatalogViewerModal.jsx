import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Download, 
  Maximize2 
} from 'lucide-react';

export default function CatalogViewerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 18;

  const pageImagePath = `/assets/all_pages/page_${String(currentPage).padStart(2, '0')}.png`;

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-hidden bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-6xl h-[94vh] bg-obsidian-950 border border-gold-500/40 rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden z-10">
        
        {/* Top Control Bar */}
        <div className="px-6 py-3 border-b border-white/10 flex items-center justify-between bg-obsidian-900/90">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-gold-400" />
            <h3 className="font-cinzel text-sm sm:text-base font-bold text-white">
              Catálogo Oficial Joufab 2026 (Página {currentPage} de {totalPages})
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Usa las flechas para hojear
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Page Display */}
        <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden bg-black/80">
          <img 
            src={pageImagePath} 
            alt={`Página ${currentPage}`} 
            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300 select-none"
          />

          {/* Prev Button */}
          {currentPage > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 p-3 rounded-full bg-obsidian-900/80 hover:bg-gold-500 text-white hover:text-black border border-white/15 transition-all shadow-xl hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next Button */}
          {currentPage < totalPages && (
            <button
              onClick={handleNext}
              className="absolute right-4 p-3 rounded-full bg-obsidian-900/80 hover:bg-gold-500 text-white hover:text-black border border-white/15 transition-all shadow-xl hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Bottom Pagination & Thumbnails Slider */}
        <div className="p-3 border-t border-white/10 bg-obsidian-900/90 flex items-center justify-center gap-2 overflow-x-auto">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`w-7 h-7 rounded-full text-xs font-mono font-bold transition-all ${
                currentPage === p
                  ? 'bg-gold-500 text-black shadow-gold-sm scale-110'
                  : 'bg-obsidian-800 text-slate-400 hover:text-white hover:bg-obsidian-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
