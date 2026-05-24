import type { ProductSummary } from '@jmart/shared';
import { mockCatalog } from '../data/mockCatalog';

export type ProductSortKey = 'recommended' | 'price-asc' | 'price-desc' | 'top-rated' | 'alphabetical';
const PRODUCT_CACHE_KEY = 'jmart-products-cache-v1';
const PRODUCT_CACHE_TTL_MS = 1000 * 60 * 60 * 6;

interface ApiProductResponse {
  data: Array<Partial<ProductSummary> & { _id?: string; createdAt?: string; updatedAt?: string }>;
}

type CachedProducts = {
  savedAt: number;
  products: ProductSummary[];
};

export function readCachedProducts() {
  if (typeof window === 'undefined') return mockCatalog;
  try {
    const raw = window.localStorage.getItem(PRODUCT_CACHE_KEY);
    if (!raw) return mockCatalog;
    const cache = JSON.parse(raw) as CachedProducts;
    if (!cache?.savedAt || Date.now() - cache.savedAt > PRODUCT_CACHE_TTL_MS || !Array.isArray(cache.products)) {
      return mockCatalog;
    }
    return cache.products.length > 0 ? cache.products : mockCatalog;
  } catch {
    return mockCatalog;
  }
}

export function writeCachedProducts(products: ProductSummary[]) {
  if (typeof window === 'undefined') return;
  try {
    const payload: CachedProducts = { savedAt: Date.now(), products };
    window.localStorage.setItem(PRODUCT_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // ignore storage failures
  }
}

export async function fetchProducts(): Promise<ProductSummary[]> {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      return readCachedProducts();
    }

    const payload = (await response.json()) as ApiProductResponse;
    const products = payload.data.map(normalizeProduct).filter(Boolean) as ProductSummary[];
    if (products.length > 0) writeCachedProducts(products);
    return products.length > 0 ? products : readCachedProducts();
  } catch {
    return readCachedProducts();
  }
}

export function normalizeProduct(product: Partial<ProductSummary> & { _id?: string }): ProductSummary | null {
  if (!product.slug || !product.title || !product.description || !product.price || !product.images || !product.variants) {
    return null;
  }

  return {
    id: product.id ?? product._id ?? product.slug,
    slug: product.slug,
    title: product.title,
    description: product.description,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    rating: product.rating ?? 0,
    reviewCount: product.reviewCount ?? 0,
    stock: product.stock ?? 0,
    images: product.images,
    variants: product.variants,
    tags: product.tags ?? []
  };
}

export function matchesSearch(product: ProductSummary, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  return [product.title.en, product.title.am, product.description.en, ...product.tags].some((value) =>
    value.toLowerCase().includes(normalizedQuery)
  );
}

export function matchesFilter(product: ProductSummary, filter: string) {
  if (filter === 'all') {
    return true;
  }

  if (filter === 'featured') {
    return product.tags.includes('featured');
  }

  if (filter === 'new-arrival') {
    return product.tags.includes('new-arrival');
  }

  if (filter === 'in-stock') {
    return product.stock > 0;
  }

  return product.tags.includes(filter);
}

export function sortProducts(products: ProductSummary[], sortKey: ProductSortKey) {
  return [...products].sort((left, right) => {
    if (sortKey === 'price-asc') {
      return left.price.amount - right.price.amount;
    }

    if (sortKey === 'price-desc') {
      return right.price.amount - left.price.amount;
    }

    if (sortKey === 'top-rated') {
      return right.rating - left.rating || right.reviewCount - left.reviewCount;
    }

    if (sortKey === 'alphabetical') {
      return left.title.en.localeCompare(right.title.en);
    }

    const leftScore = Number(left.tags.includes('featured')) * 3 + left.rating * 2 + left.reviewCount / 100;
    const rightScore = Number(right.tags.includes('featured')) * 3 + right.rating * 2 + right.reviewCount / 100;

    return rightScore - leftScore;
  });
}