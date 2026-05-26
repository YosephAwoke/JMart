import { motion } from 'framer-motion';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { ProductComment, ProductSummary } from '@jmart/shared';
import { mockCatalog } from '../data/mockCatalog';
import { useCart } from '../providers/CartProvider';
import { useAuth } from '../providers/AuthProvider';
import { fetchProductBySlug } from '../services/products';
import { inputFieldClass } from '../components/forms/inputStyles';

type ProductDetail = ProductSummary;

const detailMeta: Record<string, { brand: string; vendor: string; companyDescription: string; availableSizes: string[]; availableColors: string[]; orderCount: number }> = {
  'aurora-bag': {
    brand: 'Aurora Atelier',
    vendor: 'JMart Select',
    companyDescription: 'Crafted in Addis Ababa with a focus on clean silhouettes, durable stitching, and elevated daily carry.',
    availableSizes: ['One size'],
    availableColors: ['Olive', 'Sand', 'Black'],
    orderCount: 1240
  },
  'sera-sneakers': {
    brand: 'Sera Motion',
    vendor: 'JMart Select',
    companyDescription: 'Built for city movement, comfort, and a minimal premium profile that works with everyday wardrobes.',
    availableSizes: ['40', '41', '42', '43'],
    availableColors: ['White', 'Bone', 'Graphite'],
    orderCount: 980
  },
  'nala-fragrance': {
    brand: 'Nala House',
    vendor: 'JMart Gift Edit',
    companyDescription: 'A soft, modern fragrance house with gift-friendly packaging and warm expressive notes.',
    availableSizes: ['50ml', '100ml'],
    availableColors: ['Rose Gold', 'Cream', 'Charcoal'],
    orderCount: 1580
  }
};

export function ProductPage() {
  const { slug } = useParams();
  const { user, token } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const initialProduct = useMemo(() => (slug ? mockCatalog.find((item) => item.slug === slug) ?? null : null), [slug]);
  const [product, setProduct] = useState<ProductDetail | null>(initialProduct);
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [activeImageId, setActiveImageId] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [commentBusy, setCommentBusy] = useState(false);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  useLayoutEffect(() => {
    if (!slug) return;

    window.scrollTo(0, 0);

    const localProduct = mockCatalog.find((item) => item.slug === slug) ?? null;
    setProduct(localProduct ?? initialProduct);
    setComments([]);
    setCommentText('');
    setCommentBusy(false);
    setZoomLevel(1);
    setQuantity(1);
    setActiveImageId((localProduct ?? initialProduct)?.images[0]?.id ?? '');

    const meta = localProduct ? detailMeta[localProduct.slug] : undefined;
    const fallbackProduct = localProduct ?? initialProduct;
    setSelectedSize(meta?.availableSizes[0] ?? fallbackProduct?.variants[0]?.value ?? '');
    setSelectedColor(meta?.availableColors[0] ?? '');
  }, [slug, initialProduct]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!slug) return;

      // Load comments in the background so the detail page renders immediately.
      fetch(`/api/products/${encodeURIComponent(slug)}/comments`)
        .then((res) => (res.ok ? res.json() : { data: [] }))
        .then((payload) => {
          if (mounted) setComments(payload.data ?? []);
        })
        .catch(() => undefined);

      const detail = await fetchProductBySlug(slug);
      if (!mounted) return;
      const resolved = detail ?? mockCatalog.find((item) => item.slug === slug) ?? initialProduct ?? null;
      setProduct(resolved);
      setActiveImageId(resolved?.images[0]?.id ?? '');
      const meta = resolved ? detailMeta[resolved.slug] : undefined;
      setSelectedSize(meta?.availableSizes[0] ?? resolved?.variants[0]?.value ?? '');
      setSelectedColor(meta?.availableColors[0] ?? '');
    }
    load();
    return () => {
      mounted = false;
    };
  }, [slug, initialProduct]);

  const detail = product ? detailMeta[product.slug] ?? detailMeta['aurora-bag'] : null;
  const activeImage = useMemo(() => product?.images.find((image) => image.id === activeImageId) ?? product?.images[0], [product, activeImageId]);
  const relatedProducts = useMemo(
    () => mockCatalog.filter((item) => item.slug !== (product?.slug ?? slug ?? '')).slice(0, 3),
    [product?.slug, slug]
  );
  const productViews = Math.max(product?.orderCount ?? detail?.orderCount ?? 0, Math.round((product?.reviewCount ?? 0) * 7.5));

  function moveImage(direction: -1 | 1) {
    if (!product) return;
    const currentIndex = Math.max(0, product.images.findIndex((image) => image.id === activeImageId));
    const nextIndex = (currentIndex + direction + product.images.length) % product.images.length;
    setActiveImageId(product.images[nextIndex]?.id ?? product.images[0].id);
    setZoomLevel(1);
  }

  function resetZoom() {
    setZoomLevel(1);
  }

  function changeZoom(direction: -1 | 1) {
    setZoomLevel((current) => {
      const next = current + direction * 0.25;
      return Math.min(2.5, Math.max(1, Number(next.toFixed(2))));
    });
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!slug || !user || !commentText.trim()) return;
    setCommentBusy(true);
    try {
      const response = await fetch(`/api/products/${encodeURIComponent(slug)}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token ?? ''}`
        },
        body: JSON.stringify({ text: commentText, authorName: user.fullName })
      });
      if (!response.ok) throw new Error('Could not submit comment');
      const payload = (await response.json()) as { data: ProductComment };
      setComments((current) => [payload.data, ...current]);
      setCommentText('');
    } finally {
      setCommentBusy(false);
    }
  }

  if (!product) {
    return (
      <div className="rounded-[2rem] border border-border bg-surface p-8 text-center shadow-premium">
        <p className="text-sm text-muted">Loading product details...</p>
      </div>
    );
  }

  const addQty = () => setQuantity((current) => current + 1);
  const subQty = () => setQuantity((current) => Math.max(1, current - 1));

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-2 text-sm text-muted">
        <Link to="/catalog" className="hover:text-accent">Catalog</Link>
        <span>/</span>
        <span>{product.title.en}</span>
      </div>

      <section className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
        <motion.div layout className="space-y-4 rounded-[2rem] border border-border bg-surface p-4 shadow-premium">
          <motion.div
            className="relative overflow-hidden rounded-[1.75rem] border border-border bg-background"
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          >
            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={() => moveImage(-1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-950/80 text-lg font-bold text-white shadow-lg backdrop-blur transition hover:bg-slate-950"
                aria-label="Previous image"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => moveImage(1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-950/80 text-lg font-bold text-white shadow-lg backdrop-blur transition hover:bg-slate-950"
                aria-label="Next image"
              >
                →
              </button>
            </div>
            <div className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full bg-white/85 p-1.5 shadow-lg backdrop-blur">
              <button
                type="button"
                onClick={() => changeZoom(-1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xl font-black leading-none text-white transition hover:bg-slate-800"
                aria-label="Zoom out"
              >
                −
              </button>
              <button
                type="button"
                onClick={resetZoom}
                className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
                aria-label="Reset zoom"
              >
                100%
              </button>
              <button
                type="button"
                onClick={() => changeZoom(1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xl font-black leading-none text-white transition hover:bg-slate-800"
                aria-label="Zoom in"
              >
                +
              </button>
            </div>
            <motion.img
              key={activeImage?.id}
              src={activeImage?.url}
              alt={activeImage?.alt.en}
              initial={{ scale: 1.02, opacity: 0.5, y: 6 }}
              animate={{ scale: zoomLevel, opacity: 1, y: 0 }}
              exit={{ scale: 1.03, opacity: 0.2 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,18,0.08),transparent_30%,rgba(3,7,18,0.24)_100%)]" />
            <div className="absolute bottom-4 left-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-900 backdrop-blur">
              Zoom level {Math.round(zoomLevel * 100)}%
            </div>
            <div className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">{detail?.brand ?? 'JMart Select'}</div>
          </motion.div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              <span>Swipe gallery</span>
              <div className="flex items-center gap-2">
                <span>{product.images.length} photos</span>
              </div>
            </div>
            <div ref={galleryRef} className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
              {product.images.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => {
                    setActiveImageId(image.id);
                    setZoomLevel(1);
                  }}
                  className={['min-w-24 overflow-hidden rounded-2xl border transition snap-start', activeImageId === image.id ? 'border-accent ring-2 ring-accent/20' : 'border-border'].join(' ')}
                >
                  <img src={image.url} alt={image.alt.en} className="h-24 w-24 object-cover" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="space-y-6 rounded-[2rem] border border-border bg-surface p-6 shadow-premium xl:sticky xl:top-6">
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
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
              <InfoPill label={`${product.orderCount ?? detail?.orderCount ?? 0}+ ordered`} />
              <InfoPill label={`${product.reviewCount} reviews`} />
              <InfoPill label={detail?.vendor ?? 'Trusted seller'} />
              <InfoPill label={`${productViews}+ views`} />
            </div>
          </div>

          <ChoiceGroup title="Size" values={detail?.availableSizes ?? product.variants.map((variant) => variant.value)} value={selectedSize} onChange={setSelectedSize} />
          <ChoiceGroup title="Color" values={detail?.availableColors ?? ['Default']} value={selectedColor} onChange={setSelectedColor} visual />

          <div className="grid gap-3 sm:grid-cols-3">
            <Feature title="Stock" value={`${product.stock} available`} />
            <Feature title="Rating" value={`${product.rating} / 5`} />
            <Feature title="Orders" value={`${detail?.orderCount ?? product.orderCount ?? 0}`} />
          </div>

          <div className="rounded-3xl border border-border bg-background p-4">
            <div className="flex items-center justify-between text-sm text-muted">
              <span>Quantity</span>
              <span>{selectedSize || 'One size'} • {selectedColor || 'Default'}</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <QtyButton onClick={subQty}>-</QtyButton>
              <span className="min-w-10 text-center font-semibold">{quantity}</span>
              <QtyButton onClick={addQty}>+</QtyButton>
              <button
                onClick={() => {
                  const variantLabel = [selectedSize, selectedColor].filter(Boolean).join(' • ');
                  for (let index = 0; index < quantity; index += 1) addItem(product, variantLabel || undefined);
                }}
                className="ml-auto rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-glow"
              >
                Add to cart
              </button>
              <button onClick={() => navigate('/checkout')} className="rounded-full border border-border bg-surfaceAlt px-5 py-3 text-sm font-semibold">
                Buy now
              </button>
            </div>
          </div>

          <div className="grid gap-3 rounded-3xl border border-border bg-background p-4 sm:grid-cols-2">
            <MiniBox title="Company" text={detail?.brand ?? 'JMart Select'} />
            <MiniBox title="Made for" text={detail?.companyDescription ?? product.description.en} />
          </div>
        </div>
      </section>

      <div className="fixed inset-x-3 bottom-3 z-30 rounded-[1.5rem] border border-border bg-background/95 p-3 shadow-premium backdrop-blur xl:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Ready to order</p>
            <p className="mt-1 text-sm font-semibold">ETB {product.price.amount.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const variantLabel = [selectedSize, selectedColor].filter(Boolean).join(' • ');
                for (let index = 0; index < quantity; index += 1) addItem(product, variantLabel || undefined);
              }}
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-glow"
            >
              Add to cart
            </button>
            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="rounded-full border border-border bg-surfaceAlt px-4 py-2 text-sm font-semibold"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-premium">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">About the seller</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">{detail?.brand ?? 'JMart Select'}</h2>
          <p className="mt-3 text-sm leading-7 text-muted">{detail?.companyDescription ?? 'Premium local seller with quality-focused product presentation and fast delivery readiness.'}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Feature title="Orders" value={`${detail?.orderCount ?? 0}`} />
            <Feature title="Seller" value={detail?.vendor ?? 'Verified'} />
            <Feature title="Support" value="Chat & call" />
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-premium">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">What shoppers say</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">Comments & reviews</h2>

          <form onSubmit={submitComment} className="mt-5 space-y-4 rounded-3xl border border-border bg-background p-4">
            <label className="block text-sm">
              <span>Leave a comment</span>
              <textarea
                rows={4}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className={inputFieldClass}
                placeholder="Tell other customers what you think about this product"
              />
            </label>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs leading-5 text-muted">Comments are shared with other customers who open this product page.</p>
              <button disabled={!user || commentBusy} className="rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
                {user ? (commentBusy ? 'Posting...' : 'Post comment') : 'Sign in to comment'}
              </button>
            </div>
          </form>

          <div className="mt-5 space-y-3">
            {comments.length === 0 ? <p className="text-sm text-muted">No comments yet. Be the first to share feedback.</p> : null}
            {comments.map((comment) => (
              <div key={comment.id} className="rounded-3xl border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{comment.authorName}</p>
                  <p className="text-xs text-muted">{new Date(comment.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Related products</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">More items customers often compare.</h2>
          </div>
          <Link to="/catalog" className="rounded-full border border-border bg-surfaceAlt px-4 py-2 text-sm font-semibold">
            Browse all
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {relatedProducts.map((related) => (
            <motion.div key={related.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-sm transition hover:shadow-premium">
                <Link to={`/products/${related.slug}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-surfaceAlt">
                    <img src={related.images[0]?.url} alt={related.images[0]?.alt.en} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                    <div className="absolute left-4 top-4 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold backdrop-blur">ETB {related.price.amount.toLocaleString()}</div>
                  </div>
                </Link>
                <div className="space-y-3 p-5">
                  <div>
                    <h3 className="font-display text-xl font-bold">{related.title.en}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted line-clamp-2">{related.description.en}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm text-muted">
                    <span>{related.rating} / 5</span>
                    <span>{related.reviewCount} reviews</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => addItem(related)}
                    className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-glow"
                  >
                    Quick add
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ChoiceGroup({ title, values, value, onChange, visual = false }: { title: string; values: string[]; value: string; onChange: (value: string) => void; visual?: boolean }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">{title}</p>
      <div className="flex flex-wrap gap-3">
        {values.map((entry) => (
          <button
            key={entry}
            onClick={() => onChange(entry)}
            className={[
              'rounded-full border px-4 py-2 text-sm font-semibold transition',
              value === entry ? 'border-accent bg-accent text-white shadow-glow' : 'border-border bg-surfaceAlt'
            ].join(' ')}
          >
            {visual ? <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full border border-white/30" style={{ backgroundColor: colorToHex(entry) }} />{entry}</span> : entry}
          </button>
        ))}
      </div>
    </div>
  );
}

function colorToHex(color: string) {
  const map: Record<string, string> = {
    Olive: '#6b8e23',
    Sand: '#d8c3a5',
    Black: '#111827',
    White: '#f8fafc',
    Bone: '#e7dccb',
    Graphite: '#374151',
    'Rose Gold': '#b76e79',
    Cream: '#f5ead6',
    Charcoal: '#2f3640',
    Default: '#94a3b8'
  };
  return map[color] ?? '#94a3b8';
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

function QtyButton({ children, onClick }: { children: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-sm font-semibold hover:border-accent hover:text-accent">
      {children}
    </button>
  );
}

function InfoPill({ label }: { label: string }) {
  return <span className="rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</span>;
}