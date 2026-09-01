import React, { useState } from 'react';
import { 
  Instagram, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  ChevronDown, 
  ShieldCheck, 
  Sparkles,
  Heart,
  Cake
} from 'lucide-react';
import { STORE_INFO, FAQS } from '../data/menuData';
import { getSafeImageUrl, handleImageError, FALLBACK_CAKE_IMAGE } from '../utils/imageUtils';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <footer className="bg-[#0e0c0a] text-[#ddd4c5] border-t border-[#2d251a] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="font-['Cinzel',serif] text-xl sm:text-2xl font-bold text-white">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-[#8e8574] mt-1">
              Everything you need to know about ordering celebration cakes & pastries in Kigali.
            </p>
          </div>

          <div className="space-y-2.5">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl bg-[#16120e] border border-[#2f2518] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-[#1f1913] transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#d4af37] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-[#b8ada0] leading-relaxed border-t border-[#231b12] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Footer Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-[#241c13]">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#d4af37]/60">
                <img 
                  src={getSafeImageUrl('/images/tanuri_logo_1788298783175.jpg', FALLBACK_CAKE_IMAGE)} 
                  alt="Tanuri Pastries"
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, FALLBACK_CAKE_IMAGE)}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-['Cinzel',serif] text-lg font-bold text-white tracking-wider block">
                  TANURI PASTRIES
                </span>
                <span className="text-[10px] text-[#d4af37] uppercase tracking-widest font-semibold block">
                  Kigali • Artisanal Bakery
                </span>
              </div>
            </div>

            <p className="text-xs text-[#a69c8a] leading-relaxed">
              Baking exquisite celebration cakes, French viennoiserie, and gourmet pastries fresh daily in Kigali, Rwanda. 
            </p>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={STORE_INFO.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#1e1710] border border-[#3b2d1d] hover:border-[#d4af37] flex items-center justify-center text-[#d4af37] hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#1e1710] border border-[#3b2d1d] hover:border-[#4ade80] flex items-center justify-center text-[#4ade80] transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href={`tel:${STORE_INFO.phone}`}
                className="w-9 h-9 rounded-xl bg-[#1e1710] border border-[#3b2d1d] hover:border-[#d4af37] flex items-center justify-center text-[#d4af37] transition-all"
                aria-label="Phone"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-3">
            <h4 className="font-['Cinzel',serif] text-xs font-bold uppercase tracking-wider text-[#d4af37]">
              Our Kigali Boutiques
            </h4>
            <div className="space-y-3 text-xs text-[#b8ada0]">
              {STORE_INFO.locations.map((loc, i) => (
                <div key={i} className="space-y-0.5">
                  <p className="font-semibold text-white flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#d4af37]" /> {loc.name}
                  </p>
                  <p className="text-[11px] text-[#8e8574] pl-4">{loc.address}</p>
                  <p className="text-[10px] text-[#a89e8f] pl-4 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-[#d4af37]" /> {loc.hours}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Direct Contacts */}
          <div className="space-y-3">
            <h4 className="font-['Cinzel',serif] text-xs font-bold uppercase tracking-wider text-[#d4af37]">
              Direct Orders & Catering
            </h4>
            <div className="space-y-2 text-xs text-[#b8ada0]">
              <p>
                <span className="text-[#8e8574] block text-[10px]">Call / WhatsApp:</span>
                <a href={`tel:${STORE_INFO.phone}`} className="font-bold text-white hover:text-[#d4af37]">
                  {STORE_INFO.phoneDisplay}
                </a>
              </p>
              <p>
                <span className="text-[#8e8574] block text-[10px]">Instagram Profile:</span>
                <a href={STORE_INFO.instagramUrl} target="_blank" rel="noreferrer" className="text-[#d4af37] hover:underline">
                  {STORE_INFO.handle}
                </a>
              </p>
              <p>
                <span className="text-[#8e8574] block text-[10px]">MoMo Merchant Code:</span>
                <span className="font-mono text-white font-bold">{STORE_INFO.momoCode}</span>
              </p>
            </div>
          </div>

          {/* Quality Pledge */}
          <div className="space-y-3">
            <h4 className="font-['Cinzel',serif] text-xs font-bold uppercase tracking-wider text-[#d4af37]">
              Artisanal Quality Pledge
            </h4>
            <p className="text-xs text-[#9c907f] leading-relaxed">
              We never cut corners. All viennoiserie, sponge cakes, and fillings are made with 100% natural butter, fresh dairy cream, and pure fruit reductions in Kigali.
            </p>
            <div className="p-3 rounded-xl bg-[#19140f] border border-[#312619] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#86efac] shrink-0" />
              <span className="text-[11px] text-[#dcd4c5]">
                Certified Food Hygiene & Safety Guaranteed
              </span>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-[#1e1710] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#786c5a]">
          <p>© {new Date().getFullYear()} Tanuri Pastries Kigali. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                id="footer-checkin-link"
                className="text-[#9c907f] hover:text-[#d4af37] transition-colors text-xs"
              >
                Check In
              </button>
            )}
            <p className="flex items-center gap-1">
              <span>Crafted with love for Kigali</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};
