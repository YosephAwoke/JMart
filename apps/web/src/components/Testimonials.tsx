import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sample = [
  { name: 'Amanuel', text: 'Fast delivery and lovely packaging — highly recommend JMart!', city: 'Addis Ababa' },
  { name: 'Sara', text: "Great quality — I ordered three items and they all exceeded expectations.", city: 'Bahir Dar' },
  { name: 'Michael', text: 'Customer service answered quickly and helped with sizing.', city: 'Dire Dawa' },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % sample.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="w-full py-8 bg-gradient-to-r from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-800">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h3 className="text-xl font-semibold mb-4">What our customers say</h3>
        <div className="relative h-28">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.45 }}
              className="text-lg leading-snug"
            >
              “{sample[index].text}”
              <footer className="mt-3 text-sm opacity-80">— {sample[index].name}, {sample[index].city}</footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
