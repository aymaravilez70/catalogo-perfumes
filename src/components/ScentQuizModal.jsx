import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  ShoppingBag, 
  Eye, 
  Flame,
  Heart,
  Briefcase,
  Crown,
  Waves,
  Coffee,
  Wind,
  Zap,
  CloudSnow,
  Sun,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ScentQuizModal({ perfumes, onClose, onSelectPerfume, onAddToCart }) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    occasion: '',
    vibe: '',
    climate: ''
  });
  const [results, setResults] = useState(null);

  const questions = [
    {
      id: 'occasion',
      title: '1. ¿Para qué ocasión principal deseas tu perfume?',
      subtitle: 'Elige el escenario donde quieres destacar con tu estela',
      options: [
        { id: 'citas', label: 'Citas románticas & Seducción', desc: 'Atractivo, cautivador, dulce o especiado', icon: Heart },
        { id: 'oficina', label: 'Uso diario & Oficina', desc: 'Limpio, profesional, elegante y no invasivo', icon: Briefcase },
        { id: 'fiesta', label: 'Fiestas & Noches de gala', desc: 'Potente, imponente, con gran proyección', icon: Crown },
        { id: 'casual', label: 'Casual, Verano & Aire libre', desc: 'Fresco, energizante, gélido y marino', icon: Waves }
      ]
    },
    {
      id: 'vibe',
      title: '2. ¿Qué familia o sensación aromática prefieres?',
      subtitle: 'El tipo de notas que más disfrutas oler',
      options: [
        { id: 'gourmand', label: 'Gourmand Dulce (Café, Canela, Caramelo)', desc: 'Cálido, apetitoso y reconfortante', icon: Coffee },
        { id: 'acuatico', label: 'Fresco Acuático & Menta Gélida', desc: 'Sensación de brisa de mar y frutas heladas', icon: Wind },
        { id: 'citrico', label: 'Cítrico & Té Verde Chispeante', desc: 'Vibrante, moderno, limpio y distinguido', icon: Zap },
        { id: 'especiado', label: 'Especiado Oscuro (Tabaco, Maderas, Café)', desc: 'Masculinidad imponente y madura', icon: Flame },
        { id: 'frutal', label: 'Frutas Jugosas (Sandía, Piña caramelizada)', desc: 'Explosivo, juvenil, alegre y adictivo', icon: Sparkles }
      ]
    },
    {
      id: 'climate',
      title: '3. ¿Bajo qué clima o momento lo usarás más?',
      subtitle: 'La temperatura influye enormemente en la evolución de las notas',
      options: [
        { id: 'frio', label: 'Clima frío, templado o noches frescas', desc: 'Donde los aromas densos y cálidos brillan', icon: CloudSnow },
        { id: 'calor', label: 'Días calurosos de verano y sol', desc: 'Aromas que refrescan y no sofocan', icon: Sun },
        { id: 'versatil', label: 'Versátil para todo el año (Día y Noche)', desc: 'Tu fragancia comodín para cualquier momento', icon: Compass }
      ]
    }
  ];

  const handleSelectOption = (questionId, optionId) => {
    const updated = { ...answers, [questionId]: optionId };
    setAnswers(updated);

    if (step < 3) {
      setStep(step + 1);
    } else {
      calculateResults(updated);
    }
  };

  const calculateResults = (finalAnswers) => {
    // Scoring system
    const scored = perfumes.map((p) => {
      let score = 50; // base score

      // Occasion matching
      if (finalAnswers.occasion === 'citas') {
        if (['khamrah-qahwa', 'khamrah', 'honor-and-glory', '9-pm', 'eclaire'].includes(p.id)) score += 30;
        if (p.votes.noche > 5000) score += 15;
      } else if (finalAnswers.occasion === 'oficina') {
        if (['fakhar-black', 'club-de-nuit-milestone', '9-am-dive', 'odyssey-homme', 'yara-pink'].includes(p.id)) score += 30;
        if (p.votes.dia > 4000) score += 15;
      } else if (finalAnswers.occasion === 'fiesta') {
        if (['9-pm', 'asad', 'khamrah', 'nitro-red', 'honor-and-glory'].includes(p.id)) score += 30;
      } else if (finalAnswers.occasion === 'casual') {
        if (['hawas-ice', '9-am-dive', 'club-de-nuit-milestone', 'nitro-red'].includes(p.id)) score += 30;
      }

      // Vibe matching
      if (finalAnswers.vibe === 'gourmand' && ['khamrah-qahwa', 'khamrah', 'honor-and-glory', 'eclaire'].includes(p.id)) score += 35;
      if (finalAnswers.vibe === 'acuatico' && ['hawas-ice', 'club-de-nuit-milestone', '9-am-dive', 'odyssey-homme'].includes(p.id)) score += 35;
      if (finalAnswers.vibe === 'citrico' && ['hawas-kobra', 'odyssey-mandarin-sky', 'fakhar-black', '9-am-dive'].includes(p.id)) score += 35;
      if (finalAnswers.vibe === 'especiado' && ['asad', 'hawas-kobra', 'khamrah-qahwa'].includes(p.id)) score += 35;
      if (finalAnswers.vibe === 'frutal' && ['nitro-red', 'honor-and-glory', 'hawas-ice', 'yara-pink'].includes(p.id)) score += 35;

      // Climate matching
      if (finalAnswers.climate === 'frio') {
        if (p.votes.invierno > 8000) score += 25;
      } else if (finalAnswers.climate === 'calor') {
        if (p.votes.verano > 4000) score += 25;
      } else if (finalAnswers.climate === 'versatil') {
        if (['fakhar-black', 'hawas-kobra', 'odyssey-mandarin-sky', 'nitro-red'].includes(p.id)) score += 25;
      }

      return {
        ...p,
        matchPercentage: Math.min(99, Math.round((score / 140) * 100))
      };
    });

    scored.sort((a, b) => b.matchPercentage - a.matchPercentage);
    const top3 = scored.slice(0, 3);
    setResults(top3);
    setStep(4);

    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const handleReset = () => {
    setStep(1);
    setAnswers({ occasion: '', vibe: '', climate: '' });
    setResults(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-obsidian-900 border border-gold-500/40 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-obsidian-950/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-400" />
            <h2 className="font-cinzel text-lg font-bold text-white tracking-wide">
              Test Olfativo • Encuentra tu Fragancia
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        {step <= 3 && (
          <div className="w-full bg-obsidian-950 h-1">
            <div 
              className="bg-gold-500 h-full transition-all duration-500" 
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        )}

        {/* Body */}
        <div className="p-6 sm:p-8">
          
          {step <= 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
                  Paso {step} de 3
                </span>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                  {questions[step - 1].title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  {questions[step - 1].subtitle}
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-3">
                {questions[step - 1].options.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(questions[step - 1].id, opt.id)}
                      className="p-4 rounded-2xl bg-obsidian-850 hover:bg-obsidian-750 border border-white/10 hover:border-gold-500/50 flex items-center gap-4 text-left transition-all duration-200 group hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 group-hover:scale-110 group-hover:bg-gold-500/20 transition-all flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                    <div className="flex-1">
                      <span className="font-semibold text-sm text-white group-hover:text-gold-300 transition-colors block">
                        {opt.label}
                      </span>
                      <span className="text-xs text-slate-400">
                        {opt.desc}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
                  </button>
                );
              })}
            </div>
            </div>
          )}

          {/* Results Step */}
          {step === 4 && results && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ¡Coincidencias Encontradas!
                </div>
                <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
                  Tus Fragancias Ideales
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Basado en tu estilo y preferencias, estos son tus 3 perfumes con mayor afinidad:
                </p>
              </div>

              {/* Top 3 Cards */}
              <div className="space-y-3">
                {results.map((item, idx) => (
                  <div 
                    key={item.id}
                    className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                      idx === 0 
                        ? 'bg-gradient-to-r from-gold-950/40 via-obsidian-850 to-obsidian-900 border-gold-500/60 shadow-lg' 
                        : 'bg-obsidian-850 border-white/10'
                    }`}
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-20 object-cover rounded-xl border border-white/10"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider">
                          #{item.num} • {item.brand}
                        </span>
                        {idx === 0 && (
                          <span className="px-2 py-0.2 rounded-full bg-gold-500 text-black text-[9px] font-bold">
                            TOP 1 RECOMENDADO
                          </span>
                        )}
                      </div>

                      <h4 className="font-cinzel text-base font-bold text-white truncate">
                        {item.name}
                      </h4>

                      <p className="text-[11px] text-slate-300 truncate">
                        {item.notes.salida.join(', ')}
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-gold-400">
                          {item.matchPercentage}% de afinidad
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => {
                          onClose();
                          onSelectPerfume(item);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver</span>
                      </button>

                      <button
                        onClick={() => onAddToCart(item)}
                        className="px-3 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Pedir</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Reset action */}
              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reiniciar Test Olfativo</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
