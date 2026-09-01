import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  MapPin, 
  Clock, 
  Tag, 
  MessageCircle, 
  CheckCircle2, 
  Sparkles, 
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Phone
} from 'lucide-react';
import { CartItem, DeliveryZone } from '../types';
import { formatRWF, generateWhatsAppOrderUrl } from '../utils/format';
import { STORE_INFO, DELIVERY_ZONES } from '../data/menuData';
import { getSafeImageUrl, handleImageError, FALLBACK_CAKE_IMAGE } from '../utils/imageUtils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  selectedZone: DeliveryZone;
  onSelectZone: (zone: DeliveryZone) => void;
  onPlaceOrder: (orderDetails: any) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  selectedZone,
  onSelectZone,
  onPlaceOrder,
}) => {
  if (!isOpen) return null;

  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [selectedPickupLocation, setSelectedPickupLocation] = useState(STORE_INFO.locations[0].name);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const isFreeDeliveryEligible = subtotal >= 45000;
  const deliveryFee = deliveryType === 'delivery' ? (isFreeDeliveryEligible ? 0 : selectedZone.fee) : 0;
  const discountAmount = appliedDiscount > 0 ? (subtotal * appliedDiscount) : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  // Promo code validation
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'TANURI10' || code === 'WELCOME10') {
      setAppliedDiscount(0.1);
      setPromoMessage('✨ 10% Discount applied successfully!');
    } else if (code === 'KIGALI') {
      setAppliedDiscount(0.05);
      setPromoMessage('🎉 5% Special Kigali treat discount applied!');
    } else {
      setPromoMessage('❌ Invalid promo code. Try "TANURI10"');
    }
  };

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;
    const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();
    const url = generateWhatsAppOrderUrl(
      items,
      deliveryType,
      selectedZone,
      customerName,
      customerPhone,
      deliveryAddress,
      orderNotes,
      subtotal,
      deliveryFee,
      discountAmount,
      grandTotal,
      orderNumber
    );
    window.open(url, '_blank');
    onPlaceOrder({
      orderNumber,
      items,
      subtotal,
      deliveryFee,
      discountAmount,
      grandTotal,
      deliveryType,
      customerName,
      customerPhone,
      deliveryAddress,
      selectedZone,
    });
  };

  const handleInstantAppCheckout = () => {
    if (items.length === 0) return;
    if (!customerPhone) {
      alert('Please enter your contact phone number for Kigali delivery / pickup.');
      return;
    }
    const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();
    onPlaceOrder({
      orderNumber,
      items,
      subtotal,
      deliveryFee,
      discountAmount,
      grandTotal,
      deliveryType,
      customerName: customerName || 'Valued Guest',
      customerPhone,
      deliveryAddress: deliveryAddress || selectedZone.name,
      selectedZone,
      notes: orderNotes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#16120e] border-l border-[#3a3023] shadow-2xl flex flex-col justify-between text-[#e4ded3]">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#2d251a] flex items-center justify-between bg-[#1a1510]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-['Cinzel',serif] text-base font-bold text-white">
                  Your Pastry Basket
                </h2>
                <p className="text-[11px] text-[#8e8574]">
                  {items.length} {items.length === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#a39886] hover:text-white hover:bg-[#282117] transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 custom-scrollbar text-xs sm:text-sm">
            
            {/* Free Delivery Progress Bar */}
            <div className="p-3 rounded-xl bg-[#221b14] border border-[#3f3222] space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#d4af37] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Free Kigali Delivery Tier
                </span>
                <span className="font-bold text-white">
                  {subtotal >= 45000 ? 'Unlocked! 🎉' : `${formatRWF(Math.max(0, 45000 - subtotal))} away`}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#120f0c] overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#b38930] to-[#d4af37] transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, (subtotal / 45000) * 100)}%` }}
                />
              </div>
            </div>

            {/* Empty State */}
            {items.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#231b14] border border-[#3b2e1e] mx-auto flex items-center justify-center text-[#8e8574]">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="font-['Cinzel',serif] text-base font-bold text-white">Your Basket is Empty</h3>
                <p className="text-xs text-[#8e8574] max-w-xs mx-auto">
                  Treat yourself to Kigali’s finest artisan celebration cakes, flaky croissants, or sweet bento boxes.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-[#d4af37] text-black font-bold text-xs"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              /* Items List */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">Selected Delights</span>
                  <button 
                    onClick={onClearCart}
                    className="text-[11px] text-[#998f7e] hover:text-red-400 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                </div>

                {items.map((item) => (
                  <div 
                    key={item.id}
                    className="p-3 rounded-2xl bg-[#1d1711] border border-[#382d1e] flex gap-3"
                  >
                    <img
                      src={getSafeImageUrl(item.product.image, FALLBACK_CAKE_IMAGE)}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageError(e, FALLBACK_CAKE_IMAGE)}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#3b3021]"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-xs text-white truncate">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-[#736857] hover:text-red-400 p-0.5"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Options summary */}
                        <div className="text-[10px] text-[#a69c8a] space-y-0.5 mt-0.5">
                          {item.options.size && <p>• Size: {item.options.size}</p>}
                          {item.options.sponge && <p>• Sponge: {item.options.sponge}</p>}
                          {item.options.frosting && <p>• Frosting: {item.options.frosting}</p>}
                          {item.options.customMessage && (
                            <p className="text-[#d4af37] font-semibold italic">
                              • Piped: "{item.options.customMessage}"
                            </p>
                          )}
                          {item.options.specialInstructions && (
                            <p className="text-[#8e8574]">• Note: {item.options.specialInstructions}</p>
                          )}
                        </div>
                      </div>

                      {/* Quantity and Price */}
                      <div className="mt-2 pt-2 border-t border-[#2a2217] flex items-center justify-between">
                        <div className="flex items-center border border-[#3a2f20] rounded-lg bg-[#14100c] px-1 py-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-5 h-5 flex items-center justify-center text-white hover:text-[#d4af37] font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-5 h-5 flex items-center justify-center text-white hover:text-[#d4af37] font-bold text-xs"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-extrabold text-xs text-[#f3ece0]">
                          {formatRWF(item.totalPrice)}
                        </span>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}

            {items.length > 0 && (
              <>
                {/* Fulfillment Selection */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                    Fulfillment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('delivery')}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                        deliveryType === 'delivery'
                          ? 'bg-[#d4af37]/20 border-[#d4af37] text-white font-bold'
                          : 'bg-[#1b1610] border-[#382d1e] text-[#a69c8a]'
                      }`}
                    >
                      <span>🚗 Kigali Delivery</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryType('pickup')}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                        deliveryType === 'pickup'
                          ? 'bg-[#d4af37]/20 border-[#d4af37] text-white font-bold'
                          : 'bg-[#1b1610] border-[#382d1e] text-[#a69c8a]'
                      }`}
                    >
                      <span>🏪 Boutique Pickup</span>
                    </button>
                  </div>
                </div>

                {/* Delivery Area or Pickup Point Selector */}
                {deliveryType === 'delivery' ? (
                  <div className="space-y-2 p-3 rounded-2xl bg-[#1b1610] border border-[#382d1e]">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#d4af37]" /> Kigali Neighborhood
                      </label>
                      <span className="text-[11px] text-[#d4af37] font-bold">
                        {isFreeDeliveryEligible ? 'FREE' : formatRWF(selectedZone.fee)}
                      </span>
                    </div>

                    <select
                      value={selectedZone.id}
                      onChange={(e) => {
                        const found = DELIVERY_ZONES.find(z => z.id === e.target.value);
                        if (found) onSelectZone(found);
                      }}
                      className="w-full bg-[#14100c] border border-[#382d1e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    >
                      {DELIVERY_ZONES.map((zone) => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name} • {formatRWF(zone.fee)} ({zone.estMinutes})
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Street name, Villa/Apartment no., or landmark..."
                      className="w-full bg-[#14100c] border border-[#382d1e] rounded-xl px-3 py-2 text-xs text-white placeholder-[#706655] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                ) : (
                  <div className="space-y-2 p-3 rounded-2xl bg-[#1b1610] border border-[#382d1e]">
                    <label className="text-xs font-bold text-white">Select Pickup Boutique</label>
                    <div className="space-y-1.5">
                      {STORE_INFO.locations.map((loc, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedPickupLocation(loc.name)}
                          className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                            selectedPickupLocation === loc.name
                              ? 'bg-[#d4af37]/20 border-[#d4af37] text-white font-bold'
                              : 'bg-[#14100c] border-[#382d1e] text-[#a69c8a]'
                          }`}
                        >
                          <p className="font-semibold text-white">{loc.name}</p>
                          <p className="text-[10px] text-[#8e8574]">{loc.address} • {loc.hours}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="space-y-2 p-3 rounded-2xl bg-[#1b1610] border border-[#382d1e]">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                    Contact Information
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your Name (Optional)"
                      className="bg-[#14100c] border border-[#382d1e] rounded-xl px-3 py-2 text-xs text-white placeholder-[#706655] focus:outline-none focus:border-[#d4af37]"
                    />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Phone / WhatsApp (e.g. 078...)"
                      className="bg-[#14100c] border border-[#382d1e] rounded-xl px-3 py-2 text-xs text-white placeholder-[#706655] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <input
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Special delivery instructions or gate code..."
                    className="w-full bg-[#14100c] border border-[#382d1e] rounded-xl px-3 py-2 text-xs text-white placeholder-[#706655] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                {/* Promo Code input */}
                <form onSubmit={handleApplyPromo} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code (e.g. TANURI10)"
                      className="flex-1 bg-[#14100c] border border-[#382d1e] rounded-xl px-3 py-2 text-xs text-white placeholder-[#706655] uppercase focus:outline-none focus:border-[#d4af37]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-[#2d2418] hover:bg-[#d4af37] text-[#e8e0d1] hover:text-black rounded-xl text-xs font-bold transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoMessage && (
                    <p className={`text-[11px] ${promoMessage.includes('10%') || promoMessage.includes('5%') ? 'text-[#86efac]' : 'text-rose-400'}`}>
                      {promoMessage}
                    </p>
                  )}
                </form>

                {/* Bill Summary */}
                <div className="p-3.5 rounded-2xl bg-[#1b1610] border border-[#382d1e] space-y-2 text-xs">
                  <div className="flex justify-between text-[#a69c8a]">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-white">{formatRWF(subtotal)}</span>
                  </div>

                  {deliveryType === 'delivery' && (
                    <div className="flex justify-between text-[#a69c8a]">
                      <span>Kigali Delivery ({selectedZone.name})</span>
                      <span className="font-semibold text-white">
                        {isFreeDeliveryEligible ? (
                          <span className="text-[#86efac] font-bold">FREE (Tier Reward)</span>
                        ) : (
                          formatRWF(deliveryFee)
                        )}
                      </span>
                    </div>
                  )}

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#86efac]">
                      <span>Discount</span>
                      <span className="font-bold">-{formatRWF(discountAmount)}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#2e2417] flex justify-between items-baseline text-sm">
                    <span className="font-bold text-white">Grand Total</span>
                    <span className="font-['Cinzel',serif] text-base font-extrabold text-[#d4af37]">
                      {formatRWF(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* MoMo Payment note */}
                <div className="p-3 rounded-xl bg-[#201912] border border-[#423423] text-[11px] space-y-1">
                  <p className="font-bold text-[#d4af37]">📱 Mobile Money (MTN MoMo / Airtel)</p>
                  <p className="text-[#a69c8a]">
                    Pay on delivery or dial <span className="text-white font-mono font-bold">{STORE_INFO.momoCode}</span> ({STORE_INFO.momoMerchantName})
                  </p>
                </div>
              </>
            )}

          </div>

          {/* Footer Checkout Buttons */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 bg-[#14100c] border-t border-[#31271b] space-y-2.5 shrink-0">
              
              {/* WhatsApp Checkout Button */}
              <button
                type="button"
                onClick={handleWhatsAppCheckout}
                id="cart-whatsapp-order-btn"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#204427] hover:bg-[#285732] border border-[#3b7a48] text-[#86efac] font-extrabold text-xs sm:text-sm transition-all active:scale-95 shadow-md"
              >
                <MessageCircle className="w-4 h-4 text-[#4ade80]" />
                <span>Order via WhatsApp (Instant Confirmation)</span>
              </button>

              {/* Direct In-App Fast Checkout */}
              <button
                type="button"
                onClick={handleInstantAppCheckout}
                id="cart-instant-checkout-btn"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#b38930] via-[#d4af37] to-[#b38930] text-[#120f0a] font-extrabold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#d4af37]/20"
              >
                <span>Confirm Order • {formatRWF(grandTotal)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
