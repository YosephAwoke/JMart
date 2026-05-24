import { motion } from 'framer-motion';
import type { ProductSummary } from '@jmart/shared';
import { useCart } from '../providers/CartProvider';
import { useAuth } from '../providers/AuthProvider';

export function ProductCard({ product }: { product: ProductSummary }) {
  const { addItem } = useCart();
  const { user, addFavorite, removeFavorite } = useAuth();

  const isFav = Boolean(user?.favorites?.includes(product.id));

  return (
    <motion.article whileHover={{ y: -6 }} className="overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-sm transition-shadow hover:shadow-premium">
      <div className="relative aspect-[4/3] overflow-hidden bg-surfaceAlt">
        <img src={product.images[0]?.url} alt={product.images[0]?.alt.en} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
        <div className="absolute left-4 top-4 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold backdrop-blur">ETB {product.price.amount.toLocaleString()}</div>
        <button
          aria-label={isFav ? 'Remove favorite' : 'Add favorite'}
          onClick={(e) => {
            e.stopPropagation();
            if (!user) return;
            if (isFav) removeFavorite(product.id).catch(() => {});
            else addFavorite(product.id).catch(() => {});
          }}
          className="absolute right-4 top-4 rounded-full bg-background/80 p-2 backdrop-blur"
        >
          <svg className={`${isFav ? 'fill-accent text-accent' : 'text-foreground'} h-5 w-5`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 21s-7-4.35-9.5-7.1C-1 10.5 3.2 5 7.5 6.4 9.6 7.2 12 10 12 10s2.4-2.8 4.5-3.6C20.8 5 25 10.5 21.5 13.9 19 16.65 12 21 12 21z" />
          </svg>
        </button>
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