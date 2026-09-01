import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  Clock, 
  Sparkles, 
  Check, 
  ShoppingBag, 
  MessageCircle, 
  Info,
  Flame,
  Cake
} from 'lucide-react';
import { Product, CartItemOption } from '../types';
import { formatRWF } from '../utils/format';
import { STORE_INFO } from '../data/menuData';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, options: CartItemOption, unitPrice: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [selectedSponge, setSelectedSponge] = useState<string>('');
  const [selectedFrosting, setSelectedFrosting] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [candleOption, setCandleOption] = useState<string>('Complimentary Birthday Candle');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Initialize defaults
  useEffect(() => {
    setSelectedSizeIndex(0);
    if (product.spongeOptions && product.spongeOptions.length > 0) {
      setSelectedSponge(product.spongeOptions[0]);
    } else {
      setSelectedSponge('');
    }
    if (product.frostingOptions && product.frostingOptions.length > 0) {
      setSelectedFrosting(product.frostingOptions[0]);
    } else {
      setSelectedFrosting('');
    }
    setCustomMessage('');
    setSpecialInstructions('');
    setQuantity(1);
  }, [product]);

  // Calculate current unit price
  const activeSize = product.availableSizes?.[selectedSizeIndex];
  const unitPrice = activeSize ? activeSize.basePrice : product.price;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    const options: CartItemOption = {
      size: activeSize?.name,
      servings: activeSize?.servings,
      sponge: selectedSponge || undefined,
      frosting: selectedFrosting || undefined,
      customMessage: customMessage.trim() || undefined,
      candleOption: product.supportsCustomMessage ? candleOption : undefined,
      specialInstructions: specialInstructions.trim() || undefined,
    };
    onAddToCart(product, quantity, options, unitPrice);
    onClose();
  };

  const handleInstantWhatsApp = () => {
    const sizeText = activeSize ? `Size: ${activeSize.name}` : '';
    const spongeText = selectedSponge ? `Sponge: ${selectedSponge}` : '';
    const frostingText = selectedFrosting ? `Frosting: ${selectedFrosting}` : '';
    const msgText = customMessage ? `Message: "${customMessage}"` : '';
    
    let text = `Hello Tanuri Pastries Kigali! I would like to order:\n` +
      `🍰 *${product.name}* (Qty: ${quantity})\n` +
      (sizeText ? `• ${sizeText}\n` : '') +
      (spongeText ? `• ${spongeText}\n` : '') +
      (frostingText ? `• ${frostingText}\n` : '') +
      (msgText ? `• ${msgText}\n` : '') +
      `💰 *Total:* ${formatRWF(totalPrice)}\n` +
      `Please let me know how soon this can be delivered in Kigali!`;

    const url = `https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#18140f] border border-[#3e3325] rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header with Close Button */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-[#241e17] shrink-0">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#18140f] via-[#18140f]/40 to-black/60" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-white hover:text-[#d4af37] transition-all border border-white/10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 sm:left-6 right-4">
            <div className="flex items-center gap-2 mb-1 text-xs">
              <span className="px-2 py-0.5 rounded-md bg-[#d4af37] text-black font-extrabold text-[10px] uppercase">
                {product.category.replace('-', ' ')}
              </span>
              <div className="flex items-center gap-1 text-[#d4af37] bg-black/50 px-2 py-0.5 rounded-md border border-white/5">
                <Star className="w-3 h-3 fill-[#d4af37]" />
                <span className="font-bold text-white text-xs">{product.rating}</span>
                <span className="text-stone-400 text-[10px]">({product.reviewsCount} reviews)</span>
              </div>
            </div>
            <h2 className="font-['Cinzel',serif] text-xl sm:text-2xl font-bold text-white leading-tight">
              {product.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar text-xs sm:text-sm text-[#ddd5c7]">
          
          {/* Description */}
          <p className="text-[#bfb5a3] leading-relaxed">
            {product.description}
          </p>

          {/* Size / Portion Selector */}
          {product.availableSizes && product.availableSizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center justify-between">
                <span>1. Select Size / Portion</span>
                <span className="text-[#a69c8a] font-normal lowercase">{product.availableSizes[selectedSizeIndex]?.servings}</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.availableSizes.map((size, idx) => {
                  const isSelected = selectedSizeIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#d4af37]/15 border-[#d4af37] text-white font-bold shadow-sm'
                          : 'bg-[#1f1a14] border-[#382f22] text-[#c2b9a9] hover:border-[#4d3f2c]'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-semibold text-white">{size.name}</p>
                        <p className="text-[10px] text-[#8e8574]">{size.servings}</p>
                      </div>
                      <span className="text-xs font-bold text-[#d4af37]">
                        {formatRWF(size.basePrice)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sponge Flavor Choice */}
          {product.spongeOptions && product.spongeOptions.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                2. Choose Cake Sponge Base
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.spongeOptions.map((sponge, idx) => {
                  const isSelected = selectedSponge === sponge;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSponge(sponge)}
                      className={`px-3 py-2 rounded-xl text-xs text-left border transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'bg-[#d4af37]/15 border-[#d4af37] text-white font-bold'
                          : 'bg-[#1f1a14] border-[#382f22] text-[#b5aba0] hover:border-[#4d3f2c]'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-[#d4af37] bg-[#d4af37]' : 'border-[#615442]'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 text-black" />}
                      </div>
                      <span className="truncate">{sponge}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Frosting / Icing Choice */}
          {product.frostingOptions && product.frostingOptions.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                3. Choose Frosting & Cream
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.frostingOptions.map((frosting, idx) => {
                  const isSelected = selectedFrosting === frosting;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedFrosting(frosting)}
                      className={`px-3 py-2 rounded-xl text-xs text-left border transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'bg-[#d4af37]/15 border-[#d4af37] text-white font-bold'
                          : 'bg-[#1f1a14] border-[#382f22] text-[#b5aba0] hover:border-[#4d3f2c]'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-[#d4af37] bg-[#d4af37]' : 'border-[#615442]'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 text-black" />}
                      </div>
                      <span className="truncate">{frosting}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom Message Piping (Complimentary) */}
          {product.supportsCustomMessage && (
            <div className="space-y-2 p-3.5 rounded-2xl bg-[#221c15] border border-[#443725]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Complimentary Custom Cake Message</span>
                </label>
                <span className="text-[10px] text-[#86efac] font-bold bg-[#14301d] px-2 py-0.5 rounded-md border border-[#2d5c3b]">
                  FREE
                </span>
              </div>
              
              <input
                type="text"
                maxLength={45}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="e.g. Happy 30th Birthday Sarah! 🎉"
                className="w-full bg-[#16120e] border border-[#3d3324] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-[#786e5e] focus:outline-none focus:border-[#d4af37]"
              />

              {/* Live Golden Ribbon Preview */}
              {customMessage && (
                <div className="mt-2 p-2.5 rounded-xl bg-[#2c2214] border border-[#d4af37]/40 flex items-center gap-2">
                  <Cake className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] text-[#8e8574] block uppercase">Piped Message Preview:</span>
                    <span className="font-['Cinzel',serif] text-xs font-bold text-[#fcf6e8] italic">
                      "{customMessage}"
                    </span>
                  </div>
                </div>
              )}

              {/* Candle options */}
              <div className="pt-2 flex items-center gap-2 text-xs">
                <span className="text-[#a69c8a]">Add Celebration Candle:</span>
                <select
                  value={candleOption}
                  onChange={(e) => setCandleOption(e.target.value)}
                  className="bg-[#18130e] border border-[#3d3324] rounded-lg px-2 py-1 text-xs text-[#dcd5c7] focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="Complimentary Gold Candle">Complimentary Gold Candle (Free)</option>
                  <option value="Pack of 6 Gold Sparkle Candles">Pack of 6 Gold Sparkle Candles (+1,000 RWF)</option>
                  <option value="Number Birthday Candles (Specify in notes)">Number Candles (+2,000 RWF)</option>
                  <option value="No Candle Needed">No Candle Needed</option>
                </select>
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#a69c8a]">
              Dietary or Delivery Instructions (Optional)
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g., Please make it eggless, less sweet, or delivery gate instructions..."
              className="w-full bg-[#1c1813] border border-[#382f22] rounded-xl px-3 py-2 text-xs text-white placeholder-[#736959] focus:outline-none focus:border-[#d4af37] resize-none"
            />
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-[#14100c] border-t border-[#31271b] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          
          {/* Quantity & Unit price */}
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <div className="flex items-center border border-[#3e3325] rounded-xl bg-[#1c1813] p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:bg-[#2d251a] transition-colors font-bold"
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-white text-sm">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:bg-[#2d251a] transition-colors font-bold"
              >
                +
              </button>
            </div>

            <div className="text-right sm:text-left">
              <p className="text-[10px] uppercase tracking-wider text-[#8e8574]">Total Price</p>
              <p className="text-lg font-extrabold text-[#f3ece0]">
                {formatRWF(totalPrice)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleInstantWhatsApp}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-[#1c2c1e] hover:bg-[#253d29] border border-[#2d5234] text-[#86efac] font-bold text-xs sm:text-sm transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-[#4ade80]" />
              <span className="hidden sm:inline">WhatsApp Order</span>
            </button>

            <button
              type="button"
              onClick={handleAdd}
              id="modal-add-to-basket-btn"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#b38930] via-[#d4af37] to-[#b38930] text-[#120f0a] font-extrabold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#d4af37]/15"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Basket • {formatRWF(totalPrice)}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
