import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Check, 
  Sparkles, 
  DollarSign, 
  Clock, 
  Tag, 
  Layers,
  AlertCircle,
  Eye,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { Product } from '../types';
import { CATEGORIES } from '../data/menuData';
import { processImageFile, BAKERY_IMAGE_PRESETS, getSafeImageUrl, handleImageError, FALLBACK_CAKE_IMAGE } from '../utils/imageUtils';
import { formatRWF } from '../utils/format';

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit: Product | null;
  onSave: (product: Product) => void;
}

const DEFAULT_CATEGORIES = CATEGORIES.filter(c => c.id !== 'all');

const DEFAULT_SIZES = [
  { name: '1.0 kg (6-8 Portions)', servings: '6-8 people', priceMultiplier: 1, basePrice: 25000 },
  { name: '1.5 kg (10-14 Portions)', servings: '10-14 people', priceMultiplier: 1.45, basePrice: 36000 },
  { name: '2.0 kg (16-20 Portions)', servings: '16-20 people', priceMultiplier: 1.85, basePrice: 46000 },
  { name: '3.0 kg 2-Tier Party Cake', servings: '25-30 people', priceMultiplier: 2.7, basePrice: 68000 },
];

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  onSave,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Product['category']>('celebration-cakes');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(25000);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [prepTime, setPrepTime] = useState('Same Day (2h prep)');
  const [rating, setRating] = useState(5.0);
  const [reviewsCount, setReviewsCount] = useState(12);

  // Image states
  const [image, setImage] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [imageTab, setImageTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [isDragOver, setIsDragOver] = useState(false);
  const [imageError, setImageError] = useState('');

  // Variants and options
  const [tags, setTags] = useState<string[]>(['Freshly Baked']);
  const [newTagInput, setNewTagInput] = useState('');
  const [dietary, setDietary] = useState<('eggless' | 'vegetarian' | 'nut-free' | 'gluten-free')[]>(['vegetarian']);
  const [allergens, setAllergens] = useState<string[]>(['Dairy', 'Gluten', 'Eggs']);
  const [newAllergenInput, setNewAllergenInput] = useState('');

  const [hasSizes, setHasSizes] = useState(true);
  const [availableSizes, setAvailableSizes] = useState<NonNullable<Product['availableSizes']>>([]);
  const [spongeOptions, setSpongeOptions] = useState<string[]>([]);
  const [newSpongeInput, setNewSpongeInput] = useState('');
  const [frostingOptions, setFrostingOptions] = useState<string[]>([]);
  const [newFrostingInput, setNewFrostingInput] = useState('');
  const [supportsCustomMessage, setSupportsCustomMessage] = useState(true);
  const [isPopular, setIsPopular] = useState(false);
  const [isChefSpecial, setIsChefSpecial] = useState(false);

  // Active form tab
  const [activeFormTab, setActiveFormTab] = useState<'basic' | 'media' | 'pricing' | 'flavors'>('basic');

  // Populate when editing
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setDescription(productToEdit.description);
      setPrice(productToEdit.price);
      setOriginalPrice(productToEdit.originalPrice);
      setPrepTime(productToEdit.prepTime);
      setRating(productToEdit.rating || 4.9);
      setReviewsCount(productToEdit.reviewsCount || 10);
      setImage(productToEdit.image);
      setImageUrlInput(productToEdit.image.startsWith('http') ? productToEdit.image : '');
      setTags(productToEdit.tags || []);
      setDietary(productToEdit.dietary || []);
      setAllergens(productToEdit.allergens || []);
      setAvailableSizes(productToEdit.availableSizes || []);
      setHasSizes(!!productToEdit.availableSizes && productToEdit.availableSizes.length > 0);
      setSpongeOptions(productToEdit.spongeOptions || []);
      setFrostingOptions(productToEdit.frostingOptions || []);
      setSupportsCustomMessage(productToEdit.supportsCustomMessage ?? true);
      setIsPopular(productToEdit.isPopular ?? false);
      setIsChefSpecial(productToEdit.isChefSpecial ?? false);
    } else {
      // Reset form for fresh item
      setName('');
      setCategory('celebration-cakes');
      setDescription('');
      setPrice(25000);
      setOriginalPrice(undefined);
      setPrepTime('Same Day (2h prep)');
      setRating(5.0);
      setReviewsCount(1);
      setImage(BAKERY_IMAGE_PRESETS[0].url);
      setImageUrlInput('');
      setTags(['Freshly Baked', 'Kigali Favorite']);
      setDietary(['vegetarian']);
      setAllergens(['Dairy', 'Gluten', 'Eggs']);
      setAvailableSizes(DEFAULT_SIZES);
      setHasSizes(true);
      setSpongeOptions(['Belgian Chocolate Sponge', 'Madagascar Vanilla Bean', 'Red Velvet Moist']);
      setFrostingOptions(['Swiss Buttercream', 'Dark Chocolate Ganache', 'Cream Cheese']);
      setSupportsCustomMessage(true);
      setIsPopular(true);
      setIsChefSpecial(false);
    }
    setActiveFormTab('basic');
    setImageError('');
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // Image Upload handler
  const handleFileChange = async (file: File) => {
    setImageUploadLoading(true);
    setImageError('');
    try {
      const processed = await processImageFile(file);
      setImage(processed);
      setImageUrlInput('');
    } catch (err: any) {
      setImageError(err.message || 'Could not load image');
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Add Size Variant
  const handleAddSize = () => {
    const nextMultiplier = availableSizes.length > 0 
      ? Number((availableSizes[availableSizes.length - 1].priceMultiplier + 0.5).toFixed(2))
      : 1;
    setAvailableSizes(prev => [
      ...prev,
      {
        name: `Custom Size (${prev.length + 1})`,
        servings: '12-16 people',
        priceMultiplier: nextMultiplier,
        basePrice: Math.round(price * nextMultiplier),
      }
    ]);
  };

  const handleUpdateSize = (idx: number, field: string, val: any) => {
    setAvailableSizes(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: val };
      return updated;
    });
  };

  const handleRemoveSize = (idx: number) => {
    setAvailableSizes(prev => prev.filter((_, i) => i !== idx));
  };

  // Save product
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a product name');
      return;
    }
    if (!image.trim()) {
      alert('Please provide an image for the product');
      return;
    }

    const newProduct: Product = {
      id: productToEdit ? productToEdit.id : `tanuri-${category}-${Date.now()}`,
      name: name.trim(),
      category,
      description: description.trim(),
      price: Number(price) || 1000,
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      rating: Number(rating) || 5.0,
      reviewsCount: Number(reviewsCount) || 1,
      image: image.trim(),
      tags: tags.filter(t => t.trim()),
      prepTime: prepTime.trim() || 'Same Day (2h prep)',
      allergens: allergens.filter(a => a.trim()),
      dietary: dietary,
      availableSizes: hasSizes && availableSizes.length > 0 ? availableSizes : undefined,
      spongeOptions: spongeOptions.filter(s => s.trim()),
      frostingOptions: frostingOptions.filter(f => f.trim()),
      supportsCustomMessage: category === 'celebration-cakes' ? supportsCustomMessage : false,
      isPopular,
      isChefSpecial,
    };

    onSave(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#16130f] border border-[#423422] rounded-3xl overflow-hidden shadow-2xl text-[#ded6c7]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#2d2417] flex items-center justify-between bg-[#1d1711] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-['Cinzel',serif] text-base sm:text-lg font-bold text-white">
                {productToEdit ? 'Edit Bakery Product' : 'Add New Cake or Pastry'}
              </h2>
              <p className="text-[11px] text-[#8e8574]">
                Manage photos, RWF pricing, sponge flavors, and portion sizes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#282017] hover:bg-[#382d20] text-[#8e8574] hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs for Form */}
        <div className="flex border-b border-[#2d2417] bg-[#14100c] px-6 gap-2 text-xs font-semibold overflow-x-auto shrink-0 py-2">
          <button
            type="button"
            onClick={() => setActiveFormTab('basic')}
            className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeFormTab === 'basic'
                ? 'bg-[#d4af37] text-black font-bold shadow'
                : 'text-[#9c907d] hover:text-white hover:bg-[#201912]'
            }`}
          >
            <span>1. Basic Info</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFormTab('media')}
            className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeFormTab === 'media'
                ? 'bg-[#d4af37] text-black font-bold shadow'
                : 'text-[#9c907d] hover:text-white hover:bg-[#201912]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>2. Photo & Image</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFormTab('pricing')}
            className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeFormTab === 'pricing'
                ? 'bg-[#d4af37] text-black font-bold shadow'
                : 'text-[#9c907d] hover:text-white hover:bg-[#201912]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>3. Pricing & Portions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFormTab('flavors')}
            className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeFormTab === 'flavors'
                ? 'bg-[#d4af37] text-black font-bold shadow'
                : 'text-[#9c907d] hover:text-white hover:bg-[#201912]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>4. Flavors & Badges</span>
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-xs">
          
          {/* TAB 1: BASIC INFO */}
          {activeFormTab === 'basic' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1">
                  <span>Product Title / Cake Name</span>
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Belgian Dark Chocolate Ganache Cake"
                  required
                  className="w-full bg-[#1e1812] border border-[#3d3020] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Category & Prep Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-white uppercase tracking-wider text-[11px]">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#1e1812] border border-[#3d3020] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    {DEFAULT_CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#d4af37]" />
                    <span>Preparation Time</span>
                  </label>
                  <input
                    type="text"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    placeholder="e.g. Same Day (2h prep), 24h Notice, Ready to Eat"
                    className="w-full bg-[#1e1812] border border-[#3d3020] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Description & Artisan Notes
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed taste profile, ingredients, sponge layers, texture..."
                  className="w-full bg-[#1e1812] border border-[#3d3020] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1">
                  <Tag className="w-3 h-3 text-[#d4af37]" />
                  <span>Highlights & Tags</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 rounded-lg bg-[#271f16] border border-[#453623] text-[#d4af37] text-[11px] flex items-center gap-1 font-medium"
                    >
                      <span>{t}</span>
                      <button 
                        type="button" 
                        onClick={() => setTags(tags.filter((_, i) => i !== idx))}
                        className="hover:text-red-400 ml-1"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newTagInput.trim()) {
                          setTags([...tags, newTagInput.trim()]);
                          setNewTagInput('');
                        }
                      }
                    }}
                    placeholder="Type tag and press Add (e.g. Signature, Birthday Favorite)..."
                    className="flex-1 bg-[#1e1812] border border-[#3d3020] rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newTagInput.trim()) {
                        setTags([...tags, newTagInput.trim()]);
                        setNewTagInput('');
                      }
                    }}
                    className="px-3 py-1.5 bg-[#2d2417] hover:bg-[#3d3121] text-white rounded-xl font-bold"
                  >
                    Add Tag
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PHOTO & IMAGE */}
          {activeFormTab === 'media' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Image Preview Card */}
              <div className="p-4 rounded-2xl bg-[#1b1610] border border-[#382c1d] flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-36 h-36 rounded-2xl overflow-hidden bg-black/60 border-2 border-[#d4af37]/40 shrink-0 shadow-lg">
                  {image ? (
                    <img 
                      src={getSafeImageUrl(image, FALLBACK_CAKE_IMAGE)} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        handleImageError(e, FALLBACK_CAKE_IMAGE);
                        setImageError('Source image could not be loaded directly; showing fallback.');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#7a6e5b] p-2 text-center">
                      <ImageIcon className="w-8 h-8 mb-1" />
                      <span className="text-[10px]">No image selected</span>
                    </div>
                  )}
                  {imageUploadLoading && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-[#d4af37]">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex-1 text-center sm:text-left">
                  <h4 className="font-bold text-white text-sm">Product Photo</h4>
                  <p className="text-[11px] text-[#8e8574]">
                    High-resolution imagery creates appetizing cake displays for your Kigali customers. Upload photos from your device, paste a direct web URL, or choose from our pastry preset library.
                  </p>
                  {image && (
                    <button
                      type="button"
                      onClick={() => {
                        setImage('');
                        setImageUrlInput('');
                      }}
                      className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:underline"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove current photo</span>
                    </button>
                  )}
                  {imageError && (
                    <p className="text-[11px] text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {imageError}
                    </p>
                  )}
                </div>
              </div>

              {/* Sub-Tabs for Photo Source */}
              <div className="space-y-3">
                <div className="flex border-b border-[#2d2417] pb-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setImageTab('upload')}
                    className={`font-semibold pb-1 border-b-2 transition-colors flex items-center gap-1.5 ${
                      imageTab === 'upload' ? 'border-[#d4af37] text-[#d4af37]' : 'border-transparent text-[#8e8574] hover:text-white'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Computer / Phone</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageTab('url')}
                    className={`font-semibold pb-1 border-b-2 transition-colors flex items-center gap-1.5 ${
                      imageTab === 'url' ? 'border-[#d4af37] text-[#d4af37]' : 'border-transparent text-[#8e8574] hover:text-white'
                    }`}
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Paste Image URL</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageTab('presets')}
                    className={`font-semibold pb-1 border-b-2 transition-colors flex items-center gap-1.5 ${
                      imageTab === 'presets' ? 'border-[#d4af37] text-[#d4af37]' : 'border-transparent text-[#8e8574] hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Bakery Preset Library</span>
                  </button>
                </div>

                {/* Option 1: File Upload */}
                {imageTab === 'upload' && (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      isDragOver 
                        ? 'border-[#d4af37] bg-[#d4af37]/10' 
                        : 'border-[#3d3020] bg-[#1a140f] hover:border-[#d4af37]/60'
                    }`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileChange(e.target.files[0]);
                        }
                      }}
                    />
                    <Upload className="w-8 h-8 text-[#d4af37] mx-auto mb-2" />
                    <p className="font-bold text-white text-xs">Click to browse or drag & drop photo here</p>
                    <p className="text-[10px] text-[#8e8574] mt-1">Supports JPEG, PNG, WEBP (auto-compressed for fast loading)</p>
                  </div>
                )}

                {/* Option 2: URL Input */}
                {imageTab === 'url' && (
                  <div className="space-y-2">
                    <label className="text-[11px] text-[#8e8574]">Enter direct web address to cake photo</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="flex-1 bg-[#1e1812] border border-[#3d3020] rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (imageUrlInput.trim()) {
                            setImage(imageUrlInput.trim());
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-[#d4af37] text-black font-bold text-xs"
                      >
                        Apply URL
                      </button>
                    </div>
                  </div>
                )}

                {/* Option 3: Preset Library */}
                {imageTab === 'presets' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-1 custom-scrollbar">
                    {BAKERY_IMAGE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImage(preset.url)}
                        className={`group relative rounded-xl overflow-hidden border p-1 text-left transition-all ${
                          image === preset.url 
                            ? 'border-[#d4af37] bg-[#d4af37]/20 shadow-md ring-1 ring-[#d4af37]' 
                            : 'border-[#33281b] bg-[#19140f] hover:border-[#d4af37]/50'
                        }`}
                      >
                        <div className="aspect-square rounded-lg overflow-hidden mb-1.5">
                          <img 
                            src={getSafeImageUrl(preset.url, FALLBACK_CAKE_IMAGE)} 
                            alt={preset.name} 
                            onError={(e) => handleImageError(e, FALLBACK_CAKE_IMAGE)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          />
                        </div>
                        <p className="text-[10px] font-bold text-white truncate">{preset.name}</p>
                      </button>
                    ))}
                  </div>
                )}

              </div>

            </div>
          )}

          {/* TAB 3: PRICING & PORTIONS */}
          {activeFormTab === 'pricing' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Base Price & Promotion */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#1b150f] border border-[#382b1c]">
                <div className="space-y-1.5">
                  <label className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <span>Base Selling Price (RWF)</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step={500}
                      min={500}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      required
                      className="w-full bg-[#1e1812] border border-[#3d3020] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-[#d4af37]"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#d4af37] font-bold">
                      {formatRWF(price)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#a89e8f] uppercase tracking-wider text-[11px]">
                    Original Price (Optional Strike-through)
                  </label>
                  <input
                    type="number"
                    step={500}
                    value={originalPrice || ''}
                    onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 32000 (shows discount badge)"
                    className="w-full bg-[#1e1812] border border-[#3d3020] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Portion Sizes Toggle */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                      Portion Sizes & Tier Multipliers
                    </h4>
                    <p className="text-[10px] text-[#8e8574]">
                      Allow customers to select 1.0kg, 1.5kg, 2.0kg, or multi-tier party bakes
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={hasSizes} 
                      onChange={(e) => setHasSizes(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-[#2d2417] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#d4af37]"></div>
                  </label>
                </div>

                {hasSizes && (
                  <div className="space-y-2 bg-[#17130e] p-3 rounded-2xl border border-[#302416]">
                    <div className="flex justify-between items-center pb-2 border-b border-[#291f13]">
                      <span className="text-[11px] font-semibold text-[#c7bcae]">Configured Portions</span>
                      <button
                        type="button"
                        onClick={handleAddSize}
                        className="flex items-center gap-1 text-[11px] text-[#d4af37] font-bold hover:underline"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Portion Size</span>
                      </button>
                    </div>

                    {availableSizes.map((sz, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-[#1e1812] p-2.5 rounded-xl border border-[#382d1f]">
                        <div className="col-span-4">
                          <input
                            type="text"
                            value={sz.name}
                            onChange={(e) => handleUpdateSize(idx, 'name', e.target.value)}
                            placeholder="e.g. 1.0 kg"
                            className="w-full bg-[#130f0b] border border-[#2d2317] rounded-lg px-2 py-1 text-xs text-white"
                          />
                        </div>

                        <div className="col-span-3">
                          <input
                            type="text"
                            value={sz.servings}
                            onChange={(e) => handleUpdateSize(idx, 'servings', e.target.value)}
                            placeholder="6-8 people"
                            className="w-full bg-[#130f0b] border border-[#2d2317] rounded-lg px-2 py-1 text-xs text-[#a69c8a]"
                          />
                        </div>

                        <div className="col-span-4">
                          <div className="relative">
                            <input
                              type="number"
                              step={500}
                              value={sz.basePrice}
                              onChange={(e) => handleUpdateSize(idx, 'basePrice', Number(e.target.value))}
                              placeholder="Price in RWF"
                              className="w-full bg-[#130f0b] border border-[#2d2317] rounded-lg px-2 py-1 text-xs text-[#d4af37] font-mono font-bold"
                            />
                          </div>
                        </div>

                        <div className="col-span-1 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveSize(idx)}
                            className="p-1 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: FLAVORS, DIETARY & VISIBILITY */}
          {activeFormTab === 'flavors' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Sponge Flavors */}
              <div className="space-y-2">
                <label className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center justify-between">
                  <span>Sponge Flavors Options (For Customer Selection)</span>
                  <span className="text-[10px] font-normal text-[#8e8574]">{spongeOptions.length} Flavors</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {spongeOptions.map((s, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 rounded-lg bg-[#271f16] border border-[#453623] text-[#e8dfcf] text-[11px] flex items-center gap-1"
                    >
                      <span>{s}</span>
                      <button 
                        type="button" 
                        onClick={() => setSpongeOptions(spongeOptions.filter((_, i) => i !== idx))}
                        className="hover:text-red-400 ml-1"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSpongeInput}
                    onChange={(e) => setNewSpongeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newSpongeInput.trim()) {
                          setSpongeOptions([...spongeOptions, newSpongeInput.trim()]);
                          setNewSpongeInput('');
                        }
                      }
                    }}
                    placeholder="Add flavor (e.g. Belgian Chocolate, Passionfruit)..."
                    className="flex-1 bg-[#1e1812] border border-[#3d3020] rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newSpongeInput.trim()) {
                        setSpongeOptions([...spongeOptions, newSpongeInput.trim()]);
                        setNewSpongeInput('');
                      }
                    }}
                    className="px-3 py-1.5 bg-[#2d2417] hover:bg-[#3d3121] text-white rounded-xl font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Frosting Options */}
              <div className="space-y-2">
                <label className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Frosting / Outer Coating Options
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {frostingOptions.map((f, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 rounded-lg bg-[#271f16] border border-[#453623] text-[#e8dfcf] text-[11px] flex items-center gap-1"
                    >
                      <span>{f}</span>
                      <button 
                        type="button" 
                        onClick={() => setFrostingOptions(frostingOptions.filter((_, i) => i !== idx))}
                        className="hover:text-red-400 ml-1"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFrostingInput}
                    onChange={(e) => setNewFrostingInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newFrostingInput.trim()) {
                          setFrostingOptions([...frostingOptions, newFrostingInput.trim()]);
                          setNewFrostingInput('');
                        }
                      }
                    }}
                    placeholder="Add frosting (e.g. 70% Dark Ganache, Swiss Buttercream)..."
                    className="flex-1 bg-[#1e1812] border border-[#3d3020] rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newFrostingInput.trim()) {
                        setFrostingOptions([...frostingOptions, newFrostingInput.trim()]);
                        setNewFrostingInput('');
                      }
                    }}
                    className="px-3 py-1.5 bg-[#2d2417] hover:bg-[#3d3121] text-white rounded-xl font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Badges & Special Toggles */}
              <div className="p-4 rounded-2xl bg-[#1b150f] border border-[#382b1c] space-y-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                  Storefront Badges & Visibility
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#201912] border border-[#36291b] cursor-pointer hover:border-[#d4af37]/50">
                    <input
                      type="checkbox"
                      checked={isPopular}
                      onChange={(e) => setIsPopular(e.target.checked)}
                      className="accent-[#d4af37] w-4 h-4 rounded"
                    />
                    <span className="font-bold text-white">Best Seller</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#201912] border border-[#36291b] cursor-pointer hover:border-[#d4af37]/50">
                    <input
                      type="checkbox"
                      checked={isChefSpecial}
                      onChange={(e) => setIsChefSpecial(e.target.checked)}
                      className="accent-[#d4af37] w-4 h-4 rounded"
                    />
                    <span className="font-bold text-white">Chef Special</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#201912] border border-[#36291b] cursor-pointer hover:border-[#d4af37]/50">
                    <input
                      type="checkbox"
                      checked={supportsCustomMessage}
                      onChange={(e) => setSupportsCustomMessage(e.target.checked)}
                      className="accent-[#d4af37] w-4 h-4 rounded"
                    />
                    <span className="font-bold text-white">Piped Message</span>
                  </label>
                </div>
              </div>

              {/* Dietary check */}
              <div className="space-y-2">
                <label className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Dietary Flags
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['vegetarian', 'eggless', 'gluten-free', 'nut-free'] as const).map((diet) => {
                    const isChecked = dietary.includes(diet);
                    return (
                      <button
                        key={diet}
                        type="button"
                        onClick={() => {
                          setDietary(prev => 
                            isChecked ? prev.filter(d => d !== diet) : [...prev, diet]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                          isChecked 
                            ? 'bg-[#1b3b22] border border-[#367945] text-[#86efac]' 
                            : 'bg-[#1d1711] border border-[#382c1e] text-[#8e8574]'
                        }`}
                      >
                        {diet} {isChecked && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </form>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-[#2d2417] bg-[#1d1711] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#282017] hover:bg-[#382d20] text-[#c9c0b2] font-semibold text-xs"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {activeFormTab !== 'flavors' ? (
              <button
                type="button"
                onClick={() => {
                  if (activeFormTab === 'basic') setActiveFormTab('media');
                  else if (activeFormTab === 'media') setActiveFormTab('pricing');
                  else if (activeFormTab === 'pricing') setActiveFormTab('flavors');
                }}
                className="px-4 py-2.5 rounded-xl bg-[#2e2418] hover:bg-[#3d3121] text-white font-bold text-xs"
              >
                Next Step →
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b38930] via-[#d4af37] to-[#b38930] text-black font-extrabold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg"
            >
              <Check className="w-4 h-4" />
              <span>{productToEdit ? 'Save Changes' : 'Publish Product to Menu'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
