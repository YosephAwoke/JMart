import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import type { CartItem, ProductSummary } from '@jmart/shared';

interface CartContextValue {
  items: CartItem[];
  total: number;
  isOpen: boolean;
  addItem: (product: ProductSummary) => void;
  removeItem: (productId: string) => void;
  setItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price.amount * item.quantity, 0);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      total,
      isOpen,
      addItem: (product) => {
        setItems((current) => {
          const existing = current.find((item) => item.productId === product.id);
          if (existing) {
            return current.map((item) =>
              item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
          }

          return [
            ...current,
            {
              productId: product.id,
              title: product.title,
              price: product.price,
              image: product.images[0]?.url ?? '',
              quantity: 1
            }
          ];
        });
        setIsOpen(true);
      },
      removeItem: (productId) => setItems((current) => current.filter((item) => item.productId !== productId)),
      setItemQuantity: (productId, quantity) =>
        setItems((current) =>
          current
            .map((item) => (item.productId === productId ? { ...item, quantity } : item))
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