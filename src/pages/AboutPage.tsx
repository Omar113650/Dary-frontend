import { useLocale } from '../utils/LocaleContext';
import HowItWorks from '../components/HowItWorks/HowItWorks';
import WhyDary from '../components/WhyDary/WhyDary';
import './AboutPage.css';

export default function AboutPage() {
  const { t } = useLocale();

  return (
    <main className="about-page">
      {/* Page Header */}
      <header className="about-hero">
        <div className="container">
          <h1 className="about-title">{t.page_about_title}</h1>
          <p className="about-lead">{t.footer_desc}</p>
        </div>
      </header>

      {/* How DARY Works (First) */}
      <HowItWorks />

      {/* Why Students Choose DARY (Second) */}
      <WhyDary />
    </main>
  );
}
