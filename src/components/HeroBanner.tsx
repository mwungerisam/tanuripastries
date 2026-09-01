import React from 'react';
import { 
  Sparkles, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Star, 
  Cake, 
  ArrowRight, 
  MessageCircle,
  Award
} from 'lucide-react';
import { STORE_INFO } from '../data/menuData';
import { getSafeImageUrl, handleImageError } from '../utils/imageUtils';

interface HeroBannerProps {
  onExploreMenu: () => void;
  onOpenCustomCake: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreMenu,
  onOpenCustomCake,
}) => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#14120e] via-[#1a1611] to-[#0f0e0c] pt-4 pb-10 border-b border-[#2d271e]">
      {/* Background Subtle Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#c99f3b]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Card */}
        <div className="relative rounded-3xl overflow-hidden border border-[#3e3425] bg-[#1a1611] shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 p-6 sm:p-8 md:p-12 flex flex-col justify-between z-10">
              
              <div>
                {/* Micro Tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2d2417] border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold mb-4 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Kigali’s Premier Boutique Pastry House</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                  <span className="text-[#f5f1e8] font-normal">Gacuriro & Gisozi</span>
                </div>

                {/* Main Headline */}
                <h1 className="font-['Cinzel',serif] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#fdfaf3] tracking-tight leading-[1.15]">
                  Artisanal Celebration Cakes & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f3e198] to-[#b88c29]">Gourmet Pastries</span>
                </h1>

                {/* Subtitle */}
                <p className="mt-4 text-[#c7beaf] text-sm sm:text-base leading-relaxed max-w-xl">
                  Handcrafted with pure French butter, Belgian Valrhona chocolate, and fresh Rwandan fruits. From bespoke birthday celebration cakes to 81-layer flaky croissants delivered warm to your doorstep in Kigali.
                </p>

                {/* Key Badges */}
                <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-[#ded7c8]">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#251f17] border border-[#3d3323]">
                    <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>35–50 Mins Fast Kigali Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#251f17] border border-[#3d3323]">
                    <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>100% Real Butter & Natural Cocoa</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#251f17] border border-[#3d3323]">
                    <Star className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37]" />
                    <span>4.98 Rating (380+ Reviews)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={onExploreMenu}
                  id="hero-explore-menu-btn"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#b38930] via-[#d4af37] to-[#b38930] text-[#120f0a] font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#d4af37]/20"
                >
                  <span>Explore Menu & Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenCustomCake}
                  id="hero-custom-cake-btn"
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#251f17] border border-[#524430] hover:border-[#d4af37] text-[#f7f3ea] font-semibold text-sm hover:bg-[#2e261d] transition-all"
                >
                  <Cake className="w-4 h-4 text-[#d4af37]" />
                  <span>Design Custom Cake</span>
                </button>

                <a
                  href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent('Hello Tanuri Pastries Kigali! I would like to inquire about ordering cakes/pastries today.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-[#1e2e21] border border-[#2d5234] text-[#86efac] hover:bg-[#253929] text-sm font-semibold transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-[#4ade80]" />
                  <span className="hidden xl:inline">WhatsApp Us</span>
                </a>
              </div>

            </div>

            {/* Right Visual Column with Generated High-Res Pastry Display */}
            <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
              <div className="relative w-full h-full">
                <img 
                  src={getSafeImageUrl('/images/tanuri_hero_banner_1788298801678.jpg')} 
                  alt="Tanuri Pastries Kigali Artisanal Cake and Pastry Display"
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, '/images/tanuri_cake_chocolate_1788298831775.jpg')}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#1a1611] via-transparent to-transparent opacity-90 lg:opacity-70" />
                
                {/* Floating Social Badge on Photo */}
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-[#14110cd9]/90 backdrop-blur-md border border-[#4d3e27] rounded-2xl p-3 shadow-xl max-w-[220px]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
                      <Cake className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-white leading-tight">Same-Day Cakes</p>
                      <p className="text-[10px] text-[#c0b7a7] leading-tight">Ready in 2 hours for instant delivery</p>
                    </div>
                  </div>
                </div>

                {/* Floating Gacuriro & Gisozi Tag */}
                <div className="absolute top-4 right-4 bg-[#14110ce0]/85 backdrop-blur-md border border-[#3e3323] px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs text-[#e8e2d5]">
                  <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span className="font-semibold text-white">Gacuriro • Gisozi</span>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
