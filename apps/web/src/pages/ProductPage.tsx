import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockCatalog } from '../data/mockCatalog';
import { useCart } from '../providers/CartProvider';
import { useProducts } from '../hooks/useProducts';

export function ProductPage() {
  const { slug } = useParams();
  const { products } = useProducts('', 'all', 'recommended');
  const product = useMemo(() => products.find((item) => item.slug === slug) ?? mockCatalog.find((item) => item.slug === slug) ?? mockCatalog[0], [products, slug]);
  const [activeImageId, setActiveImageId] = useState(product.images[0]?.id ?? '');
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]?.value ?? '');
  const { addItem } = useCart();

  const activeImage = product.images.find((image) => image.id === activeImageId) ?? product.images[0];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 text-sm text-muted">
        <Link to="/catalog" className="hover:text-accent">Catalog</Link>
        <span>/</span>
        <span>{product.title.en}</span>
      </div>

      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div layout className="space-y-4 rounded-[2rem] border border-border bg-surface p-4 shadow-premium">
          <div className="overflow-hidden rounded-[1.5rem] bg-surfaceAlt">
            <img src={activeImage?.url} alt={activeImage?.alt.en} className="aspect-[4/3] w-full object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {product.images.map((image) => (
              <button
                key={image.id}
                onClick={() => setActiveImageId(image.id)}
                className={[
                  'overflow-hidden rounded-2xl border transition',
                  activeImageId === image.id ? 'border-accent ring-2 ring-accent/20' : 'border-border'
                ].join(' ')}
              >
                <img src={image.url} alt={image.alt.en} className="h-24 w-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>

        <div className="space-y-6 rounded-[2rem] border border-border bg-surface p-6 shadow-premium">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Signature item</p>
            <h1 className="mt-2 font-display text-4xl font-black tracking-tight">{product.title.en}</h1>
            <p className="mt-3 text-sm leading-7 text-muted">{product.description.en}</p>
          </div>

          <div className="rounded-3xl border border-border bg-surfaceAlt p-4">
            <p className="text-sm text-muted">Price</p>
            <div className="mt-1 flex items-end gap-3">
              <span className="font-display text-4xl font-black text-accent">ETB {product.price.amount.toLocaleString()}</span>
              {product.compareAtPrice ? <span className="pb-1 text-sm text-muted line-through">ETB {product.compareAtPrice.amount.toLocaleString()}</span> : null}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Variant</p>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant.value)}
                  className={[
                    'rounded-full border px-4 py-2 text-sm font-semibold transition',
                    selectedVariant === variant.value ? 'border-accent bg-accent text-white shadow-glow' : 'border-border bg-surfaceAlt'
                  ].join(' ')}
                >
                  {variant.value}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Feature title="Stock" value={`${product.stock} available`} />
            <Feature title="Rating" value={`${product.rating} / 5`} />
            <Feature title="Reviews" value={`${product.reviewCount}`} />
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => addItem(product)} className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-glow">
              Add to cart
            </button>
            <Link to="/checkout" className="rounded-full border border-border bg-surfaceAlt px-5 py-3 text-sm font-semibold">
              Buy now
            </Link>
          </div>

          <div className="grid gap-3 rounded-3xl border border-border bg-background p-4 sm:grid-cols-2">
            <MiniBox title="Elegant shipping" text="Addis-first delivery notes and landmark capture." />
            <MiniBox title="Fast checkout" text="Add to cart and continue to payment in a few taps." />
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{title}</p>
      <p className="mt-2 text-sm font-semibold">{value}</p>
    </div>
  );
}

function MiniBox({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
    </div>
  );
}