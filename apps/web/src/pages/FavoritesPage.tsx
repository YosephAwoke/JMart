import { useEffect, useMemo, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { fetchProducts } from '../services/products';
import { useAuth } from '../providers/AuthProvider';

export default function FavoritesPage() {
  const { user } = useAuth();
  const [all, setAll] = useState([] as any[]);

  useEffect(() => {
    fetchProducts().then((p) => setAll(p)).catch(() => setAll([]));
  }, []);

  const favorites = useMemo(() => {
    if (!user?.favorites?.length) return [];
    return all.filter((p) => user!.favorites!.includes(p.id));
  }, [all, user]);

  if (!user) return <div className="text-center text-sm text-muted">Sign in to see your favorites.</div>;

  return (
    <div>
      <h1 className="font-display text-3xl font-black">Your favorites</h1>
      {favorites.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No favorites yet — add products to your favorites.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
