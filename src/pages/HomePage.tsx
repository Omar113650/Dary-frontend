import Hero from '../components/Hero/Hero';
import TrustFeatures from '../components/TrustFeatures/TrustFeatures';
import FeaturedProperties from '../components/FeaturedProperties/FeaturedProperties';
import CallToAction from '../components/CallToAction/CallToAction';

export default function HomePage() {
  return (
    <main className="homepage">
      <Hero />
      <TrustFeatures />
      <FeaturedProperties />
      <CallToAction />
    </main>
  );
}
