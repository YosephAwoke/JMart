import type { ProductSummary } from '@jmart/shared';
import { mockCatalog } from '../data/mockCatalog';

export type ProductSortKey = 'recommended' | 'price-asc' | 'price-desc' | 'top-rated' | 'alphabetical';

interface ApiProductResponse {
  data: Array<Partial<ProductSummary> & { _id?: string; createdAt?: string; updatedAt?: string }>;
}

export async function fetchProducts(): Promise<ProductSummary[]> {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      return mockCatalog;
    }

    const payload = (await response.json()) as ApiProductResponse;
    return payload.data.map(normalizeProduct).filter(Boolean) as ProductSummary[];
  } catch {
    return mockCatalog;
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