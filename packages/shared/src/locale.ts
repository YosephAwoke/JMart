import type { LanguageCode } from './types.js';

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

export const LOCALE_LABELS: Record<LanguageCode, { name: string; direction: 'ltr' }> = {
  en: { name: 'English', direction: 'ltr' },
  am: { name: 'አማርኛ', direction: 'ltr' }
};

export const translations = {
  en: {
    home: 'Home',
    shop: 'Shop',
    cart: 'Cart',
    checkout: 'Checkout',
    theme: 'Theme',
    language: 'Language'
  },
  am: {
    home: 'መነሻ',
    shop: 'ሱቅ',
    cart: 'ጋሪ',
    checkout: 'ክፍያ',
    theme: 'ገጽታ',
    language: 'ቋንቋ'
  }
} as const;