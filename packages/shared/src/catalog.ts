import type { ProductSummary } from './types.js';

export const MOCK_PRODUCTS: ProductSummary[] = [
  {
    id: 'classic-cotton-tshirt',
    slug: 'classic-cotton-tshirt',
    title: { en: 'Classic Cotton T-Shirt', am: 'የጥጥ ክላሲክ ቲሸርት' },
    description: {
      en: 'A breathable, everyday cotton T-shirt with a comfortable regular fit.',
      am: 'ለዕለታዊ አጠቃቀም ምቹ ቅርጽ ያለው እና አየር የሚያስገባ የጥጥ ቲሸርት።'
    },
    price: { amount: 1250, currency: 'ETB' },
    compareAtPrice: { amount: 1500, currency: 'ETB' },
    rating: 4.7,
    reviewCount: 84,
    stock: 36,
    images: [
      {
        id: 'classic-cotton-tshirt-front',
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
        alt: { en: 'Classic white cotton T-shirt', am: 'ክላሲክ ነጭ የጥጥ ቲሸርት' }
      },
      {
        id: 'classic-cotton-tshirt-detail',
        url: 'https://images.unsplash.com/photo-1583743814966-8936f37f4678?auto=format&fit=crop&w=1200&q=80',
        alt: { en: 'Classic cotton T-shirt detail', am: 'የጥጥ ቲሸርት ዝርዝር' }
      }
    ],
    variants: [
      { id: 'classic-cotton-tshirt-s', name: { en: 'Size', am: 'መጠን' }, value: 'S', stock: 10 },
      { id: 'classic-cotton-tshirt-m', name: { en: 'Size', am: 'መጠን' }, value: 'M', stock: 14 },
      { id: 'classic-cotton-tshirt-l', name: { en: 'Size', am: 'መጠን' }, value: 'L', stock: 12 }
    ],
    tags: ['featured', 'new-arrival', 'clothing'],
    brand: 'JMart Essentials',
    vendor: 'JMart Store',
    availableSizes: ['S', 'M', 'L'],
    availableColors: ['White', 'Black', 'Navy']
  },
  {
    id: 'velour-noir-perfume',
    slug: 'velour-noir-perfume',
    title: { en: 'Velour Noir Eau de Parfum', am: 'ቬሎር ኖየር ሽቶ' },
    description: {
      en: 'A luxurious evening fragrance with warm amber, soft florals, and polished woods.',
      am: 'አምበር፣ ለስላሳ አበባዎችና የተስተካከለ የእንጨት መዓዛ ያለው የምሽት ሽቶ።'
    },
    price: { amount: 6800, currency: 'ETB' },
    compareAtPrice: { amount: 7500, currency: 'ETB' },
    rating: 4.9,
    reviewCount: 57,
    stock: 18,
    images: [
      {
        id: 'velour-noir-perfume-bottle',
        url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80',
        alt: { en: 'Luxury perfume bottle', am: 'የቅንጦት ሽቶ ጠርሙስ' }
      },
      {
        id: 'velour-noir-perfume-box',
        url: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&w=1200&q=80',
        alt: { en: 'Luxury perfume packaging', am: 'የቅንጦት ሽቶ ማሸጊያ' }
      }
    ],
    variants: [
      { id: 'velour-noir-perfume-50ml', name: { en: 'Volume', am: 'መጠን' }, value: '50ml', stock: 8 },
      { id: 'velour-noir-perfume-100ml', name: { en: 'Volume', am: 'መጠን' }, value: '100ml', stock: 10 }
    ],
    tags: ['featured', 'luxury', 'fragrance'],
    brand: 'Velour Noir',
    vendor: 'JMart Store',
    availableSizes: ['50ml', '100ml']
  },
  {
    id: 'luna-leather-handbag',
    slug: 'luna-leather-handbag',
    title: { en: 'Luna Leather Handbag', am: 'ሉና የቆዳ የእጅ ቦርሳ' },
    description: {
      en: 'A structured leather handbag with a refined silhouette for workdays and weekends.',
      am: 'ለስራ ቀናትና ለሳምንት መጨረሻ የሚመች የተስተካከለ የቆዳ የእጅ ቦርሳ።'
    },
    price: { amount: 5950, currency: 'ETB' },
    compareAtPrice: { amount: 6800, currency: 'ETB' },
    rating: 4.8,
    reviewCount: 73,
    stock: 22,
    images: [
      {
        id: 'luna-leather-handbag-front',
        url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
        alt: { en: 'Luna leather handbag', am: 'የሉና የቆዳ የእጅ ቦርሳ' }
      },
      {
        id: 'luna-leather-handbag-side',
        url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1200&q=80',
        alt: { en: 'Luna handbag side view', am: 'የሉና ቦርሳ የጎን እይታ' }
      }
    ],
    variants: [
      { id: 'luna-leather-handbag-black', name: { en: 'Color', am: 'ቀለም' }, value: 'Black', stock: 12 },
      { id: 'luna-leather-handbag-tan', name: { en: 'Color', am: 'ቀለም' }, value: 'Tan', stock: 10 }
    ],
    tags: ['featured', 'new-arrival', 'bags'],
    brand: 'Luna Atelier',
    vendor: 'JMart Store',
    availableColors: ['Black', 'Tan']
  }
];
