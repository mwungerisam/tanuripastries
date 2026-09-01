import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Cake, 
  Calendar, 
  MapPin, 
  MessageCircle, 
  Check, 
  Crown, 
  Clock, 
  Phone, 
  Info 
} from 'lucide-react';
import { CustomCakeForm } from '../types';
import { STORE_INFO, DELIVERY_ZONES } from '../data/menuData';
import { formatRWF, generateWhatsAppCustomCakeUrl } from '../utils/format';

interface CustomCakeBuilderProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomCakeBuilder: React.FC<CustomCakeBuilderProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<CustomCakeForm>({
    celebrationType: 'Birthday Celebration',
    tiers: '1-tier',
    sizeKg: 1.5,
    spongeFlavor: 'Belgian Dark Chocolate',
    fillingFlavor: 'Fresh Strawberry & Vanilla Compote',
    outerFrosting: 'Silky Swiss Buttercream',
    colorTheme: 'Champagne Gold & Warm Cream',
    cakeMessage: '',
    deliveryDate: '',
    deliveryTime: 'Afternoon (2:00 PM - 5:00 PM)',
    deliveryType: 'delivery',
    deliveryArea: 'Gacuriro',
    customerName: '',
    customerPhone: '',
    notes: '',
    candleCount: 1,
  });

  const celebrationTypes = [
    'Birthday Celebration',
    'Wedding & Engagement',
    'Anniversary',
    'Corporate Milestone',
    'Baby Shower / Gender Reveal',
    'Graduation Party',
    'Custom Theme / Other',
  ];

  const tierOptions = [
    { id: 'bento', label: 'Bento Mini Cake', kg: 0.5, estPrice: 12000, desc: '1-2 persons • Korean Lunchbox style' },
    { id: '1-tier', label: '1-Tier Classic', kg: 1.5, estPrice: 40000, desc: '10-14 persons • Elegant round or heart' },
    { id: '2-tier', label: '2-Tier Grand', kg: 3.0, estPrice: 78000, desc: '25-35 persons • Celebration centerpiece' },
    { id: '3-tier', label: '3-Tier Royal', kg: 5.5, estPrice: 140000, desc: '50-70 persons • Weddings & major events' },
  ];

  const spongeList = [
    'Belgian Dark Chocolate',
    'Madagascar Bourbon Vanilla',
    'Royal Red Velvet',
    'Lotus Biscoff Spiced',
    'Rwandan Passion Fruit',
    'Marble Swirl (Choc & Vanilla)',
  ];

  const fillingList = [
    'Fresh Strawberry & Raspberry Compote',
    '70% Dark Chocolate Silk Ganache',
    'Salted Butter Caramel Drip',
    'Philadelphia Cream Cheese',
    'Rwandan Passionfruit Curd',
    'Nutella Hazelnut Cream',
  ];

  const frostingStyles = [
    'Silky Swiss Buttercream',
    'Vintage Lambeth Victorian Piping',
    'Modern Minimalist Concrete / Gold Leaf',
    'Semi-Naked Rustic Cake',
    'Mirror Glaze / Ganache Drip',
    'Whipped Chantilly Cream',
  ];

  const colorThemes = [
    'Champagne Gold & Warm Cream',
    'Blush Pink & Rose Gold',
    'Midnight Espresso & 24K Gold',
    'Sage Green & Botanical White',
    'Sky Blue & Silver Dust',
    'Custom Palette (describe below)',
  ];

  // Calculate live estimate base price
  const selectedTierConfig = tierOptions.find(t => t.id === formData.tiers) || tierOptions[1];
  let estPrice = selectedTierConfig.estPrice;
  if (formData.candleCount > 1) estPrice += (formData.candleCount - 1) * 200;

  const handleSendWhatsAppInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerPhone) {
      alert('Please enter your contact phone number so our pastry chef can reach you.');
      return;
    }
    const url = generateWhatsAppCustomCakeUrl(formData, estPrice);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-[#17130f] border border-[#3e3223] rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#1f1912] border-b border-[#33281b] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-['Cinzel',serif] text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Custom Celebration Cake Designer</span>
                <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-[#d4af37] text-black font-extrabold uppercase">
                  Bespoke
                </span>
              </h2>
              <p className="text-xs text-[#9e9483]">
                Handcrafted in Kigali by Tanuri Pastries master bakers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#8e8574] hover:text-white hover:bg-[#2c2217] transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSendWhatsAppInquiry} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar text-xs sm:text-sm text-[#ded6c7]">
          
          {/* Step 1: Occasion */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
              <span>1. Occasion & Celebration</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {celebrationTypes.map((occ) => {
                const isSelected = formData.celebrationType === occ;
                return (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => setFormData({ ...formData, celebrationType: occ })}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs font-semibold ${
                      isSelected
                        ? 'bg-[#d4af37]/20 border-[#d4af37] text-white font-bold'
                        : 'bg-[#1e1812] border-[#362b1d] text-[#b8ad9e] hover:border-[#4d3d2a]'
                    }`}
                  >
                    {occ}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Tier & Portion Scale */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
              2. Choose Tier & Portion Scale
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {tierOptions.map((tier) => {
                const isSelected = formData.tiers === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, tiers: tier.id as any, sizeKg: tier.kg })}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#d4af37]/15 border-[#d4af37] shadow-md'
                        : 'bg-[#1e1812] border-[#362b1d] hover:border-[#4d3d2a]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs sm:text-sm text-white">{tier.label}</p>
                      <span className="font-['Cinzel',serif] text-xs font-extrabold text-[#d4af37]">
                        ~{formatRWF(tier.estPrice)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#9c9180] mt-1">{tier.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Sponge Flavor */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
              3. Cake Sponge Flavor
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {spongeList.map((sponge) => {
                const isSelected = formData.spongeFlavor === sponge;
                return (
                  <button
                    key={sponge}
                    type="button"
                    onClick={() => setFormData({ ...formData, spongeFlavor: sponge })}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-[#d4af37]/20 border-[#d4af37] text-white font-bold'
                        : 'bg-[#1e1812] border-[#362b1d] text-[#b8ad9e] hover:border-[#4d3d2a]'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-[#d4af37] bg-[#d4af37]' : 'border-[#594a37]'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5 text-black" />}
                    </div>
                    <span className="truncate">{sponge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Filling & Layering */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
              4. Inside Filling & Compote
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {fillingList.map((filling) => {
                const isSelected = formData.fillingFlavor === filling;
                return (
                  <button
                    key={filling}
                    type="button"
                    onClick={() => setFormData({ ...formData, fillingFlavor: filling })}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-[#d4af37]/20 border-[#d4af37] text-white font-bold'
                        : 'bg-[#1e1812] border-[#362b1d] text-[#b8ad9e] hover:border-[#4d3d2a]'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-[#d4af37] bg-[#d4af37]' : 'border-[#594a37]'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5 text-black" />}
                    </div>
                    <span className="truncate">{filling}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 5: Outer Frosting & Aesthetic Color Theme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                5. Frosting Art Style
              </label>
              <select
                value={formData.outerFrosting}
                onChange={(e) => setFormData({ ...formData, outerFrosting: e.target.value })}
                className="w-full bg-[#1e1812] border border-[#362b1d] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              >
                {frostingStyles.map((style) => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                6. Color Palette Theme
              </label>
              <select
                value={formData.colorTheme}
                onChange={(e) => setFormData({ ...formData, colorTheme: e.target.value })}
                className="w-full bg-[#1e1812] border border-[#362b1d] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              >
                {colorThemes.map((theme) => (
                  <option key={theme} value={theme}>{theme}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 6: Piped Message on Cake */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-[#201a13] border border-[#3a2e1d]">
            <label className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center justify-between">
              <span>7. Custom Piped Inscription</span>
              <span className="text-[10px] text-[#86efac] font-bold">COMPLIMENTARY</span>
            </label>
            <input
              type="text"
              value={formData.cakeMessage}
              onChange={(e) => setFormData({ ...formData, cakeMessage: e.target.value })}
              placeholder="e.g. Happy 30th Birthday Keza! or Forever & Always"
              className="w-full bg-[#14100c] border border-[#362b1d] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#786c5a] focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Step 7: Delivery Date, Time & Kigali Location */}
          <div className="space-y-3 p-3.5 rounded-2xl bg-[#201a13] border border-[#3a2e1d]">
            <label className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
              8. Event Date & Kigali Delivery Details
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <span className="text-[10px] text-[#9c9180] block mb-1">Date Needed</span>
                <input
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  className="w-full bg-[#14100c] border border-[#362b1d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <span className="text-[10px] text-[#9c9180] block mb-1">Preferred Time</span>
                <select
                  value={formData.deliveryTime}
                  onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                  className="w-full bg-[#14100c] border border-[#362b1d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                  <option value="Afternoon (1:00 PM - 5:00 PM)">Afternoon (1:00 PM - 5:00 PM)</option>
                  <option value="Evening (5:00 PM - 8:00 PM)">Evening (5:00 PM - 8:00 PM)</option>
                </select>
              </div>

              <div>
                <span className="text-[10px] text-[#9c9180] block mb-1">Kigali Neighborhood</span>
                <select
                  value={formData.deliveryArea}
                  onChange={(e) => setFormData({ ...formData, deliveryArea: e.target.value })}
                  className="w-full bg-[#14100c] border border-[#362b1d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                >
                  {DELIVERY_ZONES.map(z => (
                    <option key={z.id} value={z.name}>{z.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Client Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Your Full Name *"
                className="bg-[#14100c] border border-[#362b1d] rounded-xl px-3 py-2 text-xs text-white placeholder-[#786c5a] focus:outline-none focus:border-[#d4af37]"
              />
              <input
                type="tel"
                required
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                placeholder="WhatsApp Phone Number (e.g. 078...) *"
                className="bg-[#14100c] border border-[#362b1d] rounded-xl px-3 py-2 text-xs text-white placeholder-[#786c5a] focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            {/* Extra Notes */}
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any reference design ideas, theme characters, fresh flower toppings, or dietary requests..."
              className="w-full bg-[#14100c] border border-[#362b1d] rounded-xl px-3 py-2 text-xs text-white placeholder-[#786c5a] focus:outline-none focus:border-[#d4af37] resize-none"
            />
          </div>

          {/* Live Summary Preview Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#241c13] to-[#1a140d] border border-[#4d3d27] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37]">Estimated Base Quote</p>
              <div className="flex items-baseline gap-2">
                <span className="font-['Cinzel',serif] text-xl sm:text-2xl font-extrabold text-white">
                  ~{formatRWF(estPrice)}
                </span>
                <span className="text-[11px] text-[#998e7d]">({selectedTierConfig.label})</span>
              </div>
              <p className="text-[11px] text-[#86efac] mt-0.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Includes complimentary custom lettering & celebration candle
              </p>
            </div>

            <button
              type="submit"
              id="submit-custom-cake-whatsapp-btn"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#224b2b] via-[#2f663a] to-[#224b2b] hover:brightness-110 text-[#86efac] font-extrabold text-xs sm:text-sm transition-all shadow-lg active:scale-95 border border-[#3b7a48]"
            >
              <MessageCircle className="w-4 h-4 text-[#4ade80]" />
              <span>Send WhatsApp Cake Inquiry</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
