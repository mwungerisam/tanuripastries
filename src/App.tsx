import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CustomCakeBuilder } from './components/CustomCakeBuilder';
import { InstagramShowcase } from './components/InstagramShowcase';
import { ReviewsSection } from './components/ReviewsSection';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { PRODUCTS, DELIVERY_ZONES, STORE_INFO } from './data/menuData';
import { Product, CartItem, CartItemOption, DeliveryZone } from './types';
import { 
  Sparkles, 
  Cake, 
  MessageCircle, 
  Phone, 
  ShoppingBag, 
  ChevronRight,
  Search,
  FilterX,
  SlidersHorizontal
} from 'lucide-react';
import { formatRWF } from './utils/format';

export default function App() {
  // Live bakery catalog with localStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('tanuri_products_v1');
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  // Kigali delivery zones with persistence
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(() => {
    try {
      const saved = localStorage.getItem('tanuri_zones_v1');
      return saved ? JSON.parse(saved) : DELIVERY_ZONES;
    } catch {
      return DELIVERY_ZONES;
    }
  });

  // Store information with persistence
  const [storeInfo, setStoreInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('tanuri_store_v1');
      return saved ? JSON.parse(saved) : STORE_INFO;
    } catch {
      return STORE_INFO;
    }
  });

  // Cart state with localStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('tanuri_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCustomCakeOpen, setIsCustomCakeOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  // Filter and Search states
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedZone, setSelectedZone] = useState<DeliveryZone>(deliveryZones[0] || DELIVERY_ZONES[0]);

  // Persist products
  useEffect(() => {
    try {
      localStorage.setItem('tanuri_products_v1', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Persist delivery zones
  useEffect(() => {
    try {
      localStorage.setItem('tanuri_zones_v1', JSON.stringify(deliveryZones));
    } catch (e) {
      console.error(e);
    }
  }, [deliveryZones]);

  // Persist store info
  useEffect(() => {
    try {
      localStorage.setItem('tanuri_store_v1', JSON.stringify(storeInfo));
    } catch (e) {
      console.error(e);
    }
  }, [storeInfo]);

  // Save cart changes
  useEffect(() => {
    try {
      localStorage.setItem('tanuri_cart_v1', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Product CRUD Handlers for Admin
  const handleSaveProduct = (updatedProduct: Product) => {
    setProducts(prev => {
      const existsIndex = prev.findIndex(p => p.id === updatedProduct.id);
      if (existsIndex >= 0) {
        const next = [...prev];
        next[existsIndex] = updatedProduct;
        return next;
      } else {
        return [updatedProduct, ...prev];
      }
    });
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    // Also remove from active cart if present
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleResetProducts = () => {
    setProducts(PRODUCTS);
    try {
      localStorage.removeItem('tanuri_products_v1');
    } catch {}
  };

  const handleImportProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
  };

  // Cart Calculations
  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  }, [cartItems]);

  // Add item to cart
  const handleAddToCart = (
    product: Product,
    quantity: number,
    options: CartItemOption,
    unitPrice: number
  ) => {
    const newItem: CartItem = {
      id: `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      product,
      quantity,
      options,
      unitPrice,
      totalPrice: unitPrice * quantity,
    };
    setCartItems(prev => [...prev, newItem]);
    setIsCartOpen(true);
  };

  // Quick add default
  const handleQuickAdd = (product: Product) => {
    setSelectedProduct(product);
  };

  // Update item quantity in cart
  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty,
            }
          : item
      )
    );
  };

  // Remove single item from cart
  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Clear all cart
  const handleClearCart = () => {
    setCartItems([]);
  };

  // Toggle dietary filter
  const handleToggleDietary = (diet: string) => {
    setSelectedDietary(prev =>
      prev.includes(diet) ? prev.filter(d => d !== diet) : [...prev, diet]
    );
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products.filter(prod => {
      // Category filter
      if (activeCategory !== 'all' && prod.category !== activeCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(query);
        const matchesDesc = prod.description.toLowerCase().includes(query);
        const matchesTags = prod.tags?.some(t => t.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesTags) {
          return false;
        }
      }
      // Dietary filter
      if (selectedDietary.length > 0) {
        const matchesAllDiet = selectedDietary.every(d =>
          prod.dietary?.includes(d as any)
        );
        if (!matchesAllDiet) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      // Default: popular
      return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    });
  }, [products, activeCategory, searchQuery, selectedDietary, sortBy]);

  const scrollToMenu = () => {
    const menuElem = document.getElementById('menu-section');
    if (menuElem) {
      menuElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0e0c] text-[#f5f1e8] flex flex-col selection:bg-[#d4af37] selection:text-black">
      
      {/* Header */}
      <Header
        cartCount={cartCount}
        cartSubtotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCustomCake={() => setIsCustomCakeOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedZone={selectedZone}
        onSelectZone={setSelectedZone}
      />

      {/* Hero Banner Section */}
      <HeroBanner
        onExploreMenu={scrollToMenu}
        onOpenCustomCake={() => setIsCustomCakeOpen(true)}
      />

      {/* Sticky Categories & Dietary Filter */}
      <div id="menu-section">
        <CategoryFilter
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          selectedDietary={selectedDietary}
          onToggleDietary={handleToggleDietary}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      {/* Main Product Catalog Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Section Title & Results Counter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="font-['Cinzel',serif] text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>Fresh Bakes & Specialties</span>
              <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-[#292218] text-[#d4af37] border border-[#3e3223]">
                {filteredProducts.length} Items Available
              </span>
            </h2>
            <p className="text-xs text-[#8e8574] mt-0.5">
              Select any cake or pastry to choose custom portion size, sponge flavors, and complimentary birthday messages.
            </p>
          </div>

          {/* Quick Clear filters */}
          {(searchQuery || selectedDietary.length > 0 || activeCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDietary([]);
                setActiveCategory('all');
              }}
              className="flex items-center gap-1.5 text-xs text-[#d4af37] hover:underline"
            >
              <FilterX className="w-3.5 h-3.5" />
              <span>Reset all filters</span>
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-4 rounded-3xl bg-[#17130f] border border-[#2d2417] p-8">
            <div className="w-14 h-14 rounded-2xl bg-[#241c14] border border-[#3a2e1d] mx-auto flex items-center justify-center text-[#d4af37]">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-['Cinzel',serif] text-lg font-bold text-white">
              No matching delicacies found
            </h3>
            <p className="text-xs text-[#8e8574] max-w-sm mx-auto">
              Try adjusting your search terms or dietary filters to explore our full Kigali cake catalog.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDietary([]);
                setActiveCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-[#d4af37] text-black font-bold text-xs"
            >
              Show All Bakes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={setSelectedProduct}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>
        )}

        {/* Custom Celebration Cake Callout Banner */}
        <div className="mt-14 rounded-3xl overflow-hidden border border-[#443624] bg-gradient-to-r from-[#1c1711] via-[#241c14] to-[#1c1711] p-6 sm:p-8 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 z-10 relative">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#302416] border border-[#d4af37]/40 text-[#d4af37] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Special Occasion in Kigali?</span>
              </div>
              <h3 className="font-['Cinzel',serif] text-2xl sm:text-3xl font-bold text-white">
                Design Your Dream Celebration Cake
              </h3>
              <p className="text-xs sm:text-sm text-[#b8ad9c] max-w-xl">
                Have a specific theme, photo reference, wedding tier, or flavor combination? Use our custom cake designer or chat directly with our pastry chef on WhatsApp!
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsCustomCakeOpen(true)}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#b38930] via-[#d4af37] to-[#b38930] text-black font-bold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg"
              >
                <Cake className="w-4 h-4" />
                <span>Launch Cake Designer</span>
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* Instagram Community Showcase */}
      <InstagramShowcase />

      {/* Customer Reviews */}
      <ReviewsSection />

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Admin Panel Modal */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetProducts={handleResetProducts}
        onImportProducts={handleImportProducts}
        deliveryZones={deliveryZones}
        onUpdateDeliveryZones={(newZones) => setDeliveryZones(newZones)}
        storeInfo={storeInfo}
        onUpdateStoreInfo={(newInfo) => setStoreInfo(newInfo)}
      />

      {/* Sticky Mobile Floating Cart bar */}
      {cartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-4 right-4 z-30 sm:hidden animate-in slide-in-from-bottom-3">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[#b38930] via-[#d4af37] to-[#b38930] text-[#120f0a] font-extrabold shadow-2xl active:scale-95 transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold">
                {cartCount}
              </span>
              <span className="text-xs uppercase tracking-wider">View Basket</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-black">
              <span>{formatRWF(cartSubtotal)}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent('Hello Tanuri Pastries Kigali! I would like to order fresh cakes or pastries.')}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-30 flex items-center gap-2 p-3.5 sm:px-4 sm:py-3 rounded-full bg-[#1b4324] hover:bg-[#23572f] border border-[#3b7a48] text-[#86efac] shadow-2xl hover:scale-105 active:scale-95 transition-all group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 text-[#4ade80]" />
        <span className="hidden sm:inline text-xs font-bold text-white group-hover:text-[#86efac]">
          WhatsApp 0796 607 142
        </span>
      </a>

      {/* Product Customization Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        selectedZone={selectedZone}
        onSelectZone={setSelectedZone}
        onPlaceOrder={(orderDetails) => {
          setCompletedOrder(orderDetails);
          setIsCartOpen(false);
          setCartItems([]);
        }}
      />

      {/* Custom Cake Builder Modal */}
      <CustomCakeBuilder
        isOpen={isCustomCakeOpen}
        onClose={() => setIsCustomCakeOpen(false)}
      />

      {/* Order Confirmation Receipt Modal */}
      <OrderConfirmationModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
      />

    </div>
  );
}
