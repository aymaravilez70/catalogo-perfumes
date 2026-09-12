import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  MessageCircle, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart 
}) {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSendWhatsApp = () => {
    if (cartItems.length === 0) return;

    let message = `*PEDIDO - JOUFAB PERFUME HOUSE*\n`;
    if (customerName.trim()) {
      message += `*Cliente:* ${customerName.trim()}\n`;
    }
    message += `\n*Fragancias Solicitadas:*\n`;

    cartItems.forEach((item, index) => {
      message += `${index + 1}. *#${item.num} ${item.name}* (${item.brand})\n   • Cantidad: ${item.quantity} unidad(es)\n   • Familia: ${item.category}\n\n`;
    });

    if (customerNotes.trim()) {
      message += `*Notas / Ubicación de entrega:*\n${customerNotes.trim()}\n\n`;
    }

    message += `¿Tienen disponibilidad y cuáles son los métodos de pago? ¡Muchas gracias!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=593984526114&text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-obsidian-900 border-l border-gold-500/30 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-obsidian-950/90">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-gold-400" />
              <h2 className="font-cinzel text-lg font-bold text-white tracking-wider">
                Mi Lista de Pedido ({totalItemsCount})
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <ShoppingBag className="w-12 h-12 text-slate-700 mx-auto" />
                <h3 className="font-cinzel text-lg text-white">Tu lista está vacía</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Agrega fragancias del catálogo para armar tu pedido y cotizarlo directamente por WhatsApp.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-obsidian-950/70 border border-white/10"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-14 h-16 object-cover rounded-xl border border-white/10 flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono text-gold-400 font-bold block">
                        #{item.num} • {item.brand}
                      </span>
                      <h4 className="font-cinzel text-sm font-bold text-white truncate">
                        {item.name}
                      </h4>
                      <span className="text-[11px] text-slate-400 block truncate">
                        {item.category}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold text-white px-2">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {cartItems.length > 0 && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={onClearCart}
                      className="text-[11px] text-rose-400 hover:text-rose-300 underline"
                    >
                      Vaciar lista
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Customer info fields for checkout */}
            {cartItems.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                <span className="text-xs uppercase tracking-wider text-gold-400 font-semibold block">
                  Tus Datos para el Pedido (Opcional):
                </span>

                <input 
                  type="text"
                  placeholder="Tu Nombre..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                />

                <textarea 
                  rows="2"
                  placeholder="Ciudad, dirección o consulta adicional..."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                />
              </div>
            )}
          </div>

          {/* Footer Checkout Button */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-obsidian-950 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Total de Fragancias:</span>
                <span className="font-mono font-bold text-gold-400 text-sm">{totalItemsCount} unidad(es)</span>
              </div>

              <button
                onClick={handleSendWhatsApp}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 hover:brightness-110 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-lg active:scale-98 transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Enviar Pedido por WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-slate-500 text-center">
                Se abrirá WhatsApp con el listado completo para coordinar pago y entrega directamente.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
