import { motion } from 'framer-motion';
import type { ProductSummary } from '@jmart/shared';
import { useCart } from '../providers/CartProvider';

export function ProductCard({ product }: { product: ProductSummary }) {
  const { addItem } = useCart();

  return (
    <motion.article whileHover={{ y: -6 }} className="overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-sm transition-shadow hover:shadow-premium">
      <div className="relative aspect-[4/3] overflow-hidden bg-surfaceAlt">
        <img src={product.images[0]?.url} alt={product.images[0]?.alt.en} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
        <div className="absolute left-4 top-4 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold backdrop-blur">ETB {product.price.amount.toLocaleString()}</div>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <h3 className="font-display text-xl font-bold">{product.title.en}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{product.description.en}</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">Rating</p>
            <p className="font-semibold">{product.rating} / 5</p>
          </div>
          <button onClick={() => addItem(product)} className="rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-glow">
            Add to cart
          </button>
        </div>
      </div>
    </motion.article>
  );
}