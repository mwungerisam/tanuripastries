import React from 'react';
import { Star, CheckCircle2, Quote, Award } from 'lucide-react';
import { REVIEWS } from '../data/menuData';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-12 bg-[#16120e] border-t border-[#292218]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#201912] border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Kigali Customer Experiences</span>
          </div>
          <h2 className="font-['Cinzel',serif] text-2xl sm:text-3xl font-bold text-white">
            Loved Across Kigali Homes & Celebrations
          </h2>
          <p className="text-xs sm:text-sm text-[#a69c8a] mt-1.5">
            Real feedback from birthdays, anniversaries, office mornings, and special events.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-[#1b1610] border border-[#362b1d] flex flex-col justify-between space-y-4 hover:border-[#d4af37]/40 transition-colors"
            >
              <div className="space-y-2.5">
                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
                  ))}
                  <span className="text-[10px] text-[#8e8574] ml-1">{rev.date}</span>
                </div>

                <p className="text-xs text-[#dcd4c6] leading-relaxed italic">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#2a2116]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-white flex items-center gap-1">
                      <span>{rev.author}</span>
                      {rev.verified && <CheckCircle2 className="w-3 h-3 text-[#86efac]" />}
                    </h4>
                    <p className="text-[10px] text-[#8e8574]">{rev.location}</p>
                  </div>
                </div>
                <p className="text-[10px] text-[#d4af37] font-medium mt-1 truncate">
                  Ordered: {rev.itemOrdered}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
