import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useCart } from '../providers/CartProvider';

export function CartDrawer() {
  const { isOpen, closeCart, items, total, removeItem, setItemQuantity } = useCart();
  const location = useLocation();

  useEffect(() => {
    if (isOpen) closeCart();
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-background shadow-premium"
          >
            <div className="border-b border-border p-5">
              <h3 className="font-display text-2xl font-bold">Your cart</h3>
              <p className="mt-1 text-sm text-muted">Animated, backdrop-blurred, and ready for checkout.</p>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {items.length === 0 ? <p className="text-sm text-muted">No items in cart yet.</p> : null}
              {items.map((item) => {
                const cartKey = item.cartKey ?? item.productId;
                return (
                <div key={cartKey} className="flex gap-4 rounded-2xl border border-border bg-surface p-3">
                  <img src={item.image} alt={item.title.en} className="h-20 w-20 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold">{item.title.en}</p>
                    {item.variantLabel ? <p className="text-xs text-muted">{item.variantLabel}</p> : null}
                    <p className="text-sm text-muted">ETB {item.price.amount.toLocaleString()}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <QtyButton onClick={() => setItemQuantity(cartKey, item.quantity - 1)}>-</QtyButton>
                      <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <QtyButton onClick={() => setItemQuantity(cartKey, item.quantity + 1)}>+</QtyButton>
                      <button className="ml-2 text-sm text-accent" onClick={() => removeItem(cartKey)}>Remove</button>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
            <div className="border-t border-border p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="font-semibold">ETB {total.toLocaleString()}</span>
              </div>
              <Link to="/checkout" onClick={closeCart} className="mt-4 block w-full rounded-full bg-accent px-4 py-3 text-center font-semibold text-white shadow-glow">
                Proceed to checkout
              </Link>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function QtyButton({ children, onClick }: { children: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold hover:border-accent hover:text-accent">
      {children}
    </button>
  );
}