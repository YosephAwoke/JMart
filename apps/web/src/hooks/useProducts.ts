import { useEffect, useMemo, useState } from 'react';
import type { ProductSummary } from '@jmart/shared';
import { readCachedProducts, fetchProducts, matchesFilter, matchesSearch, sortProducts, type ProductSortKey } from '../services/products';

export function useProducts(
  query: string,
  filter: string,
  sortKey: ProductSortKey = 'recommended',
  options: { useFallback?: boolean } = {}
) {
  const useFallback = options.useFallback ?? true;
  const [products, setProducts] = useState<ProductSummary[]>(() => (useFallback ? readCachedProducts() : []));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      const items = await fetchProducts(useFallback);
      if (active) setProducts(items);
    }

    load();

    return () => {
      active = false;
    };
  }, [useFallback]);

  const filteredProducts = useMemo(
    () => sortProducts(products.filter((product) => matchesSearch(product, query) && matchesFilter(product, filter)), sortKey),
    [products, query, filter, sortKey]
  );

  return {
    products,
    filteredProducts,
    loading
  };
}