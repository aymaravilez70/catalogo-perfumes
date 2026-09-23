import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Droplets, 
  Clock, 
  Flame, 
  Wind, 
  Sun, 
  CloudSnow, 
  ChevronDown, 
  CheckCircle2, 
  ShieldCheck, 
  Heart, 
  ArrowRight,
  Compass
} from 'lucide-react';

export default function PerfumeAcademySection({ onNavigateToCatalog, onOpenQuiz }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openArticleId, setOpenArticleId] = useState('concentraciones');

  const categories = [
    { id: 'all', label: 'Todos los Artículos' },
    { id: 'concentraciones', label: 'Concentraciones' },
    { id: 'rendimiento', label: 'Estela & Rendimiento' },
    { id: 'familias', label: 'Familias Olfativas' },
    { id: 'tips', label: 'Tips & Cuidado' }
  ];

  // Articles fulfilling all requirements of PDF Page 10, Point 18
  const articles = [
    {
      id: 'concentraciones',
      category: 'concentraciones',
      title: '¿Qué diferencia hay entre Eau de Parfum, Eau de Toilette y Extrait de Parfum?',
      summary: 'La concentración de aceites esenciales puros determina la potencia, densidad y longevidad del aroma en tu piel.',
      icon: Droplets,
      content: [
        {
          heading: 'Eau de Toilette (EDT) • 5% a 15% de esencia',
          text: 'Fórmula ligera y chispeante donde predominan las notas de salida (cítricos, frutas frescas). Ideal para el calor, climas cálidos y tras el gimnasio. Su duración promedio es de 4 a 6 horas.'
        },
        {
          heading: 'Eau de Parfum (EDP) • 15% a 20% de esencia',
          text: 'El estándar de la alta perfumería moderna. Ofrece un equilibrio perfecto entre una estela notable y gran fijación. La mayoría de creaciones de Lattafa, Afnan y Armaf son EDP, logrando entre 8 y 12 horas de duración.'
        },
        {
          heading: 'Extrait de Parfum / Elixir • 20% a 40% de concentración',
          text: 'La máxima pureza posible. Textura casi oleosa que se adhiere intensamente a la piel. Proyecta de manera elegante sin ser estridente y puede durar más de 14 a 24 horas, incluso tras la ducha.'
        }
      ]
    },
    {
      id: 'rendimiento',
      category: 'rendimiento',
      title: '¿Qué es la proyección, la estela (sillage) y la longevidad?',
      summary: 'Los tres pilares técnicos que definen cómo se comporta una fragancia en el espacio y en el tiempo.',
      icon: Clock,
      content: [
        {
          heading: 'Proyección • La distancia del aroma',
          text: 'Es el radio o burbuja que emana de tu cuerpo en las primeras 2 a 4 horas. Una proyección "alta" se percibe a más de un metro y medio de distancia sin necesidad de acercarse.'
        },
        {
          heading: 'Estela o Sillage • La huella en el aire',
          text: 'Es el rastro invisible que dejas flotando cuando caminas por un pasillo o entras a una habitación. Fragancias como 9 PM o Khamrah son famosas por su sillage arrollador que genera cumplidos inmediatos.'
        },
        {
          heading: 'Longevidad / Fijación • La duración en piel',
          text: 'El tiempo total desde que aplicas el perfume hasta que desaparece por completo la última nota de fondo. Varía según el tipo de piel (la piel hidratada retiene mucho mejor las moléculas aromáticas).'
        }
      ]
    },
    {
      id: 'piramide',
      category: 'rendimiento',
      title: '¿Cómo funciona la Pirámide Olfativa (Salida, Corazón y Fondo)?',
      summary: 'Un perfume nunca huele igual al rociarlo que pasadas tres horas: es una composición viva que evoluciona por etapas.',
      icon: Sparkles,
      content: [
        {
          heading: 'Notas de Salida (Los primeros 15 minutos)',
          text: 'Las moléculas más volátiles y livianas. Es tu primera impresión al atomizar (generalmente cítricos, bergamota, manzana o canela chispeante). No compres un perfume solo por su salida; espera a que se asiente.'
        },
        {
          heading: 'Notas de Corazón (De 30 min a 4 horas)',
          text: 'El alma y personalidad de la fragancia. Se revelan cuando la salida se calma, aportando flores, especias tostadas, praliné o acordes marinos que definen el carácter del perfume.'
        },
        {
          heading: 'Notas de Fondo (De 4 a 14+ horas)',
          text: 'Las moléculas más pesadas y densas: maderas nobles, ámbar, vainilla, haba tonka y almizcle. Es el aroma final que queda adherido a tu piel y ropa al final del día.'
        }
      ]
    },
    {
      id: 'familias',
      category: 'familias',
      title: 'Guía Completa de Familias Olfativas',
      summary: 'Las 12 grandes familias aromáticas: comprenderlas te permite acertar siempre en tus compras.',
      icon: Flame,
      content: [
        {
          heading: '🍋 Cítrica & Fresca (Bergamota, Limón, Naranja, Mandarina)',
          text: 'Aromas brillantes, frescos y energéticos que recuerdan a frutas recién exprimidas. Transmiten limpieza y vitalidad. ☀️ Ideales para días cálidos, verano, uso diario, oficina y actividades al aire libre.'
        },
        {
          heading: '🌊 Acuática & Marina (Brisa marina, Notas saladas, Agua)',
          text: 'Aromas frescos y ligeros que evocan el mar, el aire limpio y la sensación de estar junto al agua. 🏖️ Ideales para playa, calor, gimnasio, actividades al aire libre y días relajados.'
        },
        {
          heading: '🌿 Aromática (Lavanda, Salvia, Romero, Menta, Hierbas)',
          text: 'Aromas frescos y naturales con un carácter limpio y herbal. Pueden sentirse relajantes, elegantes o muy refrescantes. 🌤️ Ideales para uso diario, oficina, días cálidos y ocasiones casuales.'
        },
        {
          heading: '🌱 Verde (Hojas, Hierba, Té, Higo, Acordes verdes)',
          text: 'Aromas que recuerdan a la naturaleza, hojas recién cortadas y vegetación. Frescos, naturales y tranquilos. 🌳 Ideales para día, primavera, espacios abiertos y quienes buscan algo natural y diferente.'
        },
        {
          heading: '🍎 Frutal (Manzana, Pera, Frutos rojos, Sandía, Durazno)',
          text: 'Aromas jugosos, alegres y fáciles de reconocer. Pueden ir desde frescos y ligeros hasta dulces e intensos. ☀️ Ideales para día, citas, salidas casuales y quienes disfrutan aromas alegres y llamativos.'
        },
        {
          heading: '🌸 Floral (Rosa, Jazmín, Iris, Peonía, Violeta, Azahar)',
          text: 'La familia de las flores. Desde aromas delicados y románticos hasta composiciones intensas, elegantes y sofisticadas. 💐 Ideales para citas, eventos, ocasiones especiales y una sensación femenina o elegante.'
        },
        {
          heading: '🌲 Amaderada (Cedro, Sándalo, Vetiver, Pachulí)',
          text: 'Aromas profundos, secos, cálidos o elegantes que recuerdan a diferentes tipos de madera. Aportan estructura y carácter. 🌙 Ideales para noches, oficina, eventos formales y quienes buscan elegancia y presencia.'
        },
        {
          heading: '🌶️ Especiada & Aromática (Canela, Cardamomo, Pimienta, Azafrán)',
          text: 'Aromas cálidos y con personalidad. Las especias aportan sensación de calor, intensidad y misterio. 🌙 Ideales para noches, citas, clima fresco y ocasiones especiales.'
        },
        {
          heading: '🧡 Oriental / Ámbar (Ámbar, Vainilla, Resinas, Incienso)',
          text: 'Aromas cálidos, envolventes y profundos. Combinan dulzor, especias y resinas para crear una sensación intensa y sensual. 🌙 Ideales para noche, clima frío, citas y ocasiones especiales.'
        },
        {
          heading: '🍮 Gourmand (Vainilla, Caramelo, Café, Chocolate, Praliné)',
          text: 'Aromas que recuerdan a postres, bebidas y alimentos dulces. Son cálidos, apetitosos y envolventes. ❄️ Ideales para clima fresco, noches, citas y quienes disfrutan perfumes dulces y llamativos.'
        },
        {
          heading: '🥂 Chipre (Bergamota, Rosa, Musgo, Pachulí, Maderas)',
          text: 'Una familia elegante y sofisticada que combina frescura en la salida con un fondo más profundo, terroso y amaderado. 👔 Ideales para oficina, eventos, ocasiones formales y un aroma refinado.'
        },
        {
          heading: '🖤 Cuero (Cuero, Gamuza, Tabaco, Maderas, Especias)',
          text: 'Aromas intensos, secos, cálidos y con mucha personalidad. Transmiten elegancia, carácter y una sensación más oscura. 🌙 Ideales para noche, clima frío, eventos y quienes buscan máxima presencia.'
        }
      ]
    },
    {
      id: 'guia-rapida',
      category: 'familias',
      title: '¿Qué Familia Elegir Según lo que Buscas?',
      summary: 'Guía rápida para encontrar tu familia olfativa ideal según la sensación, el clima o la ocasión.',
      icon: Compass,
      content: [
        {
          heading: '☀️ Quiero algo fresco',
          text: 'Cítrica · Acuática · Aromática · Verde — Aromas ligeros, limpios y revitalizantes perfectos para el calor, el día a día y actividades al aire libre.'
        },
        {
          heading: '🍎 Quiero algo frutal y alegre',
          text: 'Frutal · Floral · Cítrica — Aromas jugosos, vibrantes y llamativos que transmiten juventud y buen ánimo.'
        },
        {
          heading: '🍬 Quiero algo dulce',
          text: 'Gourmand · Ámbar · Frutal — Aromas apetitosos, cálidos y envolventes que recuerdan a postres y golosinas.'
        },
        {
          heading: '🌙 Quiero algo intenso para la noche',
          text: 'Ámbar · Especiada · Amaderada · Cuero — Aromas profundos, sensuales y con presencia para dejar huella.'
        },
        {
          heading: '👔 Quiero algo elegante',
          text: 'Amaderada · Chipre · Floral · Aromática — Aromas sofisticados, refinados y con porte ejecutivo.'
        },
        {
          heading: '🏖️ Quiero algo para calor',
          text: 'Cítrica · Acuática · Aromática · Verde — Aromas que resisten la humedad y refrescan sin saturar.'
        },
        {
          heading: '❄️ Quiero algo para frío',
          text: 'Gourmand · Ámbar · Amaderada · Especiada · Cuero — Aromas densos y cálidos que florecen en el frío.'
        }
      ]
    },
    {
      id: 'duracion',
      category: 'tips',
      title: '¿Cómo hacer que tu perfume dure 12+ horas en piel y ropa?',
      summary: 'Cinco secretos profesionales de perfumistas para multiplicar la fijación y estela de cualquier fragancia.',
      icon: ShieldCheck,
      content: [
        {
          heading: '1. Aplica crema hidratante neutra antes de perfumarte',
          text: 'Los aceites del perfume se evaporan el doble de rápido en piel seca. Una capa de crema sin aroma actúa como un ancla molecular que retiene el aroma por muchas más horas.'
        },
        {
          heading: '2. Puntos de pulso estratégicos',
          text: 'Aplica en los laterales del cuello, detrás de las orejas y en la parte interna de los codos. El calor de tus vasos sanguíneos calienta el perfume y lo proyecta constantemente.'
        },
        {
          heading: '3. Nunca frotes las muñecas',
          text: 'Frotar las muñecas genera fricción térmica que destruye las delicadas notas de salida y altera la pirámide de evolución natural del perfume.'
        },
        {
          heading: '4. Rocía sobre tejidos naturales (algodón, lana, lino)',
          text: 'La tela no metaboliza el perfume como la piel; una atomización en la camisa o chaqueta puede durar días intacta manteniendo su estela.'
        }
      ]
    },
    {
      id: 'clima',
      category: 'tips',
      title: '¿Qué perfume usar según el clima (Sierra fría vs Costa cálida)?',
      summary: 'La temperatura ambiental expande o contrae las moléculas del perfume de forma dramática.',
      icon: Sun,
      content: [
        {
          heading: 'Clima Frío / Sierra ecuatoriana (Quito, Cuenca, Riobamba)',
          text: 'Las bajas temperaturas comprimen las moléculas. Necesitas perfumes densos, ricos en canela, vainilla, café, ámbar y especias (como Khamrah o Asad) que florecen en el frío y te abrazan con calidez.'
        },
        {
          heading: 'Clima Cálido / Costa y Playas (Guayaquil, Manta, Machala)',
          text: 'El calor y la humedad aceleran la evaporación. Un perfume denso puede volverse sofocante. La clave son aromas cítricos chispeantes, menta helada y notas acuáticas (como Hawas Ice o 9 AM Dive) que revitalizan sin cansar.'
        },
        {
          heading: 'Ambientes con Aire Acondicionado',
          text: 'La oficina con temperatura controlada permite usar fragancias equilibradas todo el año: aromas fougère limpios o ambarados ligeros que denotan profesionalismo.'
        }
      ]
    }
  ];

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(a => a.category === selectedCategory);

  return (
    <section id="academia" className="py-20 bg-obsidian-950 border-t border-b border-white/5 relative overflow-hidden">
      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <h2 className="font-cinzel text-2xl sm:text-3xl text-white font-normal tracking-[0.15em] uppercase">
              Guía del Buen Perfumista
            </h2>
          </div>

          {/* Categories Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-obsidian-900 border border-white/10 overflow-x-auto no-scrollbar shrink-0">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-gold-500 text-black shadow-gold-sm font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Accordion Grid */}
        <div className="space-y-4">
          {filteredArticles.map((article) => {
            const Icon = article.icon;
            const isOpen = openArticleId === article.id;

            return (
              <div
                key={article.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? 'bg-obsidian-900/95 border-gold-500/50 shadow-xl' 
                    : 'bg-obsidian-900/50 hover:bg-obsidian-900/80 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Accordion Toggle Header */}
                <button
                  onClick={() => setOpenArticleId(isOpen ? null : article.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-all shrink-0 ${
                      isOpen 
                        ? 'bg-gold-500 text-black shadow-gold-sm' 
                        : 'bg-white/5 text-gold-400 border border-white/10'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-cinzel text-base sm:text-lg font-bold text-white leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-light mt-0.5 line-clamp-1">
                        {article.summary}
                      </p>
                    </div>
                  </div>

                  <div className={`p-1.5 rounded-full transition-transform duration-300 shrink-0 ${
                    isOpen ? 'rotate-180 text-gold-400 bg-gold-500/10' : 'text-slate-500 bg-white/5'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Body Content */}
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-white/10 space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {article.content.map((item, idx) => (
                        <div 
                          key={idx}
                          className="p-4 rounded-xl bg-obsidian-950/80 border border-white/5 space-y-1.5 hover:border-gold-500/20 transition-all"
                        >
                          <h4 className="text-xs font-bold text-gold-300 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                            {item.heading}
                          </h4>
                          <p className="text-xs text-slate-300 leading-relaxed font-light">
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Action Bar inside Article */}
                    <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-white/5">
                      <span className="text-slate-400 text-center sm:text-left">
                        ¿Quieres poner en práctica esta guía con una fragancia para tu estilo?
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={onOpenQuiz}
                          className="px-3 py-1.5 rounded-xl bg-gold-500 text-black font-semibold hover:bg-gold-400 transition-all cursor-pointer"
                        >
                          Hacer Test Olfativo
                        </button>
                        <button
                          onClick={onNavigateToCatalog}
                          className="px-3 py-1.5 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all cursor-pointer"
                        >
                          Ver Catálogo
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
