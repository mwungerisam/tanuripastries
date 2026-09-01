import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Sparkles, 
  ChevronDown, 
  Clock, 
  Instagram,
  Cake,
  SlidersHorizontal,
  ShieldCheck
} from 'lucide-react';
import { STORE_INFO, DELIVERY_ZONES } from '../data/menuData';
import { DeliveryZone } from '../types';
import { formatRWF } from '../utils/format';
import { getSafeImageUrl, handleImageError, FALLBACK_CAKE_IMAGE } from '../utils/imageUtils';

interface HeaderProps {
  cartCount: number;
  cartSubtotal: number;
  onOpenCart: () => void;
  onOpenCustomCake: () => void;
  onOpenAdmin: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedZone: DeliveryZone;
  onSelectZone: (zone: DeliveryZone) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartSubtotal,
  onOpenCart,
  onOpenCustomCake,
  onOpenAdmin,
  searchQuery,
  onSearchChange,
  selectedZone,
  onSelectZone,
}) => {
  const [isZoneDropdownOpen, setIsZoneDropdownOpen] = useState(false);
  const [isSearchMobileOpen, setIsSearchMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#14120e]/95 backdrop-blur-md border-b border-[#2d271e] text-[#f8f5ee]">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-[#8b6528] via-[#d4af37] to-[#8b6528] text-[#120f0a] px-2.5 sm:px-4 py-1.5 text-xs font-semibold tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-700 animate-pulse shrink-0" />
            <span className="font-bold text-[11px] sm:text-xs truncate">Freshly Baked in Gacuriro & Gisozi</span>
            <span className="hidden sm:inline text-black/80 truncate">• Same-day Kigali Delivery in 35-50 mins</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 text-xs font-bold shrink-0">
            <button
              onClick={onOpenAdmin}
              id="header-checkin-link"
              className="text-[#120f0a] hover:text-black font-bold text-[11px] sm:text-xs transition-colors hover:underline shrink-0"
            >
              Check In
            </button>
            <a 
              href={`https://wa.me/${STORE_INFO.whatsappNumber}`} 
              target="_blank" 
              rel="noreferrer" 
              className="hidden sm:flex items-center gap-1 hover:underline transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: {STORE_INFO.phoneDisplay}</span>
            </a>
            <a 
              href={STORE_INFO.instagramUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="hidden md:flex items-center gap-1 hover:opacity-80 transition-all text-[#120f0a]"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>{STORE_INFO.handle}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <a href="#" className="flex items-center gap-2 sm:gap-3 group min-w-0">
              <div className="relative w-9 h-9 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-[#d4af37]/60 shadow-lg shadow-black/40 group-hover:border-[#d4af37] transition-all shrink-0">
                <img 
                  src={getSafeImageUrl('/images/tanuri_logo_1788298783175.jpg', FALLBACK_CAKE_IMAGE)} 
                  alt="Tanuri Pastries Kigali Logo"
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, FALLBACK_CAKE_IMAGE)}
                  className="w-full h-full object-cover scale-105"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1 sm:gap-1.5 truncate">
                  <span className="font-['Cinzel',serif] text-base sm:text-2xl font-bold tracking-wider text-[#fcf9f2] group-hover:text-[#d4af37] transition-colors truncate">
                    TANURI
                  </span>
                  <span className="font-['Cinzel',serif] text-[10px] sm:text-sm tracking-widest text-[#d4af37] font-semibold truncate">
                    PASTRIES
                  </span>
                </div>
                <span className="text-[9px] sm:text-xs text-[#a89f8e] tracking-wider uppercase font-medium flex items-center gap-1 truncate">
                  <span>Kigali</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">Artisanal Cakes & Bakes</span>
                </span>
              </div>
            </a>
          </div>

          {/* Location Delivery Selector */}
          <div className="hidden lg:relative lg:block">
            <button
              onClick={() => setIsZoneDropdownOpen(!isZoneDropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#1d1914] border border-[#383024] hover:border-[#d4af37]/50 text-xs text-[#e8e2d5] transition-all"
            >
              <div className="w-6 h-6 rounded-lg bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-[#8e8574] font-semibold">Delivering to</p>
                <p className="font-semibold text-white truncate max-w-[130px]">{selectedZone.name}</p>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#8e8574] transition-transform ${isZoneDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isZoneDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-[#1b1712] border border-[#3e3427] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-2.5 py-1.5 border-b border-[#2d261b] mb-1">
                  <p className="text-xs font-bold text-[#d4af37]">Select Kigali Delivery Location</p>
                  <p className="text-[11px] text-[#8e8574]">Accurate delivery fee and estimated time</p>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {DELIVERY_ZONES.map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => {
                        onSelectZone(zone);
                        setIsZoneDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-all ${
                        selectedZone.id === zone.id 
                          ? 'bg-[#d4af37]/20 border border-[#d4af37]/40 text-white font-bold' 
                          : 'hover:bg-[#252019] text-[#c9c1b3]'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-[#f5f0e6]">{zone.name}</p>
                        <p className="text-[10px] text-[#8e8574] flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> {zone.estMinutes}
                        </p>
                      </div>
                      <span className="font-semibold text-[#d4af37]">{formatRWF(zone.fee)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs xl:max-w-md mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e8574]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Belgian chocolate, Croissants, Bento cakes..."
                className="w-full bg-[#1c1813] border border-[#383023] rounded-xl pl-10 pr-4 py-2 text-xs text-[#f5f1e8] placeholder-[#7d7465] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8e8574] hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons: Custom Cake Builder & Cart */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Custom Cake CTA */}
            <button
              onClick={onOpenCustomCake}
              id="custom-cake-builder-header-btn"
              className="relative group flex items-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#99732b] via-[#c99f3b] to-[#99732b] text-[#120e09] font-bold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#c99f3b]/10 shrink-0"
            >
              <Cake className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden md:inline">Custom Cake Builder</span>
              <span className="hidden sm:inline md:hidden">Custom Cake</span>
              <span className="sm:hidden text-[11px]">Cake</span>
              <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded-full bg-red-600 text-white text-[8px] sm:text-[9px] font-extrabold uppercase animate-bounce">
                Hot
              </span>
            </button>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchMobileOpen(!isSearchMobileOpen)}
              className="md:hidden p-1.5 sm:p-2.5 rounded-xl bg-[#1d1914] border border-[#383024] text-[#c9c1b3] hover:text-white shrink-0"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              id="header-cart-btn"
              className="relative flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#231d16] border border-[#4a3e2c] hover:border-[#d4af37] text-white hover:bg-[#2d251c] transition-all active:scale-95 shadow-md shrink-0"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4af37] shrink-0" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 sm:min-w-5 sm:h-5 px-1 rounded-full bg-red-600 text-white text-[9px] sm:text-[11px] font-bold flex items-center justify-center animate-scale-in">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] uppercase tracking-wider text-[#8e8574] font-semibold leading-tight">My Basket</span>
                <span className="text-xs font-bold text-[#f8f5ee] leading-tight">
                  {cartSubtotal > 0 ? formatRWF(cartSubtotal) : '0 RWF'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Input Expanded */}
        {isSearchMobileOpen && (
          <div className="mt-3 pt-2 border-t border-[#29231a] md:hidden animate-in fade-in duration-150">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e8574]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search cakes, croissants, pastries..."
                className="w-full bg-[#1c1813] border border-[#383023] rounded-xl pl-9 pr-4 py-2 text-xs text-[#f5f1e8] placeholder-[#7d7465] focus:outline-none focus:border-[#d4af37]"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
