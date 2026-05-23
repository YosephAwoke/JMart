import { HeroSection } from '../components/HeroSection';
import { BrandStrip } from '../components/BrandStrip';
import { Showcase } from '../components/Showcase';
import { ProductGrid } from '../components/ProductGrid';
import { CheckoutPreview } from '../components/CheckoutPreview';
import { Testimonials } from '../components/Testimonials';
import { BestSellersStory, CategoryStrip, PremiumFooter, StoreHighlights } from '../components/LandingSections';

export function HomePage() {
  return (
    <div className="flex flex-col gap-10">
      <HeroSection />
      <BrandStrip />
      <StoreHighlights />
      <CategoryStrip />
      <Showcase />
      <ProductGrid />
      <BestSellersStory />
      <Testimonials />
      <CheckoutPreview />
      <PremiumFooter />
    </div>
  );
}