import { AnimatePresence, motion } from 'framer-motion';
import type { ProductSummary } from '@jmart/shared';
import { mockCatalog } from '../data/mockCatalog';
import { ProductCard } from './ProductCard';

export function ProductGrid({ products = mockCatalog }: { products?: ProductSummary[] }) {
  return (
    <section id="shop" className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Featured products</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">Popular items customers can shop now.</h2>
        </div>
        <div className="hidden rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted md:block">Ready to add to cart</div>
      </div>

      <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence>
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}