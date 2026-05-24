import { useMemo } from 'react';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../providers/AuthProvider';

export default function FavoritesPage() {
  const { user, favorites: favoriteIds } = useAuth();
  const { products: all } = useProducts('', 'all', 'recommended');

  const favorites = useMemo(() => {
    if (!favoriteIds.length) return [];
    return all.filter((p) => favoriteIds.includes(p.id));
  }, [all, favoriteIds]);

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
