import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  BookOpen, 
  Scale, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

export default function Navbar({ 
  currentView = 'home',
  onNavigate,
  cartCount, 
  onOpenCart, 
  favoriteCount, 
  onOpenFavorites, 
  onOpenQuiz, 
  onOpenComparator, 
  comparatorCount,
  onOpenLookbook,
  onOpenStory,
  onOpenSearch,
  onSearchChange,
  searchQuery
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
      scrolled 
        ? 'bg-obsidian-950/95 backdrop-blur-2xl border-b border-gold-500/20 shadow-2xl py-3' 
        : 'bg-gradient-to-b from-obsidian-950/90 via-obsidian-950/40 to-transparent py-5'
    }`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4">
        
        {/* Left Zone: Brand & Monogram Logo */}
        <button 
          onClick={() => onNavigate && onNavigate('home')} 
          className="flex items-center gap-3.5 group shrink-0 text-left cursor-pointer"
        >
          <img 
            src="/assets/brand/logo.png" 
            alt="Joufab Logo" 
            className="h-10 sm:h-11 w-auto object-contain drop-shadow-[0_2px_12px_rgba(212,175,55,0.35)] group-hover:scale-105 transition-transform duration-300"
          />
          <div className="flex flex-col">
            <span className="font-cinzel text-lg sm:text-xl tracking-[0.28em] text-white font-bold group-hover:text-gold-400 transition-colors leading-none">
              JOUFAB
            </span>
            <span className="text-[9px] uppercase tracking-[0.38em] text-gold-400 font-sans mt-1 leading-none">
              Perfume House
            </span>
          </div>
        </button>

        {/* Center Zone: Clean, Spacious Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-11 text-xs xl:text-[13px] font-semibold tracking-[0.22em] uppercase text-slate-300">
          <button 
            onClick={() => onNavigate && onNavigate('home')} 
            className={`transition-colors py-2 whitespace-nowrap relative group ${
              currentView === 'home' ? 'text-gold-400 font-bold' : 'text-slate-300 hover:text-gold-400'
            }`}
          >
            <span>Inicio</span>
            <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 transition-all duration-300 ${
              currentView === 'home' ? 'w-full' : 'w-0 group-hover:w-full'
            }`} />
          </button>

          <button 
            onClick={() => onNavigate && onNavigate('catalog')} 
            className={`transition-colors py-2 whitespace-nowrap relative group ${
              currentView === 'catalog' ? 'text-gold-400 font-bold' : 'text-slate-300 hover:text-gold-400'
            }`}
          >
            <span>Boutique & Catálogo</span>
            <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 transition-all duration-300 ${
              currentView === 'catalog' ? 'w-full' : 'w-0 group-hover:w-full'
            }`} />
          </button>

          <button 
            onClick={onOpenLookbook}
            className="hover:text-gold-400 transition-colors py-2 whitespace-nowrap relative group flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400 group-hover:text-gold-400 transition-colors" />
            <span>Catálogo PDF</span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 group-hover:w-full transition-all duration-300" />
          </button>
        </nav>

        {/* Right Zone: Interactive Utility Bar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Mobile Search Button */}
          <button
            onClick={onOpenSearch}
            title="Buscar por notas, marcas u ocasiones..."
            className="md:hidden p-2 text-slate-300 hover:text-gold-400 transition-colors rounded-full hover:bg-white/5 border border-transparent hover:border-white/10"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Desktop Search Trigger */}
          <div 
            onClick={onOpenSearch}
            className="relative hidden md:flex items-center cursor-pointer group"
          >
            <div className="w-36 lg:w-44 xl:w-52 bg-obsidian-900/80 hover:bg-obsidian-850 border border-white/15 group-hover:border-gold-500/60 rounded-full py-1.5 pl-8 pr-3 text-xs text-slate-400 group-hover:text-slate-200 transition-all duration-300 flex items-center justify-between">
              <span className="truncate">Buscar notas, ocasión...</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-400 group-hover:text-gold-300">
                ⌘K
              </span>
            </div>
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-gold-400 absolute left-2.5 top-2.5 transition-colors pointer-events-none" />
          </div>

          {/* Comparador Quick Action */}
          <button
            onClick={onOpenComparator}
            title="Comparador de fragancias"
            className="relative p-2 sm:p-2.5 text-slate-300 hover:text-gold-400 transition-colors rounded-full hover:bg-white/5 border border-transparent hover:border-white/10"
          >
            <Scale className="w-4 h-4" />
            {comparatorCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-gold-500 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-gold-sm">
                {comparatorCount}
              </span>
            )}
          </button>

          {/* Favorites Quick Action */}
          <button 
            onClick={onOpenFavorites}
            className="relative p-2 sm:p-2.5 text-slate-300 hover:text-rose-400 transition-colors rounded-full hover:bg-white/5 border border-transparent hover:border-white/10"
            title="Fragancias Favoritas"
          >
            <Heart className="w-4 h-4" />
            {favoriteCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {favoriteCount}
              </span>
            )}
          </button>

          {/* WhatsApp Order Drawer Button */}
          <button 
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-black font-semibold text-xs tracking-wider uppercase rounded-full shadow-gold-sm hover:brightness-110 active:scale-95 transition-all ml-1"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="font-bold hidden sm:inline">Pedido</span>
            {cartCount > 0 && (
              <span className="bg-obsidian-950 text-gold-400 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5 ml-1"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-obsidian-950/98 backdrop-blur-2xl border-b border-gold-500/20 px-6 py-6 space-y-4 animate-fadeIn">
          <div className="relative mb-3">
            <input 
              type="text"
              placeholder="Buscar fragancia, nota..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-obsidian-900 border border-white/15 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          <nav className="flex flex-col space-y-3 text-sm font-medium tracking-wider uppercase">
            <button 
              onClick={() => { if (onNavigate) onNavigate('home'); setMobileMenuOpen(false); }}
              className={`py-2.5 border-b border-white/5 flex items-center justify-between text-left ${
                currentView === 'home' ? 'text-gold-400 font-bold' : 'text-slate-200 hover:text-gold-400'
              }`}
            >
              <span>Portada / Inicio</span>
            </button>

            <button 
              onClick={() => { if (onNavigate) onNavigate('catalog'); setMobileMenuOpen(false); }}
              className={`py-2.5 border-b border-white/5 flex items-center justify-between text-left ${
                currentView === 'catalog' ? 'text-gold-400 font-bold' : 'text-slate-200 hover:text-gold-400'
              }`}
            >
              <span>Boutique & Catálogo Completo</span>
              <span className="text-[11px] text-gold-400 font-mono">15 Perfumes</span>
            </button>

            <button 
              onClick={() => { onOpenComparator(); setMobileMenuOpen(false); }}
              className="flex items-center justify-between py-2.5 text-slate-200 hover:text-gold-400 text-left border-b border-white/5"
            >
              <span className="flex items-center gap-2.5">
                <Scale className="w-4 h-4 text-slate-400" />
                Comparador de Fragancias
              </span>
              {comparatorCount > 0 && (
                <span className="px-2 py-0.5 text-xs bg-gold-500 text-black font-bold rounded-full">
                  {comparatorCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => { onOpenLookbook(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2.5 py-2.5 text-slate-200 hover:text-gold-400 text-left"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Ver Catálogo PDF 2026 (18 Págs)</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
