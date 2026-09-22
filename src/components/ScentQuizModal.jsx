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
  Compass,
  Gift,
  Scale,
  MessageCircle,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Pre-crafted sensory justifications for each fragrance
const PERFUME_JUSTIFICATIONS = {
  'khamrah': 'Recomendado por su legendario perfil cálido de canela, dátiles dulces y praliné con estela potente, perfecto para citas nocturnas y clima frío.',
  'khamrah-qahwa': 'Recomendado por su toque de café tostado, cardamomo y praliné gourmand; una opción más compleja, acogedora y envolvente para destacar de noche.',
  'fakhar-black': 'El comodín profesional definitivo: notas de manzana crujiente, lavanda y bergamota que proyectan una limpieza pulcra y elegancia moderna para oficina y diario.',
  'asad': 'Recomendado por su estela imponente de pimienta negra, café, tabaco y ámbar oscuro; una firma olfativa madura, masculina y de alta presencia.',
  'honor-and-glory': 'Elegido por su exótica salida de piña brulee caramelizada y canela sobre una base cremosa de vainilla y benjuí; dulce, vibrante y muy cumplidor.',
  '9-pm': 'Una máquina insuperable de cumplidos nocturnos: vainilla dulce especiada con manzana, canela y lavanda que llena habitaciones y dura más de 10 horas.',
  '9-am-dive': 'Frescura versátil y moderna: manzana verde crujiente con menta gélida y cedro; ultra revitalizante para oficina, sol y actividades cotidianas.',
  'hawas-ice': 'Recomendado por su descarga gélida de bergamota, manzana helada y acordes acuáticos con fijación extrema para calor, salidas y uso diurno.',
  'hawas-kobra': 'Una propuesta audaz y seductora: cítricos chispeantes con corazón floral amaderado y un fondo ahumado especiado con personalidad única.',
  'odyssey-mandarin-sky': 'Adictiva fusión de mandarina jugosa, naranja dulce y caramelo con haba tonka; alegre, cálido y seductor tanto de día como de noche.',
  'odyssey-homme': 'Elegancia nocturna aterciopelada: iris empolvado con vainilla, ámbar y especias cálidas que evoca distinción sobria y sensualidad clásica.',
  'club-de-nuit-milestone': 'Aroma marino salino de lujo con frutos rojos y bergamota; evoca una brisa marina sofisticada en la costa mediterránea.',
  'yara-pink': 'El favorito femenino por excelencia: notas cremosas de orquídea, heliotropo, frutas tropicales y vainilla suave; un obsequio tierno, dulce e inolvidable.',
  'eclaire': 'Una delicia gourmand adictiva de leche tibia, caramelo fundido y vainilla dulce con miel; suave, reconfortante y de encanto irresistible.',
  'nitro-red': 'Una bomba frutal acuática de sandía cristalizada, lavanda y maderas; explosivo, juvenil y con proyección masiva para llamar la atención.'
};

export default function ScentQuizModal({ 
  perfumes = [], 
  onClose, 
  onSelectPerfume, 
  onAddToCart,
  onToggleCompare,
  comparedList = []
}) {
  // Active mode: 'advisor' (6 steps), 'gift' (3 gift steps), 'quick' (3 steps)
  const [activeMode, setActiveMode] = useState('advisor');
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  // Configuration for MODE 1: Quick Scent Test (3 Steps)
  const quickQuestions = [
    {
      id: 'occasion',
      title: '1. ¿Para qué ocasión principal buscas tu perfume?',
      subtitle: 'Elige el escenario donde quieres que tu estela sea el centro de atención',
      options: [
        { id: 'citas', label: 'Citas románticas & Seducción', desc: 'Aroma íntimo, cautivador, dulce o especiado', icon: Heart },
        { id: 'oficina', label: 'Uso diario & Oficina formal', desc: 'Limpio, pulcro, elegante y no invasivo', icon: Briefcase },
        { id: 'fiesta', label: 'Fiestas & Noches de gala', desc: 'Potente, imponente y con gran proyección', icon: Crown },
        { id: 'casual', label: 'Casual, Verano & Aire libre', desc: 'Fresco, energizante, acuático y versátil', icon: Waves }
      ]
    },
    {
      id: 'vibe',
      title: '2. ¿Qué familia o sensación aromática prefieres?',
      subtitle: 'El tipo de acordes olfativos que más disfrutas percibir',
      options: [
        { id: 'gourmand', label: 'Gourmand Dulce (Café, Canela, Vainilla)', desc: 'Cálido, apetitoso, envolvente y adictivo', icon: Coffee },
        { id: 'acuatico', label: 'Fresco Acuático & Menta Gélida', desc: 'Sensación marina refrescante y frutas heladas', icon: Wind },
        { id: 'citrico', label: 'Cítrico Chispeante & Maderas Limpias', desc: 'Vibrante, moderno y distinguido', icon: Zap },
        { id: 'especiado', label: 'Especiado Oscuro (Tabaco, Ámbar, Pimienta)', desc: 'Masculinidad con carácter imponente y maduro', icon: Flame },
        { id: 'frutal', label: 'Frutas Jugosas (Sandía, Piña caramelizada)', desc: 'Explosivo, juvenil, alegre y magnético', icon: Sparkles }
      ]
    },
    {
      id: 'climate',
      title: '3. ¿Bajo qué clima o momento lo usarás más?',
      subtitle: 'La temperatura ambiente influye en la proyección del perfume',
      options: [
        { id: 'frio', label: 'Clima frío, templado o noches frescas', desc: 'Donde los aromas densos y cálidos lucen al máximo', icon: CloudSnow },
        { id: 'calor', label: 'Días soleados, clima cálido o costa', desc: 'Aromas ligeros que refrescan sin saturar', icon: Sun },
        { id: 'versatil', label: 'Versátil para todo el año (Día y Noche)', desc: 'Tu comodín infalible para cualquier ocasión', icon: Compass }
      ]
    }
  ];

  // Configuration for MODE 2: Encuentra tu Perfume (6 Steps - PDF p. 8)
  const advisorQuestions = [
    {
      id: 'target',
      title: '1. ¿Para quién buscas este perfume?',
      subtitle: 'Personalizaremos el perfil de fragancia según el usuario',
      options: [
        { id: 'personal', label: 'Para mi uso personal', desc: 'Quiero encontrar mi fragancia firma que me represente', icon: Sparkles },
        { id: 'pareja', label: 'Para seducir / Citas con mi pareja', desc: 'Aromas cautivadores que generen cercanía y cumplidos', icon: Heart },
        { id: 'versatil_yo', label: 'Para renovar mi colección diaria', desc: 'Una opción de alta duración para destacar en todo momento', icon: Crown }
      ]
    },
    {
      id: 'scent',
      title: '2. ¿Qué acordes aromáticos te hacen sentir mejor?',
      subtitle: 'Selecciona la vibra principal que más disfrutas oler',
      options: [
        { id: 'gourmand_sweet', label: 'Dulzura Gourmand (Vainilla, Canela, Praliné, Café)', desc: 'Reconfortante, apetitoso, cálido y envolvente', icon: Coffee },
        { id: 'fresh_aquatic', label: 'Brisa Marina, Menta Gélida & Frutas Heladas', desc: 'Sensación ultra limpia, energizante y fresca', icon: Waves },
        { id: 'spicy_woods', label: 'Maderas Orientales, Ámbar & Especias Cálidas', desc: 'Sofisticación pura, presencia y masculinidad clásica', icon: Flame },
        { id: 'citrus_bright', label: 'Cítricos Nobles (Bergamota, Mandarina, Té verde)', desc: 'Luminoso, pulcro, elegante y rejuvenecedor', icon: Zap },
        { id: 'fruity_exotic', label: 'Frutas Exóticas (Piña caramelizada, Sandía dulce)', desc: 'Festivo, moderno, alegre y con magnetismo instantáneo', icon: Sparkles }
      ]
    },
    {
      id: 'moment',
      title: '3. ¿En qué escenario lo lucirás principalmente?',
      subtitle: 'La ocasión define la proyección y densidad requerida',
      options: [
        { id: 'romance', label: 'Citas Románticas & Conquista', desc: 'Proyección moderada a íntima, muy seductora', icon: Heart },
        { id: 'work', label: 'Oficina, Negocios & Uso Diario', desc: 'Elegancia profesional que transmite confianza y orden', icon: Briefcase },
        { id: 'party', label: 'Fiestas, Celebraciones & Noches de Club', desc: 'Estela arrolladora que se hace notar a distancia', icon: Crown },
        { id: 'casual_all', label: 'Salidas casuales & Fines de semana', desc: 'Cómodo, versátil y de fácil disfrute para cualquier plan', icon: Compass }
      ]
    },
    {
      id: 'climate_zone',
      title: '4. ¿Qué clima o temperatura predomina en tu ciudad?',
      subtitle: 'El clima de Ecuador y la región influye en la fijación del perfume',
      options: [
        { id: 'cold_sierra', label: 'Clima Frío / Sierra / Noches Heladas (Quito, Cuenca)', desc: 'Fragancias dulces y ambaradas que abrazan en el frío', icon: CloudSnow },
        { id: 'warm_costa', label: 'Clima Cálido / Costa / Sol Radiante (Guayaquil, Manta)', desc: 'Fragancias acuáticas y cítricas que resisten la humedad', icon: Sun },
        { id: 'moderate', label: 'Clima Templado o muy variable todo el año', desc: 'Fragancias de equilibrio térmico para toda temporada', icon: Compass }
      ]
    },
    {
      id: 'impression',
      title: '5. ¿Qué sensación quieres proyectar al pasar?',
      subtitle: 'La firma y estela que dejarás en la memoria de los demás',
      options: [
        { id: 'status', label: 'Elegancia Suprema & Estatus de Lujo', desc: 'Impecable, refinado, transmite distinción y éxito', icon: Crown },
        { id: 'sexy', label: 'Sensualidad Magnética & Atracción Pura', desc: 'Imposible de ignorar, desata cumplidos y curiosidad', icon: Flame },
        { id: 'clean', label: 'Pulcritud Absoluta & Energía Vital', desc: 'Sensación de recién duchado, impecable y agradable', icon: Wind },
        { id: 'bold', label: 'Carácter Único & Presencia Dominante', desc: 'Para quien pisa fuerte y no teme sobresalir', icon: Zap }
      ]
    },
    {
      id: 'budget',
      title: '6. ¿Cuál es tu rango de presupuesto preferido?',
      subtitle: 'Todos nuestros perfumes son originales en presentación completa',
      options: [
        { id: 'under_50', label: 'Gama Accesible (Hasta $45 - $48)', desc: 'Opciones de gran rendimiento con inversión moderada', icon: Sparkles },
        { id: 'mid_range', label: 'Gama Central ($50 - $55)', desc: 'Los superventas mundiales de Lattafa, Afnan y Armaf', icon: Crown },
        { id: 'top_range', label: 'Alta Gama Árabe ($58 - $62 o sin límite)', desc: 'Joyas nicho como Hawas Ice o Hawas Kobra', icon: Heart }
      ]
    }
  ];

  // Configuration for MODE 3: Especial Regalos (3 Steps - PDF p. 9)
  const giftQuestions = [
    {
      id: 'recipient',
      title: '1. ¿Para quién es este obsequio?',
      subtitle: 'Filtraremos según el perfil y género de la fragancia',
      options: [
        { id: 'gift_man', label: 'Para Él (Hombre)', desc: 'Perfumes masculinos, elegantes y de carácter', icon: Crown },
        { id: 'gift_woman', label: 'Para Ella (Mujer)', desc: 'Fragancias dulces, florales o gourmand adictivas', icon: Heart },
        { id: 'gift_unisex', label: 'Unisex / Para Compartir', desc: 'Aromas equilibrados de alta perfumería para ambos', icon: Sparkles }
      ]
    },
    {
      id: 'relation',
      title: '2. ¿Qué relación tienes con esa persona?',
      subtitle: 'La cercanía nos ayuda a recomendar la intensidad adecuada',
      options: [
        { id: 'partner', label: 'Mi Pareja (Novio/a, Esposo/a)', desc: 'Un regalo íntimo, romántico y muy seductor', icon: Heart },
        { id: 'family', label: 'Familiar (Papá, Mamá, Hermano/a)', desc: 'Un obsequio elegante, duradero y de prestigio', icon: Crown },
        { id: 'friend', label: 'Un(a) Buen(a) Amigo(a)', desc: 'Aroma agradable, juvenil y versátil para acertar seguro', icon: Compass },
        { id: 'colleague', label: 'Colega o Compromiso de Trabajo', desc: 'Sofisticado, correcto, profesional y de buen gusto', icon: Briefcase }
      ]
    },
    {
      id: 'personality',
      title: '3. ¿Cómo describirías su personalidad o estilo?',
      subtitle: 'La clave para que el aroma combine a la perfección con su esencia',
      options: [
        { id: 'p_elegant', label: 'Elegante, Clásico/a & Distinguido/a', desc: 'Valora la sobriedad, el buen vestir y la calidad', icon: Crown },
        { id: 'p_sweet', label: 'Dulce, Cariñoso/a & Apasionado/a', desc: 'Le encantan los aromas apetitosos, cálidos y acogedores', icon: Coffee },
        { id: 'p_active', label: 'Activo/a, Fresco/a & Espontáneo/a', desc: 'Práctico/a, lleno/a de energía, prefiere aromas limpios', icon: Waves },
        { id: 'p_bold', label: 'Seductor/a, Moderno/a & Seguro/a de sí', desc: 'Le gusta la noche, llamar la atención y ser el alma del lugar', icon: Flame }
      ]
    }
  ];

  // Active question set based on activeMode
  const getQuestions = () => {
    if (activeMode === 'quick') return quickQuestions;
    if (activeMode === 'gift') return giftQuestions;
    return advisorQuestions;
  };

  const currentQuestions = getQuestions();
  const totalSteps = currentQuestions.length;

  const handleSelectOption = (questionId, optionId) => {
    const updated = { ...answers, [questionId]: optionId };
    setAnswers(updated);

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      calculateResults(updated);
    }
  };

  const calculateResults = (finalAnswers) => {
    const scored = perfumes.map((p) => {
      let score = 50; // base score
      let matchTag = 'Acierto Garantizado';

      // --- SCORING: MODE QUICK ---
      if (activeMode === 'quick') {
        if (finalAnswers.occasion === 'citas') {
          if (['khamrah-qahwa', 'khamrah', 'honor-and-glory', '9-pm', 'eclaire'].includes(p.id)) score += 35;
          if (p.votes && p.votes.noche > 5000) score += 15;
          matchTag = 'Ideal para Citas & Romance';
        } else if (finalAnswers.occasion === 'oficina') {
          if (['fakhar-black', 'club-de-nuit-milestone', '9-am-dive', 'odyssey-homme', 'yara-pink'].includes(p.id)) score += 35;
          if (p.votes && p.votes.dia > 4000) score += 15;
          matchTag = 'Elegancia para Oficina & Diario';
        } else if (finalAnswers.occasion === 'fiesta') {
          if (['9-pm', 'asad', 'khamrah', 'nitro-red', 'honor-and-glory'].includes(p.id)) score += 35;
          matchTag = 'Estela Potente para Fiestas';
        } else if (finalAnswers.occasion === 'casual') {
          if (['hawas-ice', '9-am-dive', 'club-de-nuit-milestone', 'nitro-red'].includes(p.id)) score += 35;
          matchTag = 'Fresco & Todoterreno';
        }

        if (finalAnswers.vibe === 'gourmand' && ['khamrah-qahwa', 'khamrah', 'honor-and-glory', 'eclaire'].includes(p.id)) score += 35;
        if (finalAnswers.vibe === 'acuatico' && ['hawas-ice', 'club-de-nuit-milestone', '9-am-dive', 'nitro-red'].includes(p.id)) score += 35;
        if (finalAnswers.vibe === 'citrico' && ['hawas-kobra', 'odyssey-mandarin-sky', 'fakhar-black', '9-am-dive'].includes(p.id)) score += 35;
        if (finalAnswers.vibe === 'especiado' && ['asad', 'hawas-kobra', 'khamrah-qahwa', 'odyssey-homme'].includes(p.id)) score += 35;
        if (finalAnswers.vibe === 'frutal' && ['nitro-red', 'honor-and-glory', 'hawas-ice', 'yara-pink'].includes(p.id)) score += 35;

        if (finalAnswers.climate === 'frio' && p.votes && p.votes.invierno > 6000) score += 20;
        if (finalAnswers.climate === 'calor' && p.votes && p.votes.verano > 2000) score += 20;
        if (finalAnswers.climate === 'versatil' && ['fakhar-black', '9-am-dive', 'odyssey-mandarin-sky', 'nitro-red'].includes(p.id)) score += 20;
      }

      // --- SCORING: MODE ENCUENTRA TU PERFUME (ADVISOR) ---
      else if (activeMode === 'advisor') {
        // Target / Scent Accord
        if (finalAnswers.scent === 'gourmand_sweet') {
          if (['khamrah-qahwa', 'khamrah', 'eclaire', 'honor-and-glory'].includes(p.id)) score += 35;
          if (p.accords && p.accords.some(a => a.toLowerCase().includes('dulce') || a.toLowerCase().includes('canela'))) score += 15;
          matchTag = 'Gourmand Cálido de Máximo Cumplido';
        } else if (finalAnswers.scent === 'fresh_aquatic') {
          if (['hawas-ice', '9-am-dive', 'club-de-nuit-milestone', 'nitro-red'].includes(p.id)) score += 35;
          if (p.accords && p.accords.some(a => a.toLowerCase().includes('acuático') || a.toLowerCase().includes('fresco'))) score += 15;
          matchTag = 'Frescura Revitalizante & Estela Limpia';
        } else if (finalAnswers.scent === 'spicy_woods') {
          if (['asad', 'khamrah-qahwa', 'hawas-kobra', 'odyssey-homme'].includes(p.id)) score += 35;
          if (p.accords && p.accords.some(a => a.toLowerCase().includes('especiado') || a.toLowerCase().includes('amaderado'))) score += 15;
          matchTag = 'Madurez & Especias Imponentes';
        } else if (finalAnswers.scent === 'citrus_bright') {
          if (['fakhar-black', 'odyssey-mandarin-sky', 'hawas-kobra', '9-am-dive'].includes(p.id)) score += 35;
          matchTag = 'Cítricos Nobles & Porte Ejecutivo';
        } else if (finalAnswers.scent === 'fruity_exotic') {
          if (['honor-and-glory', 'nitro-red', 'yara-pink', 'hawas-ice'].includes(p.id)) score += 35;
          matchTag = 'Frutas Adictivas & Juventud';
        }

        // Moment
        if (finalAnswers.moment === 'romance') {
          if (['khamrah-qahwa', 'khamrah', '9-pm', 'eclaire', 'odyssey-homme'].includes(p.id)) score += 25;
        } else if (finalAnswers.moment === 'work') {
          if (['fakhar-black', '9-am-dive', 'club-de-nuit-milestone', 'odyssey-homme'].includes(p.id)) score += 25;
        } else if (finalAnswers.moment === 'party') {
          if (['9-pm', 'asad', 'nitro-red', 'khamrah', 'honor-and-glory'].includes(p.id)) score += 25;
        } else if (finalAnswers.moment === 'casual_all') {
          if (['hawas-ice', '9-am-dive', 'fakhar-black', 'nitro-red', 'odyssey-mandarin-sky'].includes(p.id)) score += 25;
        }

        // Climate Zone
        if (finalAnswers.climate_zone === 'cold_sierra') {
          if (p.votes && p.votes.invierno > 6000) score += 20;
        } else if (finalAnswers.climate_zone === 'warm_costa') {
          if (p.votes && p.votes.verano > 2000) score += 20;
        } else if (finalAnswers.climate_zone === 'moderate') {
          if (['fakhar-black', '9-am-dive', 'odyssey-mandarin-sky', 'nitro-red'].includes(p.id)) score += 20;
        }

        // Impression
        if (finalAnswers.impression === 'status' && ['khamrah', 'asad', 'club-de-nuit-milestone', 'hawas-kobra'].includes(p.id)) score += 20;
        if (finalAnswers.impression === 'sexy' && ['9-pm', 'khamrah-qahwa', 'eclaire', 'honor-and-glory'].includes(p.id)) score += 20;
        if (finalAnswers.impression === 'clean' && ['fakhar-black', '9-am-dive', 'hawas-ice'].includes(p.id)) score += 20;
        if (finalAnswers.impression === 'bold' && ['asad', 'hawas-kobra', 'nitro-red'].includes(p.id)) score += 20;

        // Budget Matching
        const price = Number(p.price) || 50;
        if (finalAnswers.budget === 'under_50' && price <= 48) score += 20;
        if (finalAnswers.budget === 'mid_range' && price >= 48 && price <= 55) score += 20;
        if (finalAnswers.budget === 'top_range' && price >= 55) score += 20;
      }

      // --- SCORING: MODE ESPECIAL REGALOS (GIFT) ---
      else if (activeMode === 'gift') {
        const gender = (p.gender || '').toLowerCase();
        if (finalAnswers.recipient === 'gift_man') {
          if (gender.includes('hombre') || gender.includes('masculino')) score += 40;
          if (gender.includes('unisex')) score += 20;
        } else if (finalAnswers.recipient === 'gift_woman') {
          if (gender.includes('mujer') || gender.includes('femenino')) score += 50;
          if (gender.includes('unisex')) score += 25;
          if (['yara-pink', 'eclaire', 'khamrah'].includes(p.id)) score += 30;
        } else if (finalAnswers.recipient === 'gift_unisex') {
          if (gender.includes('unisex')) score += 45;
        }

        // Relation
        if (finalAnswers.relation === 'partner') {
          if (['khamrah-qahwa', '9-pm', 'eclaire', 'yara-pink', 'honor-and-glory'].includes(p.id)) score += 30;
          matchTag = 'Regalo Romántico & Seductor';
        } else if (finalAnswers.relation === 'family') {
          if (['fakhar-black', 'asad', 'khamrah', 'club-de-nuit-milestone'].includes(p.id)) score += 30;
          matchTag = 'Regalo de Prestigio Familiar';
        } else if (finalAnswers.relation === 'friend') {
          if (['hawas-ice', 'nitro-red', '9-am-dive', 'odyssey-mandarin-sky'].includes(p.id)) score += 30;
          matchTag = 'Acierto Seguro para Amigos';
        } else if (finalAnswers.relation === 'colleague') {
          if (['fakhar-black', 'club-de-nuit-milestone', 'odyssey-homme'].includes(p.id)) score += 30;
          matchTag = 'Elegancia Impecable para Compromiso';
        }

        // Personality
        if (finalAnswers.personality === 'p_elegant' && ['fakhar-black', 'asad', 'club-de-nuit-milestone', 'khamrah'].includes(p.id)) score += 25;
        if (finalAnswers.personality === 'p_sweet' && ['khamrah-qahwa', 'eclaire', 'yara-pink', 'honor-and-glory'].includes(p.id)) score += 25;
        if (finalAnswers.personality === 'p_active' && ['hawas-ice', '9-am-dive', 'nitro-red'].includes(p.id)) score += 25;
        if (finalAnswers.personality === 'p_bold' && ['9-pm', 'asad', 'hawas-kobra', 'khamrah'].includes(p.id)) score += 25;
      }

      // Calculate affinity percentage
      const maxPossibleScore = activeMode === 'advisor' ? 180 : 140;
      const affinity = Math.min(99, Math.max(82, Math.round((score / maxPossibleScore) * 100)));

      // Contextual reason
      const reason = PERFUME_JUSTIFICATIONS[p.id] || p.description || 'Fragancia equilibrada de alta calidad de la casa.';

      return {
        ...p,
        matchPercentage: affinity,
        matchTag,
        recommendationReason: reason
      };
    });

    scored.sort((a, b) => b.matchPercentage - a.matchPercentage);
    const topCount = activeMode === 'advisor' ? 4 : 3;
    const topResults = scored.slice(0, topCount);
    
    setResults(topResults);
    setStep(totalSteps + 1);

    // Celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const handleReset = (newMode = null) => {
    if (newMode) setActiveMode(newMode);
    setStep(1);
    setAnswers({});
    setResults(null);
  };

  const handleWhatsAppConsult = (perfume) => {
    const modeLabel = activeMode === 'gift' 
      ? 'el recomendador de regalos' 
      : activeMode === 'advisor' 
      ? 'el asesor Encuentra tu Perfume' 
      : 'el test olfativo';
    
    const message = `¡Hola Joufab! Hice ${modeLabel} en su web y me recomendó *${perfume.name}* (${perfume.brand}) con un ${perfume.matchPercentage}% de afinidad.\n\n¿Tienen disponibilidad y realizan envíos a mi ciudad?`;
    window.open(`https://wa.me/593984526114?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-obsidian-900 border border-gold-500/40 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[94vh]">
        
        {/* Modal Header */}
        <div className="px-5 sm:px-7 py-4 border-b border-white/10 flex items-center justify-between bg-obsidian-950/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-cinzel text-base sm:text-lg font-bold text-white tracking-wide">
                Asesor Olfativo Inteligente
              </h2>
              <p className="text-[11px] text-gold-400/90 font-sans hidden sm:block">
                Descubre tu fragancia ideal o el obsequio perfecto
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs (Visible before reaching results) */}
        {!results && (
          <div className="px-5 sm:px-7 py-2.5 bg-obsidian-950/60 border-b border-white/5 flex items-center gap-2 overflow-x-auto shrink-0 no-scrollbar">
            <button
              onClick={() => handleReset('advisor')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMode === 'advisor'
                  ? 'bg-gold-500 text-black shadow-gold-sm font-bold'
                  : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Encuentra tu Perfume (6 pasos)</span>
            </button>

            <button
              onClick={() => handleReset('gift')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMode === 'gift'
                  ? 'bg-gold-500 text-black shadow-gold-sm font-bold'
                  : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Especial Regalos</span>
            </button>

            <button
              onClick={() => handleReset('quick')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMode === 'quick'
                  ? 'bg-gold-500 text-black shadow-gold-sm font-bold'
                  : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Test Rápido (3 pasos)</span>
            </button>
          </div>
        )}

        {/* Progress bar */}
        {!results && (
          <div className="w-full bg-obsidian-950 h-1 shrink-0">
            <div 
              className="bg-gradient-to-r from-gold-600 via-gold-400 to-gold-500 h-full transition-all duration-500" 
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        )}

        {/* Body content */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1">
          
          {/* Question View */}
          {step <= totalSteps && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-widest text-gold-400 font-bold">
                    Paso {step} de {totalSteps} • {activeMode === 'gift' ? 'Modo Regalos' : activeMode === 'advisor' ? 'Asesor Completo' : 'Test Rápido'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {Math.round((step / totalSteps) * 100)}%
                  </span>
                </div>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white leading-tight">
                  {currentQuestions[step - 1].title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  {currentQuestions[step - 1].subtitle}
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
                {currentQuestions[step - 1].options.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(currentQuestions[step - 1].id, opt.id)}
                      className="p-3.5 sm:p-4 rounded-2xl bg-obsidian-850 hover:bg-obsidian-750 border border-white/10 hover:border-gold-500/60 flex items-center gap-3.5 text-left transition-all duration-200 group hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                      <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 group-hover:scale-110 group-hover:bg-gold-500/25 transition-all flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-sm sm:text-base text-white group-hover:text-gold-300 transition-colors block">
                          {opt.label}
                        </span>
                        <span className="text-xs text-slate-400 line-clamp-1">
                          {opt.desc}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-gold-400 group-hover:translate-x-1 transition-all shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Results View */}
          {results && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {activeMode === 'gift' ? '¡Recomendaciones de Regalo Listas!' : '¡Coincidencias Olfativas Encontradas!'}
                  </span>
                </div>
                <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
                  {activeMode === 'gift' ? 'Los Mejores Perfumes para Regalar' : 'Tus Fragancias Ideales'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                  {activeMode === 'gift'
                    ? 'Opciones con presentación de lujo y perfiles aromáticos de altísima aceptación garantizada:'
                    : 'Basado en tus preferencias sensoriales, clima y ocasión, estas son tus mejores opciones:'}
                </p>
              </div>

              {/* Fragrance Result Cards */}
              <div className="space-y-4">
                {results.map((item, idx) => {
                  const isCompared = comparedList.some((c) => c.id === item.id);
                  return (
                    <div 
                      key={item.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        idx === 0 
                          ? 'bg-gradient-to-br from-gold-950/30 via-obsidian-850 to-obsidian-900 border-gold-500/70 shadow-xl ring-1 ring-gold-500/30' 
                          : 'bg-obsidian-850 border-white/10 hover:border-gold-500/30'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        
                        {/* Bottle Image with badge */}
                        <div className="relative shrink-0 mx-auto sm:mx-0">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-xl border border-white/15 bg-obsidian-950"
                          />
                          <span className="absolute -top-2 -left-2 px-2 py-0.5 rounded-full bg-gold-500 text-black text-[9px] font-mono font-bold shadow-md">
                            #{idx + 1}
                          </span>
                        </div>

                        {/* Perfume Info */}
                        <div className="flex-1 min-w-0 space-y-1.5 text-left w-full">
                          
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider">
                              {item.brand} • {item.gender}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-300 text-[10px] font-semibold">
                              {item.matchTag}
                            </span>
                            {idx === 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 text-[10px] font-bold">
                                ELECCIÓN PRINCIPAL
                              </span>
                            )}
                          </div>

                          <div className="flex items-baseline justify-between gap-2">
                            <h4 className="font-cinzel text-lg sm:text-xl font-bold text-white truncate">
                              {item.name}
                            </h4>
                            <span className="font-mono text-sm sm:text-base font-bold text-gold-400 shrink-0">
                              ${item.price ? Number(item.price).toFixed(2) : '50.00'}
                            </span>
                          </div>

                          {/* Justification Box */}
                          <div className="p-2.5 rounded-xl bg-obsidian-950/70 border border-white/5 text-xs text-slate-300 leading-relaxed">
                            <span className="text-gold-400 font-semibold">Por qué te encantará: </span>
                            {item.recommendationReason}
                          </div>

                          {/* Notes Preview & Affinity */}
                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                            <span className="truncate max-w-[260px] sm:max-w-none">
                              <strong className="text-slate-300">Notas:</strong> {item.notes?.salida?.slice(0, 3).join(', ')}
                            </span>
                            <span className="font-mono font-bold text-emerald-400 shrink-0 ml-2">
                              {item.matchPercentage}% de afinidad
                            </span>
                          </div>

                        </div>

                      </div>

                      {/* Action Buttons: Ver Perfume, Comparar, WhatsApp, Pedir */}
                      <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2">
                        
                        {/* 1. Ver Perfume (Dedicated Page) */}
                        <button
                          onClick={() => {
                            onClose();
                            onSelectPerfume(item);
                          }}
                          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                          title="Ver página individual con pirámide olfativa completa"
                        >
                          <Eye className="w-3.5 h-3.5 text-gold-400" />
                          <span>Ver Perfume</span>
                        </button>

                        {/* 2. Comparar */}
                        <button
                          onClick={() => onToggleCompare && onToggleCompare(item)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                            isCompared
                              ? 'bg-gold-500/20 border border-gold-500/50 text-gold-300'
                              : 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300'
                          }`}
                          title="Añadir al comparador frente a frente"
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>{isCompared ? 'Comparando' : 'Comparar'}</span>
                        </button>

                        {/* 3. Consultar por WhatsApp */}
                        <button
                          onClick={() => handleWhatsAppConsult(item)}
                          className="px-3 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                          title="Consultar stock y entrega con Joufab"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>WhatsApp</span>
                        </button>

                        {/* 4. Pedir / Agregar al carrito */}
                        <button
                          onClick={() => onAddToCart && onAddToCart(item)}
                          className="px-3 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-gold-sm active:scale-95 cursor-pointer"
                          title="Añadir a mi bolsa de compra"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Pedir Ahora</span>
                        </button>

                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Reset / Switch Mode action */}
              <div className="pt-3 pb-2 flex flex-wrap items-center justify-center gap-3 border-t border-white/10">
                <button
                  onClick={() => handleReset('advisor')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-gold-400" />
                  <span>Repetir Asesor Completo</span>
                </button>

                <button
                  onClick={() => handleReset('gift')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Gift className="w-3.5 h-3.5 text-gold-400" />
                  <span>Probar Asistente de Regalos</span>
                </button>

                <button
                  onClick={() => handleReset('quick')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-gold-400" />
                  <span>Hacer Test Rápido (3 preguntas)</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
