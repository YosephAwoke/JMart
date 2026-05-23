import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { ProductGrid } from '../components/ProductGrid';
import { useProducts } from '../hooks/useProducts';
import { Link } from 'react-router-dom';
import type { ProductSortKey } from '../services/products';

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Featured', value: 'featured' },
  { label: 'New arrivals', value: 'new-arrival' },
  { label: 'In stock', value: 'in-stock' },
  { label: 'Lifestyle', value: 'lifestyle' }
];

const sorts: Array<{ label: string; value: ProductSortKey }> = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Top rated', value: 'top-rated' },
  { label: 'Price: low to high', value: 'price-asc' },
  { label: 'Price: high to low', value: 'price-desc' },
  { label: 'Alphabetical', value: 'alphabetical' }
];

export function CatalogPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState<ProductSortKey>('recommended');

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 220);
    return () => window.clearTimeout(timer);
  }, [query]);

  const { filteredProducts, loading, products } = useProducts(debouncedQuery, filter, sort);

  const stats = useMemo(
    () => [
      { label: 'Products', value: products.length },
      { label: 'Visible', value: filteredProducts.length },
      { label: 'Language ready', value: 'EN / AM' }
    ],
    [products.length, filteredProducts.length]
  );

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-border bg-surface p-6 shadow-premium">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Catalog</p>
        <h1 className="mt-2 font-display text-4xl font-black tracking-tight">Shop the collection.</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">Browse live products, filter by what you need, and sort the collection the way a real store should.</p>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">Search</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
            />
          </label>

          <div className="grid gap-2 rounded-3xl border border-border bg-surfaceAlt p-3 sm:grid-cols-3">
            {stats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-border bg-surface px-4 py-3 text-left">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted">{item.label}</p>
                <p className="mt-1 text-sm font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <motion.button
                key={item.value}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilter(item.value)}
                className={[
                  'rounded-full border px-4 py-2 text-sm font-semibold transition',
                  filter === item.value ? 'border-accent bg-accent text-white shadow-glow' : 'border-border bg-surfaceAlt text-foreground'
                ].join(' ')}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          <label className="block min-w-56">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">Sort</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as ProductSortKey)}
              className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
            >
              {sorts.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <div className="space-y-4">
        {loading ? <LoadingState /> : null}
        {filteredProducts.length === 0 && !loading ? <EmptyState /> : <ProductGrid products={filteredProducts} />}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-[2rem] border border-border bg-surface px-6 py-4 text-sm text-muted shadow-sm">
      Loading products...
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[2rem] border border-border bg-surface p-8 text-center shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">No results</p>
      <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">Try a different search or filter.</h3>
      <p className="mt-2 text-sm leading-7 text-muted">Try a different search or clear the filters to bring products back.</p>
      <div className="mt-5 flex justify-center gap-3">
        <button onClick={() => window.location.reload()} className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-glow">
          Reset view
        </button>
        <Link to="/checkout" className="rounded-full border border-border bg-surfaceAlt px-5 py-3 text-sm font-semibold">
          Go to checkout
        </Link>
      </div>
    </div>
  );
}