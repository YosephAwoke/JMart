import type { ProductSummary } from './types.js';

export const MOCK_PRODUCTS: ProductSummary[] = [
  {
    id: '1',
    slug: 'aurora-bag',
    title: { en: 'Aurora Tote', am: 'አውሮራ ቦርሳ' },
    description: {
      en: 'Minimal form, elevated finish, built for daily city carry.',
      am: 'ለዕለታዊ ከተማዊ ጉዞ የተነደፈ ንጹሕ እና ዘመናዊ ቅርጽ.'
    },
    price: { amount: 4200, currency: 'ETB' },
    compareAtPrice: { amount: 5200, currency: 'ETB' },
    rating: 4.8,
    reviewCount: 126,
    stock: 24,
    images: [
      { id: '1a', url: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1200&q=80', alt: { en: 'Aurora Tote front view', am: 'የቦርሳው የፊት እይታ' } },
      { id: '1b', url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80', alt: { en: 'Aurora Tote side view', am: 'የቦርሳው የጎን እይታ' } }
    ],
    variants: [
      { id: 'v1', name: { en: 'Color', am: 'ቀለም' }, value: 'Olive', stock: 8 },
      { id: 'v2', name: { en: 'Color', am: 'ቀለም' }, value: 'Sand', stock: 16 }
    ],
    tags: ['featured', 'new-arrival']
  },
  {
    id: '2',
    slug: 'sera-sneakers',
    title: { en: 'Sera Sneakers', am: 'ሴራ ስኒከርስ' },
    description: {
      en: 'Clean silhouette with a cushioned profile for everyday movement.',
      am: 'ለዕለታዊ እንቅስቃሴ የተስተካከለ ንፁሕ እና ምቹ ቅርጽ.'
    },
    price: { amount: 6850, currency: 'ETB' },
    compareAtPrice: { amount: 7400, currency: 'ETB' },
    rating: 4.6,
    reviewCount: 89,
    stock: 18,
    images: [
      { id: '2a', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80', alt: { en: 'Sera Sneakers angled view', am: 'የስኒከሩ የአንግል እይታ' } },
      { id: '2b', url: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=1200&q=80', alt: { en: 'Sera Sneakers detail view', am: 'የስኒከሩ ዝርዝር እይታ' } }
    ],
    variants: [
      { id: 'v3', name: { en: 'Size', am: 'መጠን' }, value: '41', stock: 6 },
      { id: 'v4', name: { en: 'Size', am: 'መጠን' }, value: '42', stock: 12 }
    ],
    tags: ['featured', 'lifestyle']
  },
  {
    id: '3',
    slug: 'nala-fragrance',
    title: { en: 'Nala Fragrance', am: 'ናላ ሽቶ' },
    description: {
      en: 'Warm, modern, and softly expressive for premium gifting.',
      am: 'ለስጦታ የሚመች ሞቃት፣ ዘመናዊ እና የማይጮህ ሽቶ.'
    },
    price: { amount: 2950, currency: 'ETB' },
    compareAtPrice: { amount: 3400, currency: 'ETB' },
    rating: 4.9,
    reviewCount: 214,
    stock: 42,
    images: [
      { id: '3a', url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80', alt: { en: 'Nala Fragrance bottle', am: 'የሽቶው ጠርሙስ' } },
      { id: '3b', url: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&w=1200&q=80', alt: { en: 'Nala Fragrance packaging', am: 'የሽቶው ማሸጊያ' } }
    ],
    variants: [
      { id: 'v5', name: { en: 'Volume', am: 'መጠን' }, value: '50ml', stock: 20 },
      { id: 'v6', name: { en: 'Volume', am: 'መጠን' }, value: '100ml', stock: 22 }
    ],
    tags: ['new-arrival', 'lifestyle']
  }
];