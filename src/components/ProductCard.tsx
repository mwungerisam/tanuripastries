import React from 'react';
import { 
  Star, 
  Clock, 
  Plus, 
  Sparkles, 
  Eye, 
  Cake, 
  ShieldCheck 
} from 'lucide-react';
import { Product } from '../types';
import { formatRWF } from '../utils/format';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onQuickAdd,
}) => {
  return (
    <div className="group relative rounded-2xl bg-[#171410] border border-[#332b1f] hover:border-[#d4af37]/70 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:shadow-xl hover:shadow-[#d4af37]/5">
      
      {/* Product Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1f1a14] cursor-pointer" onClick={() => onSelectProduct(product)}>
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Subtle Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#171410] via-transparent to-black/30 opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[80%] z-10">
          {product.tags.slice(0, 2).map((tag, i) => (
            <span
              key={i}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase ${
                tag.toLowerCase().includes('seller') || tag.toLowerCase().includes('signature')
                  ? 'bg-[#d4af37] text-black shadow-sm'
                  : 'bg-[#1b1712]/90 backdrop-blur-md text-[#e6decb] border border-[#443827]'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Prep Time pill */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#120f0c]/85 backdrop-blur-md text-[10px] text-[#c9bfb0] border border-[#2d2417]">
          <Clock className="w-3 h-3 text-[#d4af37]" />
          <span>{product.prepTime}</span>
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#d4af37] text-black text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Customize & Order</span>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Rating & Reviews */}
          <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
            <div className="flex items-center gap-1 text-[#d4af37]">
              <Star className="w-3.5 h-3.5 fill-[#d4af37]" />
              <span className="font-bold text-[#f5f1e8] text-xs">{product.rating}</span>
              <span className="text-[#8e8574] text-[11px]">({product.reviewsCount})</span>
            </div>
            
            {product.supportsCustomMessage && (
              <span className="text-[10px] font-semibold text-[#86efac] flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" /> Free Custom Text
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onSelectProduct(product)}
            className="font-['Cinzel',serif] text-sm sm:text-base font-bold text-[#fcf9f2] group-hover:text-[#d4af37] transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Description */}
          <p className="mt-1.5 text-xs text-[#a89e8e] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Bottom Price & Add to Cart */}
        <div className="mt-4 pt-3 border-t border-[#292217] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-[#8e8574] block">Price</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-extrabold text-[#f3ece0]">
                {formatRWF(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-[11px] text-[#736a5c] line-through">
                  {formatRWF(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => onSelectProduct(product)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2b241a] hover:bg-[#d4af37] text-[#f7f2e7] hover:text-black border border-[#453826] hover:border-[#d4af37] text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm"
          >
            <span>Customize</span>
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
