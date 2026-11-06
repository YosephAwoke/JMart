import { HeroSection } from '../components/HeroSection';
import { BrandStrip } from '../components/BrandStrip';
import { Showcase } from '../components/Showcase';
import { ProductGrid } from '../components/ProductGrid';
import { CheckoutPreview } from '../components/CheckoutPreview';
import { Testimonials } from '../components/Testimonials';
import { BestSellersStory, CategoryStrip, PremiumFooter, StoreHighlights } from '../components/LandingSections';
import { useProducts } from '../hooks/useProducts';

export function HomePage() {
  const { products } = useProducts('', 'all');

  return (
    <div className="flex flex-col gap-10">
      <HeroSection products={products} />
      <BrandStrip />
      <StoreHighlights />
      <CategoryStrip />
      <Showcase products={products} />
      <ProductGrid products={products} />
      <BestSellersStory products={products} />
      <Testimonials />
      <CheckoutPreview products={products} />
      <PremiumFooter />
    </div>
  );
}