import React from 'react';
import { 
  Sparkles, 
  Cake, 
  Cookie, 
  Gift, 
  Sandwich, 
  SlidersHorizontal,
  Flame,
  Check
} from 'lucide-react';
import { CATEGORIES } from '../data/menuData';

interface CategoryFilterProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  selectedDietary: string[];
  onToggleDietary: (diet: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
  selectedDietary,
  onToggleDietary,
  sortBy,
  onSortChange,
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />;
      case 'Cake':
        return <Cake className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />;
      case 'Cookie':
        return <Cookie className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />;
      case 'Gift':
        return <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />;
      case 'Sandwich':
        return <Sandwich className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />;
      default:
        return <Cake className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />;
    }
  };

  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'eggless', label: 'Eggless Options' },
    { id: 'nut-free', label: 'Nut-Free' },
    { id: 'gluten-free', label: 'Gluten-Free' },
  ];

  return (
    <div className="w-full bg-[#14120e] md:bg-[#14120e]/95 py-3 sm:py-4 border-b border-[#29231a] sticky top-[50px] sm:top-[69px] z-30 md:backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 space-y-2.5 sm:space-y-3">
        
        {/* Main Category Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none w-full max-w-full">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                id={`category-tab-${cat.id}`}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#b88c29] text-[#120f0a] shadow-lg shadow-[#d4af37]/20 font-bold'
                    : 'bg-[#1e1914] text-[#c9c1b3] hover:text-white hover:bg-[#28221b] border border-[#382f22]'
                }`}
              >
                <span>{getCategoryIcon(cat.icon)}</span>
                <span>{cat.name}</span>
                <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-[#120f0a]/20 text-[#120f0a]' : 'bg-[#2b241a] text-[#8e8574]'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dietary Filters & Sorting bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          
          {/* Dietary Tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[#8e8574] font-medium mr-1 text-[11px] uppercase tracking-wider">Filters:</span>
            {dietaryOptions.map((diet) => {
              const isChecked = selectedDietary.includes(diet.id);
              return (
                <button
                  key={diet.id}
                  onClick={() => onToggleDietary(diet.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-all ${
                    isChecked
                      ? 'bg-[#d4af37]/20 border border-[#d4af37] text-[#f7eed4] font-semibold'
                      : 'bg-[#1a1611] border border-[#332b1f] text-[#a39a89] hover:text-white hover:border-[#4d3f2c]'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 text-[#d4af37]" />}
                  <span>{diet.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#8e8574]" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-[#1b1712] border border-[#382f22] text-[#dcd5c7] text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#d4af37] cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated (4.9+)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

        </div>

      </div>
    </div>
  );
};
