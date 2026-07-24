import { getCategories } from '@/lib/services/actions/category.service';
import FeaturedCategoriesCarousel from '@/components/pages/landing/FeaturedCategoriesCarousel';

const MAX_FEATURED = 8;

export default async function FeaturedCategories() {
  const categories = await getCategories();
  const featured = categories.slice(0, MAX_FEATURED);

  if (featured.length === 0) return null;

  return (
    <section className="py-12 lg:py-24 px-4 md:px-16 bg-midnight-charcoal max-md:px-8">
      <div className="container mx-auto">
        <FeaturedCategoriesCarousel categories={featured} />
      </div>
    </section>
  );
}