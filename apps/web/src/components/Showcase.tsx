import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts } from '../hooks/useProducts';
import { useLocale } from '../providers/LocaleProvider';

export function Showcase() {
  const { products } = useProducts('', 'all');
  const featured = products.slice(0, 3);
  const { language } = useLocale();

  if (featured.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <motion.div className="lg:col-span-2 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-xl p-6 text-white shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {featured[0] && (
            <Link to={`/product/${featured[0].id}`} className="flex h-full items-end w-full">
              <div className="w-full">
                <h3 className="text-3xl font-semibold leading-tight">{featured[0].title?.[language] || ''}</h3>
                <p className="mt-2 max-w-xl opacity-90">{featured[0].description?.[language]?.slice(0, 120) || ''}</p>
                <div className="mt-4">
                  <span className="inline-block bg-white/20 px-4 py-2 rounded-md">Shop Now</span>
                </div>
              </div>
              <div className="ml-auto hidden md:block w-56 h-56 flex-shrink-0">
                <img src={featured[0].images?.[0]?.url} alt={featured[0].title?.en || 'product'} className="w-full h-full object-cover rounded-lg" />
              </div>
            </Link>
          )}
        </motion.div>

        <div className="flex flex-col gap-6">
          {featured.slice(1).map((p) => (
            <motion.div key={p.id} className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm flex items-center gap-4"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img src={p.images?.[0]?.url} alt={p.title?.en || 'product'} className="w-20 h-20 object-cover rounded-md" />
              <div>
                <h4 className="font-semibold">{p.title?.[language] || ''}</h4>
                <p className="text-sm opacity-80">{p.price ? `${p.price.amount} ${p.price.currency}` : ''}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
