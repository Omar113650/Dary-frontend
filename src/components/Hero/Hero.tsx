import { useLocale } from '../../utils/LocaleContext';
import PropertySearch from '../PropertySearch/PropertySearch';
import heroApartmentImg from '../../assets/hero/hero-apartment.jpg';
import './Hero.css';

export default function Hero() {
  const { t, locale } = useLocale();

  return (
    <section className="hero-section" aria-label="Hero">
      {/* Full-Width Hero Banner */}
      <div className="hero-banner">
        {/* Full-bleed Photo & Directional Soft Light Overlay */}
        <div className="hero-media-wrap">
          <img
            src={heroApartmentImg}
            alt="Modern Student Apartment Bedroom"
            className="hero-image"
            loading="eager"
          />
          <div className="hero-top-transition" />
          <div className="hero-overlay" />
        </div>

        {/* Content Container — Left aligned in English, Right aligned in Arabic */}
        <div className="hero-content-container container">
          <div className="hero-content-card">
            <h1 className="hero-headline">
              {locale === 'en' ? (
                <>
                  We connect you
                  <br />
                  with what suits you
                </>
              ) : (
                t.hero_headline
              )}
            </h1>
          </div>
        </div>
      </div>

      {/* Floating Centered Search Component */}
      <div className="hero-search-area">
        <PropertySearch />
      </div>
    </section>
  );
}
