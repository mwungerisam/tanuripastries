import React from 'react';
import { 
  CheckCircle2, 
  X, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Clock, 
  Sparkles,
  ShoppingBag,
  Share2
} from 'lucide-react';
import { formatRWF } from '../utils/format';
import { STORE_INFO } from '../data/menuData';

interface OrderConfirmationModalProps {
  order: any | null;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#18140f] border border-[#3e3223] rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 text-[#ded6c7]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#241d15] text-[#8e8574] hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Success Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-[#1b3823] border border-[#2d5c3a] mx-auto flex items-center justify-center text-[#4ade80] shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="font-['Cinzel',serif] text-xl sm:text-2xl font-bold text-white">
            Order Confirmed!
          </h2>
          <p className="text-xs text-[#a69c8a]">
            Thank you, <span className="text-white font-semibold">{order.customerName}</span>! Your bakes are being prepared with love in our Kigali kitchen.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="p-4 rounded-2xl bg-[#1f1912] border border-[#382d1e] space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#2d2418]">
            <span className="text-[#8e8574]">Order Reference</span>
            <span className="font-mono font-bold text-[#d4af37]">#{order.orderNumber}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#8e8574]">Fulfillment</span>
            <span className="font-semibold text-white">
              {order.deliveryType === 'delivery' ? `🚗 Delivery to ${order.selectedZone?.name || 'Kigali'}` : '🏪 Pickup at Boutique'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#8e8574]">Estimated Time</span>
            <span className="font-semibold text-[#86efac] flex items-center gap-1">
              <Clock className="w-3 h-3" /> 35 - 50 mins
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#2d2418]">
            <span className="font-bold text-white">Total Paid / Due</span>
            <span className="font-['Cinzel',serif] text-sm font-extrabold text-[#d4af37]">
              {formatRWF(order.grandTotal)}
            </span>
          </div>
        </div>

        {/* MoMo payment details */}
        <div className="p-3.5 rounded-2xl bg-[#231b13] border border-[#483723] text-xs space-y-1">
          <p className="font-bold text-[#d4af37] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Mobile Money Payment:
          </p>
          <p className="text-[#c9bfb0]">
            Dial <span className="text-white font-mono font-bold">{STORE_INFO.momoCode}</span> to pay directly or pay on delivery.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <a
            href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(`Hello Tanuri Pastries! I just placed order #${order.orderNumber} for ${order.customerName}. Please confirm receipt!`)}`}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#204427] hover:bg-[#295732] text-[#86efac] font-bold text-xs sm:text-sm transition-all"
          >
            <MessageCircle className="w-4 h-4 text-[#4ade80]" />
            <span>Chat with Bakery on WhatsApp</span>
          </a>

          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-[#292218] hover:bg-[#382f22] text-[#f7f2e7] font-semibold text-xs sm:text-sm transition-all"
          >
            Back to Menu
          </button>
        </div>

      </div>
    </div>
  );
};
