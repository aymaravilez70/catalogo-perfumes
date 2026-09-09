import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  Search, 
  BookOpen, 
  Scale, 
  Menu, 
  X,
  Compass
} from 'lucide-react';

export default function Navbar({ 
  cartCount, 
  onOpenCart, 
  favoriteCount, 
  onOpenFavorites, 
  onOpenQuiz, 
  onOpenComparator, 
  comparatorCount,
  onOpenLookbook,
  onSearchChange,
  searchQuery
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled 
        ? 'bg-obsidian-950/90 backdrop-blur-xl border-b border-gold-500/20 shadow-2xl py-3' 
        : 'bg-gradient-to-b from-obsidian-950 via-obsidian-950/60 to-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <img 
            src="/assets/brand/logo.png" 
            alt="Joufab Logo" 
            className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_2px_12px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform duration-300"
          />
          <div className="hidden sm:block">
            <span className="block font-cinzel text-lg tracking-[0.25em] text-white font-bold group-hover:text-gold-400 transition-colors">
              JOUFAB
            </span>
            <span className="block text-[9px] uppercase tracking-[0.35em] text-gold-400/90 font-sans -mt-0.5">
              Perfume House
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wider uppercase text-slate-300">
          <a 
            href="#catalogo" 
            className="hover:text-gold-400 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gold-500 hover:after:w-full after:transition-all duration-300"
          >
            Colección
          </a>

          <button 
            onClick={onOpenQuiz}
            className="flex items-center gap-1.5 hover:text-gold-400 transition-colors py-1 text-gold-300 group"
          >
            <Sparkles className="w-4 h-4 text-gold-400 group-hover:rotate-12 transition-transform" />
            <span>Test Olfativo</span>
          </button>

          <button 
            onClick={onOpenComparator}
            className="flex items-center gap-1.5 hover:text-gold-400 transition-colors py-1 relative"
          >
            <Scale className="w-4 h-4 text-slate-400 group-hover:text-gold-400" />
            <span>Comparador</span>
            {comparatorCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-gold-500 text-black font-bold rounded-full">
                {comparatorCount}
              </span>
            )}
          </button>

          <button 
            onClick={onOpenLookbook}
            className="flex items-center gap-1.5 hover:text-gold-400 transition-colors py-1 text-slate-300"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Catálogo PDF</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Quick Search */}
          <div className="relative hidden lg:block w-48 xl:w-60">
            <input 
              type="text"
              placeholder="Buscar perfume, nota..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-obsidian-850/80 border border-white/10 rounded-full py-1.5 pl-9 pr-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/30 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Favorites Button */}
          <button 
            onClick={onOpenFavorites}
            className="relative p-2 text-slate-300 hover:text-rose-400 transition-colors rounded-full hover:bg-white/5"
            title="Favoritos"
          >
            <Heart className="w-5 h-5" />
            {favoriteCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {favoriteCount}
              </span>
            )}
          </button>

          {/* Cart / WhatsApp Order Drawer Button */}
          <button 
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-black font-semibold text-xs tracking-wider rounded-full shadow-gold-sm hover:brightness-110 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Pedido</span>
            {cartCount > 0 && (
              <span className="bg-obsidian-950 text-gold-400 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-obsidian-900/95 backdrop-blur-2xl border-b border-gold-500/20 px-6 py-5 space-y-4 animate-fadeIn">
          <div className="relative mb-3">
            <input 
              type="text"
              placeholder="Buscar perfume, nota..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-obsidian-800 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <nav className="flex flex-col space-y-3 text-sm font-medium tracking-wider uppercase">
            <a 
              href="#catalogo" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-slate-200 hover:text-gold-400 border-b border-white/5"
            >
              Colección (15 Fragancias)
            </a>

            <button 
              onClick={() => { onOpenQuiz(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 py-2 text-gold-300 hover:text-gold-400 text-left border-b border-white/5"
            >
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Test Olfativo: Encuentra tu Perfume</span>
            </button>

            <button 
              onClick={() => { onOpenComparator(); setMobileMenuOpen(false); }}
              className="flex items-center justify-between py-2 text-slate-200 hover:text-gold-400 text-left border-b border-white/5"
            >
              <span className="flex items-center gap-2">
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
              className="flex items-center gap-2 py-2 text-slate-200 hover:text-gold-400 text-left"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Ver Catálogo PDF Original (24 Págs)</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
