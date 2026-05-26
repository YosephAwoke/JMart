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

export interface ProductComment {
  id: string;
  userId: string;
  authorName: string;
  text: string;
  createdAt: string;
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
  brand?: string;
  vendor?: string;
  companyDescription?: LocalizedText;
  availableSizes?: string[];
  availableColors?: string[];
  orderCount?: number;
  comments?: ProductComment[];
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
  cartKey?: string;
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
  passwordResetToken?: string | null;
  passwordResetExpires?: string | null;
}

export interface AuthResponse {
  user: UserProfile | null;
  token?: string;
}