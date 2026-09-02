import React from 'react';
import { Instagram, Heart, MessageCircle, ExternalLink, Sparkles } from 'lucide-react';
import { STORE_INFO, INSTAGRAM_POSTS } from '../data/menuData';
import { getSafeImageUrl, handleImageError, FALLBACK_CAKE_IMAGE } from '../utils/imageUtils';

export const InstagramShowcase: React.FC = () => {
  return (
    <section className="py-12 bg-[#120f0c] border-t border-[#292218]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#201911] border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold mb-2">
              <Instagram className="w-3.5 h-3.5" />
              <span>{STORE_INFO.handle}</span>
            </div>
            <h2 className="font-['Cinzel',serif] text-2xl sm:text-3xl font-bold text-white">
              Fresh From Our Ovens & Instagram
            </h2>
            <p className="text-xs sm:text-sm text-[#a69c8a] mt-1">
              Explore our daily cake creations, happy Kigali celebrations, and morning bakery updates.
            </p>
          </div>

          <a
            href={STORE_INFO.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#201912] border border-[#443623] hover:border-[#d4af37] text-[#e8e0d0] hover:text-white text-xs font-bold transition-all shrink-0"
          >
            <Instagram className="w-4 h-4 text-[#d4af37]" />
            <span>Follow {STORE_INFO.handle}</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#8e8574]" />
          </a>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INSTAGRAM_POSTS.map((post) => (
            <a
              key={post.id}
              href={STORE_INFO.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="group relative rounded-2xl overflow-hidden bg-[#1a1510] border border-[#33281b] hover:border-[#d4af37]/60 transition-all duration-300 shadow-md flex flex-col"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-[#1f1912]">
                <img
                  src={getSafeImageUrl(post.image, FALLBACK_CAKE_IMAGE)}
                  alt={post.caption}
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, FALLBACK_CAKE_IMAGE)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
                
                {/* Hover overlay with likes and comments */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white text-sm font-bold md:backdrop-blur-[2px]">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-white" />
                    <span>{post.comments}</span>
                  </div>
                </div>

                <div className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 md:backdrop-blur-sm text-white">
                  <Instagram className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <p className="text-xs text-[#c9bfaf] line-clamp-2 leading-relaxed">
                  {post.caption}
                </p>
                <div className="mt-2.5 pt-2 border-t border-[#292015] flex items-center justify-between text-[10px] text-[#8e8574]">
                  <span>Tanuri Pastries Kigali</span>
                  <span className="text-[#d4af37] font-semibold flex items-center gap-0.5">
                    View Post <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
