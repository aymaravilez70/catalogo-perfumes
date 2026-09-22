import React from 'react';
import { RefreshCw, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('JOUFAB Error caught by ErrorBoundary:', error, errorInfo);
    try {
      window.__LAST_REACT_ERROR__ = {
        message: error?.message,
        stack: error?.stack,
        componentStack: errorInfo?.componentStack
      };
    } catch {}
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetAndReload = () => {
    try {
      localStorage.removeItem('joufab_cart');
      localStorage.removeItem('joufab_favs');
      sessionStorage.clear();
    } catch {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-obsidian-900/90 border border-gold-500/30 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6 animate-fadeIn">
            
            {/* Brand Logo */}
            <div className="flex flex-col items-center gap-2">
              <img 
                src="/assets/brand/logo.png" 
                alt="Joufab Logo" 
                className="h-16 w-auto object-contain drop-shadow-[0_2px_16px_rgba(212,175,55,0.4)]"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span className="font-cinzel text-xl tracking-[0.28em] text-white font-bold">
                JOUFAB
              </span>
              <span className="text-[10px] uppercase tracking-[0.38em] text-gold-400 font-sans">
                Perfume House
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="font-cinzel text-lg font-bold text-white uppercase tracking-wider">
                Restableciendo Experiencia
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hemos actualizado la boutique con mejoras de diseño. Pulsa el botón para recargar la colección.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-black font-semibold text-xs tracking-wider uppercase rounded-full shadow-luxury hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recargar Boutique</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetAndReload}
                className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-medium text-[11px] tracking-wider uppercase rounded-full transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-gold-400" />
                <span>Limpiar Caché y Reiniciar</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
