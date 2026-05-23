import { useEffect, useMemo, useState } from 'react';
import type { ProductSummary } from '@jmart/shared';
import { fetchProducts, matchesFilter, matchesSearch, sortProducts, type ProductSortKey } from '../services/products';

export function useProducts(query: string, filter: string, sortKey: ProductSortKey = 'recommended') {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      const items = await fetchProducts();
      if (active) {
        setProducts(items);
        setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

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