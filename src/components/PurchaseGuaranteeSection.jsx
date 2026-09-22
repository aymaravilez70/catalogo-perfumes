import React from 'react';
import { 
  Truck, 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  Sparkles, 
  RotateCcw, 
  MessageCircle,
  CheckCircle2
} from 'lucide-react';

export default function PurchaseGuaranteeSection() {
  const guarantees = [
    {
      icon: Truck,
      title: 'Envíos Quito & Nacionales',
      badge: 'Cobertura Total',
      description: 'Entregas ágiles y personalizadas en la ciudad de Quito y envíos asegurados a todas las provincias del país mediante Servientrega.',
      highlight: 'Despachos diarios garantizados'
    },
    {
      icon: Clock,
      title: 'Disponibilidad Inmediata',
      badge: 'En Stock',
      description: 'Todas las fragancias activas en boutique cuentan con stock físico listo. Tiempo de despacho promedio de 24 horas laborables.',
      highlight: 'Entrega rápida en 1 día'
    },
    {
      icon: CreditCard,
      title: 'Métodos de Pago Flexibles',
      badge: 'Seguro y Directo',
      description: 'Aceptamos transferencias bancarias directas (Banco Pichincha, Guayaquil, Deuna) y pago en efectivo al recibir (en zonas seleccionadas de Quito).',
      highlight: 'Sin recargos sorpresa'
    },
    {
      icon: ShieldCheck,
      title: '100% Original Garantizado',
      badge: 'Punto de Fábrica',
      description: 'Cada frasco es importado directamente desde los distribuidores oficiales en los Emiratos Árabes y casas de perfumería matriz.',
      highlight: 'Sellos y lotes verificables'
    },
    {
      icon: RotateCcw,
      title: 'Garantía y Devolución',
      badge: 'Tranquilidad Total',
      description: 'Garantía inmediata de reposición ante cualquier eventual desperfecto en el atomizador o daño reportado en la logística de transporte.',
      highlight: 'Protección al comprador'
    },
    {
      icon: MessageCircle,
      title: 'Atención & Asesoría Personal',
      badge: 'Soporte VIP',
      description: '¿Dudas sobre notas, estela o equivalencias? Nuestro equipo te acompaña paso a paso por WhatsApp antes y después de tu compra.',
      highlight: 'Asesoría olfativa personalizada'
    }
  ];

  const handleWhatsAppHelp = () => {
    const text = encodeURIComponent(
      '¡Hola Joufab! Deseo realizar una consulta sobre disponibilidad de fragancias, formas de pago y tiempos de envío a mi ciudad.'
    );
    window.open(`https://wa.me/593984526114?text=${text}`, '_blank');
  };

  return (
    <section className="py-20 bg-gradient-to-b from-obsidian-950 via-obsidian-900/80 to-obsidian-950 border-t border-white/10 relative overflow-hidden">
      {/* Subtle Luxury Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gold-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-cinzel text-2xl sm:text-3xl text-white font-normal tracking-[0.2em] uppercase">
            Garantías de Compra
          </h2>
        </div>

        {/* 6 Guarantee Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guarantees.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={index}
                className="group bg-gradient-to-b from-obsidian-900/90 to-obsidian-950/90 rounded-2xl border border-white/10 hover:border-gold-500/40 p-6 flex flex-col justify-between shadow-luxury hover:shadow-luxury-hover transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-black transition-colors duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gold-300">
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-cinzel text-base font-bold text-white group-hover:text-gold-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-2 font-sans">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-gold-400/90 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>{item.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Direct WhatsApp Concierge CTA */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={handleWhatsAppHelp}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/5 hover:bg-gold-500/20 border border-gold-500/30 text-gold-300 hover:text-gold-200 text-xs font-semibold tracking-wider uppercase transition-all"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>¿Tienes dudas sobre envíos o medios de pago? Escríbenos directamente</span>
          </button>
        </div>

      </div>
    </section>
  );
}
