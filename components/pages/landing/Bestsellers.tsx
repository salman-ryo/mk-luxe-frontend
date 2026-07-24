import { getBestSellers } from '@/lib/services/actions/product.service';
import BestsellersCarousel from '@/components/pages/landing/BestsellersCarousel';

export default async function Bestsellers() {
  const products = await getBestSellers();

  if (products.length === 0) return null;

  return (
    <section className="pb-12 lg:pb-24 px-4 md:px-16 bg-card/30 max-md:px-8">
      <div className="container mx-auto">
        <BestsellersCarousel products={products} />
      </div>
    </section>
  );
}