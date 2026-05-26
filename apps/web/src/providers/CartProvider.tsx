import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, ProductSummary } from '@jmart/shared';
import { useAuth } from './AuthProvider';

interface CartContextValue {
  items: CartItem[];
  total: number;
  isOpen: boolean;
  addItem: (product: ProductSummary, variantLabel?: string) => void;
  removeItem: (cartKey: string) => void;
  setItemQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const storageKey = user?.id ? `jmart-cart-${user.id}` : 'jmart-cart-guest';

  const [items, setItems] = useState<CartItem[]>(() => loadCart(storageKey));
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setItems(loadCart(storageKey));
    setIsOpen(false);
  }, [storageKey]);

  useEffect(() => {
    saveCart(storageKey, items);
  }, [storageKey, items]);

  const total = items.reduce((sum, item) => sum + item.price.amount * item.quantity, 0);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      total,
      isOpen,
      addItem: (product, variantLabel) => {
        const cartKey = variantLabel ? `${product.id}:${variantLabel}` : product.id;
        setItems((current) => {
          const existing = current.find((item) => (item.cartKey ?? item.productId) === cartKey);
          if (existing) {
            return current.map((item) =>
              (item.cartKey ?? item.productId) === cartKey ? { ...item, quantity: item.quantity + 1 } : item
            );
          }

          return [
            ...current,
            {
              cartKey,
              productId: product.id,
              title: product.title,
              price: product.price,
              image: product.images[0]?.url ?? '',
              quantity: 1,
              variantLabel
            }
          ];
        });
        setIsOpen(true);
      },
      removeItem: (cartKey) => setItems((current) => current.filter((item) => (item.cartKey ?? item.productId) !== cartKey)),
      setItemQuantity: (cartKey, quantity) =>
        setItems((current) =>
          current
            .map((item) => ((item.cartKey ?? item.productId) === cartKey ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0)
        ),
      clearCart: () => setItems([]),
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false)
    }),
    [items, isOpen, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return context;
}

function loadCart(storageKey: string) {
  if (typeof window === 'undefined') return [] as CartItem[];
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(storageKey: string, items: CartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  } catch {
    // ignore storage errors
  }
}