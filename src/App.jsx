import React, { useState, useEffect, useMemo } from 'react';
import perfumesData from './data/perfumesData.json';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import PerfumeCard from './components/PerfumeCard';
import PerfumeModal from './components/PerfumeModal';
import ScentQuizModal from './components/ScentQuizModal';
import ComparatorModal from './components/ComparatorModal';
import CartDrawer from './components/CartDrawer';
import CatalogViewerModal from './components/CatalogViewerModal';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import { 
  Sparkles, 
  MessageCircle, 
  Scale, 
  Heart, 
  ShoppingBag, 
  Search, 
  BookOpen, 
  ArrowUp,
  SlidersHorizontal,
  Lock
} from 'lucide-react';

export default function App() {
  const [perfumes, setPerfumes] = useState(perfumesData);

  // View state: 'store' vs 'admin'
  const [isAdminView, setIsAdminView] = useState(() => {
    return window.location.hash === '#admin' || window.location.search.includes('admin');
  });

  // Modal and drawer states
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isComparatorOpen, setIsComparatorOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLookbookOpen, setIsLookbookOpen] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Fetch perfumes from Supabase
  const loadPerfumes = async () => {
    try {
      const { data, error } = await supabase
        .from('perfumes')
        .select('*')
        .order('num', { ascending: true });

      if (error) {
        console.warn('Usando catálogo local:', error.message);
        return;
      }
      if (data && data.length > 0) {
        setPerfumes(data.filter(p => p.is_active !== false));
      }
    } catch (err) {
      console.warn('Usando catálogo local:', err);
    }
  };

  useEffect(() => {
    loadPerfumes();

    const handleHash = () => {
      if (window.location.hash === '#admin' || window.location.search.includes('admin')) {
        setIsAdminView(true);
      } else {
        setIsAdminView(false);
      }
    };

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleOpenAdmin = () => {
    setIsAdminView(true);
    window.location.hash = 'admin';
  };

  const handleCloseAdmin = () => {
    setIsAdminView(false);
    window.history.pushState(null, '', window.location.pathname);
  };

  // Cart & Comparison & Favorites
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('joufab_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('joufab_favs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [comparedList, setComparedList] = useState([]);

  // Filters
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('Todas');
  const [selectedMoment, setSelectedMoment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Floating Toast notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('joufab_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('joufab_favs', JSON.stringify(favorites));
  }, [favorites]);

  // Cart Handlers
  const handleAddToCart = (perfume) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === perfume.id);
      if (existing) {
        return prev.map((item) =>
          item.id === perfume.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...perfume, quantity: 1 }];
    });
    showToast(`"${perfume.name}" agregado a tu pedido 🛍️`);
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const handleRemoveFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Favorite Handlers
  const handleToggleFavorite = (perfume) => {
    setFavorites((prev) => {
      if (prev.includes(perfume.id)) {
        showToast(`Eliminado de favoritos`);
        return prev.filter((id) => id !== perfume.id);
      } else {
        showToast(`"${perfume.name}" guardado en favoritos ❤️`);
        return [...prev, perfume.id];
      }
    });
  };

  // Compare Handlers
  const handleToggleCompare = (perfume) => {
    setComparedList((prev) => {
      const exists = prev.some((p) => p.id === perfume.id);
      if (exists) {
        return prev.filter((p) => p.id !== perfume.id);
      }
      if (prev.length >= 3) {
        showToast('Máximo 3 perfumes en el comparador ⚖️');
        return prev;
      }
      showToast(`"${perfume.name}" agregado al comparador`);
      return [...prev, perfume];
    });
  };

  const handleRemoveFromCompare = (id) => {
    setComparedList((prev) => prev.filter((p) => p.id !== id));
  };

  // Filter logic
  const filteredPerfumes = useMemo(() => {
    return perfumes.filter((p) => {
      // Favorites filter
      if (showFavoritesOnly && !favorites.includes(p.id)) {
        return false;
      }

      // Brand filter
      if (selectedBrand !== 'Todas' && p.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }

      // Season filter
      if (selectedSeason !== 'all') {
        const isSeasonMatch = 
          p.best_season === selectedSeason || 
          (p.votes && p.votes[selectedSeason] > 2000);
        if (!isSeasonMatch) return false;
      }

      // Moment filter
      if (selectedMoment !== 'all') {
        if (selectedMoment === 'versatil') {
          if (p.best_moment !== 'versatil') return false;
        } else {
          const isMomentMatch = 
            p.best_moment === selectedMoment || 
            (p.votes && p.votes[selectedMoment] > 3000);
          if (!isMomentMatch) return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all') {
        const cat = p.category.toLowerCase();
        const accords = (p.accords || []).map((a) => a.toLowerCase()).join(' ');
        if (selectedCategory === 'gourmand' && !cat.includes('gourmand') && !accords.includes('gourmand') && !accords.includes('café') && !accords.includes('dulce')) return false;
        if (selectedCategory === 'acuatico' && !cat.includes('acuático') && !accords.includes('acuático') && !accords.includes('marino')) return false;
        if (selectedCategory === 'citrico' && !cat.includes('cítrico') && !accords.includes('cítrico')) return false;
        if (selectedCategory === 'especiado' && !cat.includes('especiado') && !accords.includes('especiado') && !accords.includes('ámbar')) return false;
        if (selectedCategory === 'fougere' && !cat.includes('fougère') && !accords.includes('fougère') && !accords.includes('limpio')) return false;
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const inName = p.name.toLowerCase().includes(q);
        const inBrand = p.brand.toLowerCase().includes(q);
        const inCategory = p.category.toLowerCase().includes(q);
        const inNotes = [
          ...p.notes.salida, 
          ...p.notes.corazon, 
          ...p.notes.base
        ].some((n) => n.toLowerCase().includes(q));
        const inTags = (p.tags || []).some((t) => t.toLowerCase().includes(q));

        if (!inName && !inBrand && !inCategory && !inNotes && !inTags) {
          return false;
        }
      }

      return true;
    });
  }, [
    perfumes, 
    showFavoritesOnly, 
    favorites, 
    selectedBrand, 
    selectedSeason, 
    selectedMoment, 
    selectedCategory, 
    searchQuery
  ]);

  const handleResetFilters = () => {
    setSelectedSeason('all');
    setSelectedCategory('all');
    setSelectedBrand('Todas');
    setSelectedMoment('all');
    setSearchQuery('');
    setShowFavoritesOnly(false);
  };

  if (isAdminView) {
    return (
      <AdminDashboard 
        onBackToStore={handleCloseAdmin} 
        onDataChanged={loadPerfumes} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col justify-between selection:bg-gold-500 selection:text-black">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-obsidian-900/95 border border-gold-500/40 text-white text-xs font-semibold shadow-2xl backdrop-blur-md animate-bounce flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        favoriteCount={favorites.length}
        onOpenFavorites={() => {
          setShowFavoritesOnly(!showFavoritesOnly);
          const el = document.getElementById('catalogo');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenComparator={() => setIsComparatorOpen(true)}
        comparatorCount={comparedList.length}
        onOpenLookbook={() => setIsLookbookOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Section */}
      <Hero
        onExplore={() => {
          const el = document.getElementById('catalogo');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenLookbook={() => setIsLookbookOpen(true)}
        onSelectPerfume={setSelectedPerfume}
        featuredPerfumes={[perfumes[0], perfumes[2], perfumes[5]]}
      />

      {/* Main Catalog Section */}
      <main className="flex-1">
        
        {/* Filter Bar */}
        <FilterBar
          selectedSeason={selectedSeason}
          setSelectedSeason={setSelectedSeason}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedMoment={selectedMoment}
          setSelectedMoment={setSelectedMoment}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          totalResults={filteredPerfumes.length}
          onResetFilters={handleResetFilters}
        />

        {/* Favorites only banner reminder */}
        {showFavoritesOnly && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-between text-xs text-rose-300">
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                Mostrando tus fragancias guardadas en favoritos ({filteredPerfumes.length})
              </span>
              <button 
                onClick={() => setShowFavoritesOnly(false)}
                className="underline hover:text-white"
              >
                Ver todo el catálogo
              </button>
            </div>
          </div>
        )}

        {/* Perfume Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {filteredPerfumes.length === 0 ? (
            <div className="py-20 text-center space-y-4 glass-panel rounded-3xl p-8 border border-white/10">
              <Search className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="font-cinzel text-xl text-white">No se encontraron fragancias</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                No hay perfumes que coincidan exactamente con los filtros seleccionados. Intenta ampliar la búsqueda o restablecer los filtros.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 rounded-full bg-gold-500 text-black font-semibold text-xs tracking-wider uppercase hover:bg-gold-400 transition-all shadow-gold-sm"
              >
                Restablecer Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPerfumes.map((perfume) => (
                <PerfumeCard
                  key={perfume.id}
                  perfume={perfume}
                  onSelect={setSelectedPerfume}
                  onAddToCart={handleAddToCart}
                  isFavorite={favorites.includes(perfume.id)}
                  onToggleFavorite={handleToggleFavorite}
                  isCompared={comparedList.some((p) => p.id === perfume.id)}
                  onToggleCompare={handleToggleCompare}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mid-Page Interactive Banner: Scent Quiz CTA */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="relative rounded-3xl overflow-hidden border border-gold-500/30 bg-gradient-to-r from-obsidian-950 via-obsidian-900 to-obsidian-950 p-8 sm:p-12 shadow-luxury flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute inset-0 bg-[radial-gradient(#d4af3715_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
            
            <div className="relative z-10 space-y-3 text-center md:text-left max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 text-gold-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Asistente Personal de Fragancias
              </div>
              <h3 className="font-cinzel text-2xl sm:text-4xl font-bold text-white leading-tight">
                ¿Aún indeciso sobre cuál elegir?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                Responde 3 preguntas en nuestro test olfativo interactivo y te diremos exactamente cuál es el perfume que mejor combina con tu personalidad, tus planes y tu clima.
              </p>
            </div>

            <div className="relative z-10 flex-shrink-0">
              <button
                onClick={() => setIsQuizOpen(true)}
                className="px-8 py-4 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-black font-bold text-xs tracking-widest uppercase rounded-full shadow-luxury hover:scale-105 transition-all duration-300 active:scale-95"
              >
                Comenzar Test Olfativo
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* Floating Bottom Bar when items are in compare list */}
      {comparedList.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 animate-fadeIn">
          <button
            onClick={() => setIsComparatorOpen(true)}
            className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-gold-500 text-black font-bold text-xs tracking-wider uppercase shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            <Scale className="w-4 h-4" />
            <span>Comparar ({comparedList.length})</span>
          </button>
        </div>
      )}

      {/* Floating WhatsApp Action Button */}
      <a
        href="https://wa.me/?text=Hola%20Joufab%2C%20quisiera%20consultar%20sobre%20el%20cat%C3%A1logo%20de%20perfumes"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 left-6 z-40 p-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all group flex items-center gap-2"
        title="Chat de WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold font-sans">
          WhatsApp Directo
        </span>
      </a>

      {/* Footer */}
      <Footer 
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenLookbook={() => setIsLookbookOpen(true)}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Modals & Drawers */}
      <PerfumeModal
        perfume={selectedPerfume}
        onClose={() => setSelectedPerfume(null)}
        onAddToCart={handleAddToCart}
        isFavorite={selectedPerfume ? favorites.includes(selectedPerfume.id) : false}
        onToggleFavorite={handleToggleFavorite}
        isCompared={selectedPerfume ? comparedList.some((p) => p.id === selectedPerfume.id) : false}
        onToggleCompare={handleToggleCompare}
      />

      {isQuizOpen && (
        <ScentQuizModal
          perfumes={perfumes}
          onClose={() => setIsQuizOpen(false)}
          onSelectPerfume={setSelectedPerfume}
          onAddToCart={handleAddToCart}
        />
      )}

      {isComparatorOpen && (
        <ComparatorModal
          comparedList={comparedList}
          onClose={() => setIsComparatorOpen(false)}
          onRemoveFromCompare={handleRemoveFromCompare}
          onAddToCart={handleAddToCart}
          onSelectPerfume={setSelectedPerfume}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      <CatalogViewerModal
        isOpen={isLookbookOpen}
        onClose={() => setIsLookbookOpen(false)}
      />

    </div>
  );
}
