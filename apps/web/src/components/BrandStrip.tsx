import { motion } from 'framer-motion';

const logos = [
  { name: 'Adidas', src: 'https://cdn.simpleicons.org/adidas/111111' },
  { name: 'Nike', src: 'https://cdn.simpleicons.org/nike/111111' },
  { name: 'Puma', src: 'https://cdn.simpleicons.org/puma/111111' },
  { name: 'Apple', src: 'https://cdn.simpleicons.org/apple/111111' },
  { name: 'Samsung', src: 'https://cdn.simpleicons.org/samsung/111111' },
  { name: 'Sony', src: 'https://cdn.simpleicons.org/sony/111111' }
];

export function BrandStrip() {
  return (
    <section className="w-full py-2">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Featured brands</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">Recognizable names shoppers know.</h2>
          </div>
          <p className="hidden max-w-sm text-right text-sm leading-6 text-muted md:block">A real logo band gives the page a stronger retail feel and reads clearly in both themes.</p>
        </div>
        <motion.div
          className="flex w-max items-center gap-4 rounded-[1.75rem] border border-border bg-surface/60 px-4 py-4 backdrop-blur-xl"
          initial={{ x: 0 }}
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        >
          {[...logos, ...logos].map((brand, index) => (
            <div key={`${brand.name}-${index}`} className="flex h-16 w-40 flex-shrink-0 items-center justify-center rounded-2xl border border-border bg-background/60 px-4 shadow-sm">
              <img src={brand.src} alt={`${brand.name} logo`} className="max-h-10 w-full object-contain grayscale dark:invert" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
