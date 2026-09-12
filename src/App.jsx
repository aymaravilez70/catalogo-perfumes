import React, { useState, useEffect } from 'react';
import perfumesData from './data/perfumesData.json';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedIcons from './components/FeaturedIcons';
import NicheInspirationSection from './components/NicheInspirationSection';
import HomeStoryBanner from './components/HomeStoryBanner';
import CatalogView from './components/CatalogView';
import PerfumeModal from './components/PerfumeModal';
import ScentQuizModal from './components/ScentQuizModal';
import ComparatorModal from './components/ComparatorModal';
import CartDrawer from './components/CartDrawer';
import CatalogViewerModal from './components/CatalogViewerModal';
import StoryModal from './components/StoryModal';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import { 
  Sparkles, 
  MessageCircle, 
  Scale
} from 'lucide-react';

export default function App() {
  const [perfumes, setPerfumes] = useState(perfumesData);

  // View state: 'home' vs 'catalog'
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('catalog') || hash.includes('catalogo') || hash.includes('coleccion')) {
      return 'catalog';
    }
    return 'home';
  });

  // Admin view state
  const [isAdminView, setIsAdminView] = useState(() => {
    return window.location.hash === '#admin' || window.location.search.includes('admin');
  });

  // Modal and drawer states
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isComparatorOpen, setIsComparatorOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLookbookOpen, setIsLookbookOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  // Global search input state shared between navbar and views
  const [searchQuery, setSearchQuery] = useState('');

  // Floating Toast notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // Cart & Comparison & Favorites persistence
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

  // Fetch perfumes from Supabase or fallback to local
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
        const normalized = data.map(p => {
          const pVotes = p.votes || {};
          return {
            ...p,
            num: p.num || '01',
            inspired_by: p.inspired_by || pVotes.inspired_by || '',
            niche_house: p.niche_house || pVotes.niche_house || '',
            longevity: p.longevity || pVotes.longevity || '8 - 10 horas',
            sillage: p.sillage || pVotes.sillage || 'Alta / Pesada',
            votes: {
              invierno: Number(pVotes.invierno) || 5000,
              primavera: Number(pVotes.primavera) || 2000,
              verano: Number(pVotes.verano) || 1000,
              otoño: Number(pVotes.otoño) || 4000,
              dia: Number(pVotes.dia) || 3000,
              noche: Number(pVotes.noche) || 7000,
              ...pVotes
            }
          };
        });
        setPerfumes(normalized.filter(p => p.is_active !== false));
      }
    } catch (err) {
      console.warn('Usando catálogo local:', err);
    }
  };

  // Sync Hash on mount and hashchange
  useEffect(() => {
    loadPerfumes();

    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || window.location.search.includes('admin')) {
        setIsAdminView(true);
      } else {
        setIsAdminView(false);
        if (hash.includes('catalog') || hash.includes('catalogo') || hash.includes('coleccion')) {
          setCurrentView('catalog');
        } else if (hash === '#home' || hash === '' || hash === '#') {
          setCurrentView('home');
        }
      }
    };

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Navigation dispatcher
  const navigateTo = (view, options = {}) => {
    setCurrentView(view);
    if (view === 'home') {
      window.location.hash = 'home';
    } else if (view === 'catalog') {
      window.location.hash = 'catalogo';
    }
    if (options.search !== undefined) {
      setSearchQuery(options.search);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    setIsAdminView(true);
    window.location.hash = 'admin';
  };

  const handleCloseAdmin = () => {
    setIsAdminView(false);
    window.history.pushState(null, '', window.location.pathname);
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
    showToast(`"${perfume.name}" agregado a tu pedido`);
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
        showToast(`"${perfume.name}" guardado en favoritos`);
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
        showToast('Máximo 3 perfumes en el comparador');
        return prev;
      }
      showToast(`"${perfume.name}" agregado al comparador`);
      return [...prev, perfume];
    });
  };

  const handleRemoveFromCompare = (id) => {
    setComparedList((prev) => prev.filter((p) => p.id !== id));
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
      
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-obsidian-900/95 border border-gold-500/40 text-white text-xs font-semibold shadow-2xl backdrop-blur-md animate-bounce flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar with View Switcher */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        favoriteCount={favorites.length}
        onOpenFavorites={() => {
          if (currentView !== 'catalog') {
            navigateTo('catalog');
          }
        }}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenComparator={() => setIsComparatorOpen(true)}
        comparatorCount={comparedList.length}
        onOpenLookbook={() => setIsLookbookOpen(true)}
        onOpenStory={() => setIsStoryOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Dynamic View Rendering */}
      {currentView === 'home' ? (
        <main className="flex-1">
          
          {/* Hero Section */}
          <Hero
            onExplore={() => navigateTo('catalog')}
            onOpenQuiz={() => setIsQuizOpen(true)}
            onOpenLookbook={() => setIsLookbookOpen(true)}
            onOpenStory={() => setIsStoryOpen(true)}
            onSelectPerfume={setSelectedPerfume}
            featuredPerfumes={[perfumes[0], perfumes[2], perfumes[5]]}
          />

          {/* Curated 4 Flagship Icons Showcase */}
          <FeaturedIcons
            perfumes={perfumes}
            onSelectPerfume={setSelectedPerfume}
            onAddToCart={handleAddToCart}
            onNavigateToCatalog={() => navigateTo('catalog')}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            comparedList={comparedList}
            onToggleCompare={handleToggleCompare}
          />

          {/* Arab Niche Inspirations Editorial Section */}
          <NicheInspirationSection
            onNavigateToCatalogWithFilter={(query) => navigateTo('catalog', { search: query })}
          />

          {/* Founder Letter & Faby Dedication Magazine Banner */}
          <HomeStoryBanner
            onOpenStory={() => setIsStoryOpen(true)}
            onOpenLookbook={() => setIsLookbookOpen(true)}
          />

          {/* Mid-Page Interactive Scent Quiz Callout */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
      ) : (
        <main className="flex-1">
          {/* Dedicated Full Boutique Catalog View */}
          <CatalogView
            perfumes={perfumes}
            onSelectPerfume={setSelectedPerfume}
            onAddToCart={handleAddToCart}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            comparedList={comparedList}
            onToggleCompare={handleToggleCompare}
            onOpenQuiz={() => setIsQuizOpen(true)}
            onNavigateHome={() => navigateTo('home')}
            initialSearchQuery={searchQuery}
          />
        </main>
      )}

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
        href="https://wa.me/593984526114?text=Hola%20Joufab%2C%20quisiera%20consultar%20sobre%20el%20cat%C3%A1logo%20de%20perfumes"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 left-6 z-40 h-14 w-14 group-hover:w-auto rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_8px_30px_rgba(16,185,129,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 group flex items-center justify-center group-hover:px-4.5 overflow-hidden"
        title="Chat de WhatsApp Directo"
      >
        <MessageCircle className="w-6 h-6 fill-white shrink-0" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2.5 transition-all duration-300 text-xs font-bold font-sans">
          WhatsApp Directo
        </span>
      </a>

      {/* Footer */}
      <Footer 
        onNavigate={navigateTo}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenLookbook={() => setIsLookbookOpen(true)}
        onOpenStory={() => setIsStoryOpen(true)}
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

      <StoryModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
        onOpenLookbook={() => setIsLookbookOpen(true)}
      />

    </div>
  );
}
