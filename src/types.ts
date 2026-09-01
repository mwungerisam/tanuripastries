export interface Product {
  id: string;
  name: string;
  category: 'celebration-cakes' | 'pastries-viennoiserie' | 'tarts-treats' | 'cupcakes-boxes' | 'savory-bakes' | 'specialty-drinks';
  description: string;
  price: number; // in RWF
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  tags: string[];
  prepTime: string;
  allergens?: string[];
  dietary?: ('eggless' | 'vegetarian' | 'nut-free' | 'gluten-free')[];
  availableSizes?: {
    name: string;
    servings: string;
    priceMultiplier: number;
    basePrice: number;
  }[];
  spongeOptions?: string[];
  frostingOptions?: string[];
  supportsCustomMessage?: boolean;
  isPopular?: boolean;
  isChefSpecial?: boolean;
}

export interface CartItemOption {
  size?: string;
  servings?: string;
  sponge?: string;
  frosting?: string;
  customMessage?: string;
  candleOption?: string;
  specialInstructions?: string;
}

export interface CartItem {
  id: string; // unique item uuid in cart
  product: Product;
  quantity: number;
  options: CartItemOption;
  unitPrice: number;
  totalPrice: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number; // RWF
  estMinutes: string;
  popular?: boolean;
}

export interface CustomCakeForm {
  celebrationType: string;
  tiers: '1-tier' | '2-tier' | '3-tier' | 'bento';
  sizeKg: number;
  spongeFlavor: string;
  fillingFlavor: string;
  outerFrosting: string;
  colorTheme: string;
  cakeMessage: string;
  deliveryDate: string;
  deliveryTime: string;
  deliveryType: 'delivery' | 'pickup';
  deliveryArea: string;
  customerName: string;
  customerPhone: string;
  notes: string;
  candleCount: number;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  text: string;
  itemOrdered: string;
  verified: boolean;
}
