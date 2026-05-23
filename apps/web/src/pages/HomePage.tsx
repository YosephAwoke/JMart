import { HeroSection } from '../components/HeroSection';
import { ProductGrid } from '../components/ProductGrid';
import { CheckoutPreview } from '../components/CheckoutPreview';
import { BestSellersStory, CategoryStrip, PremiumFooter, StoreHighlights } from '../components/LandingSections';

export function HomePage() {
  return (
    <div className="flex flex-col gap-10">
      <HeroSection />
      <StoreHighlights />
      <CategoryStrip />
      <ProductGrid />
      <BestSellersStory />
      <CheckoutPreview />
      <PremiumFooter />
    </div>
  );
}