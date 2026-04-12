import { getBestSellers } from '@/lib/services/actions/product.service';
import BestsellersCarousel from '@/components/pages/landing/BestsellersCarousel';

export default async function Bestsellers() {
  const products = await getBestSellers();

  if (products.length === 0) return null;

  return (
    <section className="pb-24 px-16 bg-card/30">
      <div className="container mx-auto px-4">
        <BestsellersCarousel products={products} />
      </div>
    </section>
  );
}