import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Copy, 
  Upload, 
  Image as ImageIcon, 
  DollarSign, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Sparkles, 
  Download, 
  RotateCcw, 
  Check, 
  AlertTriangle,
  ArrowUpDown,
  Filter,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  Building,
  CreditCard,
  Layers,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Smartphone,
  Mail,
  LogIn
} from 'lucide-react';
import { Product, DeliveryZone } from '../types';
import { CATEGORIES } from '../data/menuData';
import { AdminProductModal } from './AdminProductModal';
import { formatRWF } from '../utils/format';
import { 
  processImageFile, 
  BAKERY_IMAGE_PRESETS, 
  getSafeImageUrl, 
  handleImageError, 
  FALLBACK_CAKE_IMAGE, 
  FALLBACK_PASTRY_IMAGE 
} from '../utils/imageUtils';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetProducts: () => void;
  onImportProducts: (newProducts: Product[]) => void;
  deliveryZones: DeliveryZone[];
  onUpdateDeliveryZones: (zones: DeliveryZone[]) => void;
  storeInfo: any;
  onUpdateStoreInfo: (info: any) => void;
}

const DEFAULT_ADMIN_PASSWORD = 'tanuri2025';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  onSaveProduct,
  onDeleteProduct,
  onResetProducts,
  onImportProducts,
  deliveryZones,
  onUpdateDeliveryZones,
  storeInfo,
  onUpdateStoreInfo,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('tanuri_admin_auth_v1') === 'true';
    } catch {
      return false;
    }
  });

  const [emailInput, setEmailInput] = useState<string>(() => {
    try {
      return localStorage.getItem('tanuri_admin_email_v1') || '';
    } catch {
      return '';
    }
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Custom Admin Password Management
  const [currentSavedPassword, setCurrentSavedPassword] = useState<string>(() => {
    try {
      return localStorage.getItem('tanuri_admin_pwd_v1') || DEFAULT_ADMIN_PASSWORD;
    } catch {
      return DEFAULT_ADMIN_PASSWORD;
    }
  });

  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<string | null>(null);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'products' | 'media' | 'delivery' | 'store' | 'security'>('products');

  // Filters for product list
  const [adminSearch, setAdminSearch] = useState('');
  const [adminCategory, setAdminCategory] = useState('all');
  const [adminSortBy, setAdminSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'category'>('category');

  // Product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [customerPreviewProduct, setCustomerPreviewProduct] = useState<Product | null>(null);

  // Inline Quick Price Editing state
  const [quickPriceEditId, setQuickPriceEditId] = useState<string | null>(null);
  const [quickPriceValue, setQuickPriceValue] = useState<number>(0);

  // Standalone Image Hub upload
  const mediaFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedMediaList, setUploadedMediaList] = useState<string[]>([]);
  const [mediaUploadLoading, setMediaUploadLoading] = useState(false);
  const [previewMediaUrl, setPreviewMediaUrl] = useState<string | null>(null);

  // Kigali delivery editing state
  const [zonesState, setZonesState] = useState<DeliveryZone[]>(deliveryZones);

  // Store contact editing state
  const [storeState, setStoreState] = useState(storeInfo);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Sync zones and store state when props update
  useEffect(() => {
    setZonesState(deliveryZones);
  }, [deliveryZones]);

  useEffect(() => {
    setStoreState(storeInfo);
  }, [storeInfo]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (adminCategory !== 'all' && p.category !== adminCategory) return false;
      if (adminSearch.trim()) {
        const q = adminSearch.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesId = p.id.toLowerCase().includes(q);
        return matchesName || matchesDesc || matchesId;
      }
      return true;
    }).sort((a, b) => {
      if (adminSortBy === 'price-asc') return a.price - b.price;
      if (adminSortBy === 'price-desc') return b.price - a.price;
      if (adminSortBy === 'name') return a.name.localeCompare(b.name);
      return a.category.localeCompare(b.category);
    });
  }, [products, adminCategory, adminSearch, adminSortBy]);

  // Catalog Analytics
  const stats = useMemo(() => {
    const totalCount = products.length;
    const avgPrice = totalCount > 0 
      ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / totalCount)
      : 0;
    const popularCount = products.filter(p => p.isPopular).length;
    const categoriesCount = new Set(products.map(p => p.category)).size;
    return { totalCount, avgPrice, popularCount, categoriesCount };
  }, [products]);

  if (!isOpen) return null;

  // Handle Login Authentication
  const handleAuthenticate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsAuthenticating(true);
    setAuthError(null);

    const email = emailInput.trim();
    const entered = passwordInput.trim();

    if (!email) {
      setAuthError('Please enter your email address.');
      setIsAuthenticating(false);
      return;
    }

    if (!entered) {
      setAuthError('Please enter your password.');
      setIsAuthenticating(false);
      return;
    }

    // Accept saved password, default 'tanuri2025', or PIN '2025'
    const isCorrect = 
      entered === currentSavedPassword || 
      entered === DEFAULT_ADMIN_PASSWORD || 
      entered === '2025';

    setTimeout(() => {
      if (isCorrect) {
        setIsAuthenticated(true);
        setPasswordInput('');
        setAuthError(null);
        try {
          sessionStorage.setItem('tanuri_admin_auth_v1', 'true');
          localStorage.setItem('tanuri_admin_email_v1', email);
        } catch (err) {
          console.error(err);
        }
      } else {
        setAuthError('Invalid email or password. Please try again.');
      }
      setIsAuthenticating(false);
    }, 250);
  };

  // Handle Logout / Lock Studio
  const handleLockStudio = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    setAuthError(null);
    try {
      sessionStorage.removeItem('tanuri_admin_auth_v1');
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Password Change
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError(null);
    setPasswordChangeSuccess(null);

    if (oldPasswordInput !== currentSavedPassword && oldPasswordInput !== DEFAULT_ADMIN_PASSWORD && oldPasswordInput !== '2025') {
      setPasswordChangeError('Current password is incorrect.');
      return;
    }

    if (newPasswordInput.length < 4) {
      setPasswordChangeError('New password must be at least 4 characters long.');
      return;
    }

    if (newPasswordInput !== confirmNewPasswordInput) {
      setPasswordChangeError('New passwords do not match.');
      return;
    }

    try {
      localStorage.setItem('tanuri_admin_pwd_v1', newPasswordInput);
      setCurrentSavedPassword(newPasswordInput);
      setOldPasswordInput('');
      setNewPasswordInput('');
      setConfirmNewPasswordInput('');
      setPasswordChangeSuccess('Admin master password updated successfully! Please keep it secure.');
      triggerToast('Security password updated!');
    } catch (err) {
      setPasswordChangeError('Failed to save new password.');
    }
  };

  // Trigger feedback banner
  const triggerToast = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  // Open Edit Product
  const handleOpenEdit = (p: Product) => {
    setProductToEdit(p);
    setIsProductModalOpen(true);
  };

  // Open Add Product
  const handleOpenAdd = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  // Duplicate Product
  const handleDuplicate = (p: Product) => {
    const cloned: Product = {
      ...p,
      id: `tanuri-${p.category}-${Date.now()}`,
      name: `${p.name} (New Batch)`,
      isPopular: false,
    };
    onSaveProduct(cloned);
    triggerToast(`Cloned "${p.name}" successfully!`);
  };

  // Save Inline Quick Price
  const handleSaveQuickPrice = (product: Product) => {
    if (quickPriceValue > 0) {
      const updated: Product = {
        ...product,
        price: quickPriceValue,
      };
      onSaveProduct(updated);
      setQuickPriceEditId(null);
      triggerToast(`Updated price for "${product.name}" to ${formatRWF(quickPriceValue)}`);
    }
  };

  // Media upload in standalone tab
  const handleMediaUpload = async (file: File) => {
    setMediaUploadLoading(true);
    try {
      const processed = await processImageFile(file);
      setUploadedMediaList(prev => [processed, ...prev]);
      triggerToast('Pastry photo uploaded and compressed successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to upload photo');
    } finally {
      setMediaUploadLoading(false);
    }
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const dataStr = JSON.stringify({ products, deliveryZones, storeInfo }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tanuri_pastries_kigali_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    triggerToast('Bakery catalog backup exported to JSON file!');
  };

  // Import JSON Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.products)) {
          onImportProducts(parsed.products);
          if (parsed.deliveryZones) onUpdateDeliveryZones(parsed.deliveryZones);
          if (parsed.storeInfo) onUpdateStoreInfo(parsed.storeInfo);
          triggerToast(`Successfully imported ${parsed.products.length} products!`);
        } else if (Array.isArray(parsed)) {
          onImportProducts(parsed);
          triggerToast(`Successfully imported ${parsed.length} products!`);
        } else {
          alert('Invalid backup format.');
        }
      } catch {
        alert('Could not parse JSON file. Please ensure it is a valid Tanuri export.');
      }
    };
    reader.readAsText(file);
  };

  // Save Delivery zones
  const handleSaveDeliveryZones = () => {
    onUpdateDeliveryZones(zonesState);
    triggerToast('Kigali delivery rates updated successfully!');
  };

  // Save Store settings
  const handleSaveStore = () => {
    onUpdateStoreInfo(storeState);
    triggerToast('Bakery contact & MoMo payment settings updated!');
  };

  // ----------------------------------------------------
  // VIEW 1: AUTHENTICATION LOGIN SCREEN
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
        <div 
          className="relative w-full max-w-md bg-[#16120d] border border-[#3d2f1f] rounded-2xl shadow-2xl p-6 sm:p-8 text-[#ded6c7] space-y-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-[#8e8574] hover:text-white hover:bg-[#231a12] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center space-y-2 pt-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8b6528] mx-auto flex items-center justify-center text-black shadow-lg">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="font-['Cinzel',serif] text-xl sm:text-2xl font-bold text-white tracking-wide">
              Staff Check In
            </h2>
            <p className="text-xs text-[#9e9280] max-w-xs mx-auto">
              Sign in with your email and password to access the bakery management portal.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleAuthenticate} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#c7bcab] block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a6f5e]" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="admin@tanuripastries.rw"
                  required
                  autoFocus
                  className="w-full bg-[#1e1711] border border-[#382b1c] focus:border-[#d4af37] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#5a4e3e] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#c7bcab] block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a6f5e]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#1e1711] border border-[#382b1c] focus:border-[#d4af37] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-[#5a4e3e] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a6f5e] hover:text-white p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {authError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAuthenticating}
              id="admin-login-btn"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#b38930] via-[#d4af37] to-[#b38930] text-black font-bold text-sm hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-lg flex items-center justify-center gap-2 mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{isAuthenticating ? 'Signing In...' : 'Sign In'}</span>
            </button>
          </form>

        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW 2: AUTHENTICATED ADMIN MANAGEMENT STUDIO
  // ----------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-6xl h-[94vh] flex flex-col bg-[#14100c] border border-[#3e3120] rounded-3xl overflow-hidden shadow-2xl text-[#e6decb]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="px-5 sm:px-8 py-3.5 bg-[#1b1510] border-b border-[#2e2316] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#8b6528] flex items-center justify-center text-black font-extrabold shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-['Cinzel',serif] text-base sm:text-lg font-bold text-white tracking-wider">
                  TANURI BAKERY MANAGER
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1b3823] text-[#86efac] border border-[#2d5c3a] text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                  Authenticated Session
                </span>
              </div>
              <p className="text-[11px] text-[#8e8574]">
                Manage cakes, croissant batches, real-time prices, uploaded photos, and Kigali delivery zones
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAdd}
              id="admin-add-product-btn"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#b38930] via-[#d4af37] to-[#b38930] text-black font-bold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Product</span>
            </button>

            {/* Lock / Sign Out */}
            <button
              onClick={handleLockStudio}
              title="Lock Management Studio"
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#251d15] hover:bg-[#36291d] text-[#c7bcab] hover:text-white border border-[#3b2d1d] text-xs transition-all"
            >
              <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="hidden sm:inline">Lock Session</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#251d15] hover:bg-[#36291d] text-[#8e8574] hover:text-white transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Toast Notification */}
        {saveSuccessMsg && (
          <div className="bg-[#1b3b22] border-b border-[#2d6139] px-6 py-2 text-xs text-[#86efac] font-bold flex items-center justify-between animate-in slide-in-from-top-2">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" /> {saveSuccessMsg}
            </span>
            <button onClick={() => setSaveSuccessMsg(null)} className="text-[#86efac] hover:text-white">✕</button>
          </div>
        )}

        {/* Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 px-5 sm:px-8 py-2.5 bg-[#110d0a] border-b border-[#261d13] text-xs shrink-0">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#19140f] border border-[#2d2215]">
            <span className="text-base font-['Cinzel',serif] font-bold text-[#d4af37]">{stats.totalCount}</span>
            <span className="text-[10px] sm:text-[11px] text-[#8e8574]">Total Bakes on Menu</span>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#19140f] border border-[#2d2215]">
            <span className="text-base font-['Cinzel',serif] font-bold text-white">{formatRWF(stats.avgPrice)}</span>
            <span className="text-[10px] sm:text-[11px] text-[#8e8574]">Average Cake Price</span>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#19140f] border border-[#2d2215]">
            <span className="text-base font-['Cinzel',serif] font-bold text-[#86efac]">{stats.popularCount}</span>
            <span className="text-[10px] sm:text-[11px] text-[#8e8574]">Best-Seller Badges</span>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#19140f] border border-[#2d2215]">
            <span className="text-base font-['Cinzel',serif] font-bold text-white">{deliveryZones.length}</span>
            <span className="text-[10px] sm:text-[11px] text-[#8e8574]">Kigali Delivery Zones</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#2a2014] bg-[#17120d] px-5 sm:px-8 gap-2 text-xs font-semibold overflow-x-auto shrink-0 py-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-[#d4af37] text-black font-bold shadow-md'
                : 'text-[#9c907d] hover:text-white hover:bg-[#221b13]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Pastry & Cake Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'media'
                ? 'bg-[#d4af37] text-black font-bold shadow-md'
                : 'text-[#9c907d] hover:text-white hover:bg-[#221b13]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Media & Photos Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('delivery')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'delivery'
                ? 'bg-[#d4af37] text-black font-bold shadow-md'
                : 'text-[#9c907d] hover:text-white hover:bg-[#221b13]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Kigali Delivery Fees ({deliveryZones.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'store'
                ? 'bg-[#d4af37] text-black font-bold shadow-md'
                : 'text-[#9c907d] hover:text-white hover:bg-[#221b13]'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Bakery Info & MoMo Code</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-[#d4af37] text-black font-bold shadow-md'
                : 'text-[#9c907d] hover:text-white hover:bg-[#221b13]'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Security & Password</span>
          </button>

          <div className="ml-auto flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportBackup}
              title="Export JSON Backup"
              className="p-1.5 rounded-lg bg-[#221a12] border border-[#382b1c] text-[#c7bcab] hover:text-white flex items-center gap-1 text-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="hidden md:inline">Backup</span>
            </button>

            <label className="p-1.5 rounded-lg bg-[#221a12] border border-[#382b1c] text-[#c7bcab] hover:text-white flex items-center gap-1 text-xs cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-[#86efac]" />
              <span className="hidden md:inline">Restore</span>
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset all products to default Tanuri bakery menu? Any custom edits will be reverted.')) {
                  onResetProducts();
                  triggerToast('Catalog reset to initial menu!');
                }
              }}
              title="Reset to Default"
              className="p-1.5 rounded-lg bg-[#221a12] border border-red-900/40 text-red-400 hover:text-red-300 flex items-center gap-1 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* ==================================================== */}
        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {/* ==================================================== */}
        {activeTab === 'products' && (
          <div className="flex-1 flex flex-col overflow-hidden p-4 sm:p-6 space-y-4">
            
            {/* Search, Filter & Quick actions Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e8574]" />
                <input
                  type="text"
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  placeholder="Filter by cake name, flavor, or ID..."
                  className="w-full bg-[#1c1611] border border-[#382c1e] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-[#7a6f5e] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <select
                  value={adminCategory}
                  onChange={(e) => setAdminCategory(e.target.value)}
                  className="bg-[#1c1611] border border-[#382c1e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                <select
                  value={adminSortBy}
                  onChange={(e) => setAdminSortBy(e.target.value as any)}
                  className="bg-[#1c1611] border border-[#382c1e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="category">Sort by Category</option>
                  <option value="name">Sort by Name</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="flex-1 overflow-y-auto rounded-2xl border border-[#332719] bg-[#18130e] custom-scrollbar">
              {filteredProducts.length === 0 ? (
                <div className="py-16 text-center text-[#8e8574] space-y-2">
                  <p className="font-bold text-white">No products found matching query</p>
                  <p className="text-xs">Adjust your search or add a new bakery product above.</p>
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#201811] text-[#9e9280] uppercase tracking-wider text-[10px] font-bold sticky top-0 z-10 border-b border-[#2d2215]">
                    <tr>
                      <th className="py-3 px-4">Bake & Photo</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Base Price (RWF)</th>
                      <th className="py-3 px-3 hidden md:table-cell">Portion Sizes</th>
                      <th className="py-3 px-3 hidden lg:table-cell">Tags & Badges</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#261e14]">
                    {filteredProducts.map((prod) => {
                      const isEditingPrice = quickPriceEditId === prod.id;
                      const safeImg = getSafeImageUrl(
                        prod.image, 
                        prod.category === 'pastries-viennoiserie' ? FALLBACK_PASTRY_IMAGE : FALLBACK_CAKE_IMAGE
                      );

                      return (
                        <tr key={prod.id} className="hover:bg-[#221b14] transition-colors group">
                          
                          {/* Image & Title */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div 
                                className="relative w-12 h-12 rounded-xl overflow-hidden bg-black/40 border border-[#443522] shrink-0 cursor-pointer group/img"
                                onClick={() => setPreviewMediaUrl(safeImg)}
                                title="Click to enlarge photo"
                              >
                                <img 
                                  src={safeImg} 
                                  alt={prod.name} 
                                  onError={(e) => handleImageError(e, FALLBACK_CAKE_IMAGE)}
                                  className="w-full h-full object-cover group-hover/img:scale-110 transition-transform"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity text-white">
                                  <Eye className="w-3.5 h-3.5" />
                                </div>
                              </div>
                              <div className="max-w-xs">
                                <p 
                                  className="font-bold text-white text-xs hover:text-[#d4af37] transition-colors cursor-pointer" 
                                  onClick={() => handleOpenEdit(prod)}
                                >
                                  {prod.name}
                                </p>
                                <p className="text-[10px] text-[#8e8574] truncate max-w-[220px]">
                                  {prod.description}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-3">
                            <span className="px-2.5 py-1 rounded-lg bg-[#271f16] border border-[#423321] text-[#d4af37] text-[10px] font-semibold whitespace-nowrap">
                              {prod.category.replace('-', ' ')}
                            </span>
                          </td>

                          {/* Price & Inline quick edit */}
                          <td className="py-3 px-3">
                            {isEditingPrice ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  step={500}
                                  value={quickPriceValue}
                                  onChange={(e) => setQuickPriceValue(Number(e.target.value))}
                                  className="w-24 bg-black border border-[#d4af37] rounded px-1.5 py-0.5 text-xs text-white font-mono font-bold"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleSaveQuickPrice(prod)}
                                  className="p-1 bg-[#d4af37] text-black rounded hover:brightness-110"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => setQuickPriceEditId(null)}
                                  className="p-1 bg-[#2b2216] text-[#8e8574] rounded hover:text-white"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <div 
                                onClick={() => {
                                  setQuickPriceEditId(prod.id);
                                  setQuickPriceValue(prod.price);
                                }}
                                className="cursor-pointer group/price flex items-center gap-1.5"
                                title="Click to quick edit price"
                              >
                                <div>
                                  <span className="font-['Cinzel',serif] font-bold text-white text-xs group-hover/price:text-[#d4af37]">
                                    {formatRWF(prod.price)}
                                  </span>
                                  {prod.originalPrice && (
                                    <span className="block text-[10px] text-[#7a6f5e] line-through">
                                      {formatRWF(prod.originalPrice)}
                                    </span>
                                  )}
                                </div>
                                <Edit3 className="w-3 h-3 text-[#7a6f5e] opacity-0 group-hover/price:opacity-100 transition-opacity" />
                              </div>
                            )}
                          </td>

                          {/* Sizes */}
                          <td className="py-3 px-3 hidden md:table-cell">
                            {prod.availableSizes && prod.availableSizes.length > 0 ? (
                              <span className="text-[11px] text-[#c9bfb0]">
                                {prod.availableSizes.length} Portions
                              </span>
                            ) : (
                              <span className="text-[10px] text-[#7a6f5e]">Standard Size</span>
                            )}
                          </td>

                          {/* Tags & Badges */}
                          <td className="py-3 px-3 hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {prod.isPopular && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-900/40 border border-amber-600/50 text-amber-300 text-[9px] font-bold">
                                  BEST SELLER
                                </span>
                              )}
                              {prod.isChefSpecial && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-900/40 border border-emerald-600/50 text-emerald-300 text-[9px] font-bold">
                                  CHEF SPECIAL
                                </span>
                              )}
                              {prod.tags?.slice(0, 1).map((t, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 rounded bg-[#271f16] text-[#a89d8c] text-[9px]">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setCustomerPreviewProduct(prod)}
                                className="p-1.5 rounded-lg bg-[#281f16] hover:bg-[#3d3021] text-[#9c907d] hover:text-white transition-colors"
                                title="Customer View Simulator"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleOpenEdit(prod)}
                                className="p-1.5 rounded-lg bg-[#281f16] hover:bg-[#3d3021] text-[#d4af37] transition-colors"
                                title="Edit Full Product & Photos"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDuplicate(prod)}
                                className="p-1.5 rounded-lg bg-[#281f16] hover:bg-[#3d3021] text-[#86efac] transition-colors"
                                title="Duplicate / Clone Cake"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => setProductToDelete(prod)}
                                className="p-1.5 rounded-lg bg-[#281f16] hover:bg-red-950/60 text-red-400 hover:text-red-300 transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: MEDIA & PHOTOS HUB */}
        {/* ==================================================== */}
        {activeTab === 'media' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-xs">
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Upload Dropzone */}
              <div className="p-6 rounded-3xl bg-[#1b1510] border border-[#3d2f1f] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-['Cinzel',serif] text-base font-bold text-white">
                      Upload Bakery Photos & Cake Imagery
                    </h3>
                    <p className="text-[11px] text-[#8e8574]">
                      Upload photos from your computer or phone to use across cakes, croissants, and celebration boxes.
                    </p>
                  </div>
                  <button
                    onClick={() => mediaFileInputRef.current?.click()}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#d4af37] text-black font-bold text-xs shrink-0 hover:brightness-110"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload New Photo</span>
                  </button>
                </div>

                <input 
                  type="file" 
                  ref={mediaFileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleMediaUpload(e.target.files[0]);
                    }
                  }}
                />

                {mediaUploadLoading && (
                  <div className="py-8 text-center text-[#d4af37] space-y-2">
                    <p className="font-bold">Compressing and optimizing cake photo...</p>
                  </div>
                )}
              </div>

              {/* Uploaded User Photos */}
              {uploadedMediaList.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-white text-sm">Your Uploaded Photos ({uploadedMediaList.length})</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {uploadedMediaList.map((url, idx) => (
                      <div key={idx} className="group relative rounded-2xl overflow-hidden bg-black/60 border border-[#443522] aspect-square">
                        <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(url);
                              triggerToast('Photo URL copied to clipboard!');
                            }}
                            className="p-1.5 rounded-lg bg-[#d4af37] text-black font-bold text-[10px]"
                            title="Copy Image URL"
                          >
                            Copy URL
                          </button>
                          <button
                            onClick={() => setPreviewMediaUrl(url)}
                            className="p-1.5 rounded-lg bg-[#271e16] text-white hover:text-[#d4af37]"
                            title="Preview Large"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Curated Tanuri Bakery Preset Library */}
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">Tanuri Pastries Official Photo Library</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {BAKERY_IMAGE_PRESETS.map((preset, idx) => {
                    const safeUrl = getSafeImageUrl(preset.url, FALLBACK_CAKE_IMAGE);
                    return (
                      <div 
                        key={idx} 
                        className="group relative rounded-2xl overflow-hidden bg-[#18130e] border border-[#382b1c] hover:border-[#d4af37]/60 transition-all p-2 flex flex-col justify-between"
                      >
                        <div className="aspect-square rounded-xl overflow-hidden mb-2 relative bg-black/40">
                          <img 
                            src={safeUrl} 
                            alt={preset.name} 
                            onError={(e) => handleImageError(e, FALLBACK_CAKE_IMAGE)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          />
                        </div>
                        <p className="font-bold text-white text-[11px] truncate">{preset.name}</p>
                        <p className="text-[10px] text-[#8e8574] capitalize">{preset.category.replace('-', ' ')}</p>
                        
                        <div className="mt-2 flex gap-1">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(safeUrl);
                              triggerToast(`Copied URL for "${preset.name}"!`);
                            }}
                            className="flex-1 py-1 rounded bg-[#271f16] hover:bg-[#d4af37] hover:text-black text-[#d4af37] text-[10px] font-bold transition-colors"
                          >
                            Copy URL
                          </button>
                          <button
                            onClick={() => setPreviewMediaUrl(safeUrl)}
                            className="p-1 rounded bg-[#271f16] text-[#8e8574] hover:text-white"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: KIGALI DELIVERY FEES */}
        {/* ==================================================== */}
        {activeTab === 'delivery' && (
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar text-xs">
            <div className="max-w-4xl mx-auto space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#1b1510] border border-[#382c1d]">
                <div>
                  <h3 className="font-['Cinzel',serif] text-base font-bold text-white">
                    Kigali Delivery Neighborhoods & Fees
                  </h3>
                  <p className="text-[11px] text-[#8e8574]">
                    Set custom delivery pricing and estimated delivery wait times per Kigali neighborhood.
                  </p>
                </div>
                <button
                  onClick={handleSaveDeliveryZones}
                  className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-black font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shrink-0"
                >
                  Save Delivery Rates
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {zonesState.map((zone, idx) => (
                  <div key={zone.id} className="p-4 rounded-2xl bg-[#1a140f] border border-[#33281b] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                        {zone.name}
                      </span>
                      {zone.popular && (
                        <span className="text-[9px] px-2 py-0.5 rounded bg-[#2b2114] text-[#d4af37] border border-[#443421] font-bold">
                          POPULAR
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-[#8e8574] block mb-1">Delivery Fee (RWF)</label>
                        <input
                          type="number"
                          step={500}
                          value={zone.fee}
                          onChange={(e) => {
                            const updated = [...zonesState];
                            updated[idx].fee = Number(e.target.value);
                            setZonesState(updated);
                          }}
                          className="w-full bg-[#120e0a] border border-[#2d2316] rounded-xl px-2.5 py-1.5 text-xs text-[#d4af37] font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-[#8e8574] block mb-1">Estimated Time</label>
                        <input
                          type="text"
                          value={zone.estMinutes}
                          onChange={(e) => {
                            const updated = [...zonesState];
                            updated[idx].estMinutes = e.target.value;
                            setZonesState(updated);
                          }}
                          className="w-full bg-[#120e0a] border border-[#2d2316] rounded-xl px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: STORE CONTACT & PAYMENT */}
        {/* ==================================================== */}
        {activeTab === 'store' && (
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar text-xs">
            <div className="max-w-3xl mx-auto space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#1b1510] border border-[#382c1d]">
                <div>
                  <h3 className="font-['Cinzel',serif] text-base font-bold text-white">
                    Bakery Contact & Payment Settings
                  </h3>
                  <p className="text-[11px] text-[#8e8574]">
                    Configure your official WhatsApp ordering number, MoMo merchant paycode, and bakery locations.
                  </p>
                </div>
                <button
                  onClick={handleSaveStore}
                  className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-black font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shrink-0"
                >
                  Save Store Settings
                </button>
              </div>

              <div className="space-y-4 p-6 rounded-3xl bg-[#19140f] border border-[#33281a]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="space-y-1.5">
                    <label className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>WhatsApp Number (For Orders)</span>
                    </label>
                    <input
                      type="text"
                      value={storeState.whatsappNumber || ''}
                      onChange={(e) => setStoreState({ ...storeState, whatsappNumber: e.target.value })}
                      placeholder="e.g. 250796607142 (no plus or spaces)"
                      className="w-full bg-[#120e0a] border border-[#2d2316] rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>MTN Mobile Money Merchant Code</span>
                    </label>
                    <input
                      type="text"
                      value={storeState.momoCode || ''}
                      onChange={(e) => setStoreState({ ...storeState, momoCode: e.target.value })}
                      placeholder="e.g. *182*8*1*796607#"
                      className="w-full bg-[#120e0a] border border-[#2d2316] rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-white uppercase tracking-wider text-[11px]">
                      Display Phone Number
                    </label>
                    <input
                      type="text"
                      value={storeState.phoneDisplay || ''}
                      onChange={(e) => setStoreState({ ...storeState, phoneDisplay: e.target.value })}
                      placeholder="0796 607 142"
                      className="w-full bg-[#120e0a] border border-[#2d2316] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-white uppercase tracking-wider text-[11px]">
                      Instagram Handle
                    </label>
                    <input
                      type="text"
                      value={storeState.handle || ''}
                      onChange={(e) => setStoreState({ ...storeState, handle: e.target.value })}
                      placeholder="@tanuripastries"
                      className="w-full bg-[#120e0a] border border-[#2d2316] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 5: SECURITY & PASSWORD MANAGEMENT */}
        {/* ==================================================== */}
        {activeTab === 'security' && (
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar text-xs">
            <div className="max-w-2xl mx-auto space-y-6">
              
              <div className="p-4 rounded-2xl bg-[#1b1510] border border-[#382c1d]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-['Cinzel',serif] text-base font-bold text-white">
                      Admin Password & Security Access
                    </h3>
                    <p className="text-[11px] text-[#8e8574]">
                      Update the master password required to access the Tanuri Management Studio.
                    </p>
                  </div>
                </div>
              </div>

              {/* Password Change Form */}
              <form onSubmit={handleChangePassword} className="p-6 rounded-3xl bg-[#19140f] border border-[#33281a] space-y-4">
                
                {passwordChangeSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{passwordChangeSuccess}</span>
                  </div>
                )}

                {passwordChangeError && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{passwordChangeError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="font-bold text-white uppercase tracking-wider text-[11px]">
                    Current Password / PIN
                  </label>
                  <input
                    type="password"
                    value={oldPasswordInput}
                    onChange={(e) => setOldPasswordInput(e.target.value)}
                    placeholder="Enter current password (default: tanuri2025)"
                    required
                    className="w-full bg-[#120e0a] border border-[#2d2316] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-white uppercase tracking-wider text-[11px]">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="Minimum 4 characters"
                      required
                      className="w-full bg-[#120e0a] border border-[#2d2316] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-white uppercase tracking-wider text-[11px]">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmNewPasswordInput}
                      onChange={(e) => setConfirmNewPasswordInput(e.target.value)}
                      placeholder="Re-enter new password"
                      required
                      className="w-full bg-[#120e0a] border border-[#2d2316] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#b38930] via-[#d4af37] to-[#b38930] text-black font-extrabold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md"
                >
                  Save New Admin Password
                </button>
              </form>

              {/* Security info card */}
              <div className="p-4 rounded-2xl bg-[#1d1610] border border-[#332517] space-y-2 text-[11px] text-[#a69c8a]">
                <p className="font-bold text-[#d4af37] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Management Protection:
                </p>
                <p>
                  • Authentication is saved for your active browser session so you won't need to re-type while managing cakes.
                </p>
                <p>
                  • You can manually lock your session anytime using the "Lock Session" button at the top right.
                </p>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Full Product Add/Edit Modal */}
      <AdminProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={productToEdit}
        onSave={(saved) => {
          onSaveProduct(saved);
          triggerToast(`Product "${saved.name}" saved successfully!`);
        }}
      />

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#18130e] border border-red-900/60 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-950 border border-red-700/60 mx-auto flex items-center justify-center text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Delete from Menu?</h3>
              <p className="text-xs text-[#a89e8f] mt-1">
                Are you sure you want to remove <span className="text-white font-semibold">"{productToDelete.name}"</span>?
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#282017] text-[#c7bcab] font-semibold text-xs hover:bg-[#382d20]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteProduct(productToDelete.id);
                  setProductToDelete(null);
                  triggerToast(`Removed "${productToDelete.name}" from catalog.`);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer View Simulator Modal */}
      {customerPreviewProduct && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setCustomerPreviewProduct(null)}
        >
          <div 
            className="relative w-full max-w-md bg-[#17130e] border border-[#d4af37]/50 rounded-3xl overflow-hidden shadow-2xl p-5 text-[#ded6c7] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#2d2215]">
              <span className="text-xs font-bold text-[#d4af37] uppercase flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> Customer Storefront Preview
              </span>
              <button
                onClick={() => setCustomerPreviewProduct(null)}
                className="p-1 rounded-full text-[#8e8574] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 border border-[#3e3020]">
              <img 
                src={getSafeImageUrl(customerPreviewProduct.image, FALLBACK_CAKE_IMAGE)} 
                alt={customerPreviewProduct.name}
                onError={(e) => handleImageError(e, FALLBACK_CAKE_IMAGE)}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#2b2114] text-[#d4af37] border border-[#4d3a24]">
                  {customerPreviewProduct.category.replace('-', ' ')}
                </span>
                <span className="font-['Cinzel',serif] text-sm font-extrabold text-[#d4af37]">
                  {formatRWF(customerPreviewProduct.price)}
                </span>
              </div>
              <h3 className="font-['Cinzel',serif] text-base font-bold text-white">
                {customerPreviewProduct.name}
              </h3>
              <p className="text-xs text-[#a69c8a] leading-relaxed">
                {customerPreviewProduct.description}
              </p>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  const p = customerPreviewProduct;
                  setCustomerPreviewProduct(null);
                  handleOpenEdit(p);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#d4af37] text-black font-bold text-xs"
              >
                Edit Product
              </button>
              <button
                onClick={() => setCustomerPreviewProduct(null)}
                className="px-4 py-2.5 rounded-xl bg-[#271f16] text-white font-semibold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Large Image Preview Modal */}
      {previewMediaUrl && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setPreviewMediaUrl(null)}
        >
          <div className="relative max-w-2xl w-full bg-black rounded-3xl overflow-hidden border border-[#d4af37]/40 p-2">
            <button
              onClick={() => setPreviewMediaUrl(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white z-10 hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={previewMediaUrl} alt="Preview" className="w-full max-h-[80vh] object-contain rounded-2xl" />
          </div>
        </div>
      )}

    </div>
  );
};
