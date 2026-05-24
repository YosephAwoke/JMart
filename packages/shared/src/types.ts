export type LanguageCode = 'en' | 'am';

export type ThemeMode = 'light' | 'dark';

export interface LocalizedText {
  en: string;
  am: string;
}

export interface Money {
  amount: number;
  currency: 'ETB';
}

export interface ProductVariant {
  id: string;
  name: LocalizedText;
  value: string;
  sku?: string;
  stock: number;
}

export interface ProductMedia {
  id: string;
  url: string;
  alt: LocalizedText;
}

export interface ProductSummary {
  id: string;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  price: Money;
  compareAtPrice?: Money;
  rating: number;
  reviewCount: number;
  stock: number;
  images: ProductMedia[];
  variants: ProductVariant[];
  tags: string[];
}

export interface AddressDraft {
  fullName: string;
  phone: string;
  region: string;
  city: string;
  subCity: string;
  woreda: string;
  kebele?: string;
  landmark: string;
  building?: string;
  notes?: string;
}

export interface CartItem {
  productId: string;
  title: LocalizedText;
  price: Money;
  image: string;
  quantity: number;
  variantLabel?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email?: string;
  phone: string;
  preferredLanguage?: LanguageCode;
  preferredTheme?: ThemeMode;
  defaultAddress?: AddressDraft | null;
  favorites?: string[]; // product ids
}

export interface AuthResponse {
  user: UserProfile | null;
  token?: string;
}