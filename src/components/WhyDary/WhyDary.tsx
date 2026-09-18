import { useLocale } from '../../utils/LocaleContext';
import './WhyDary.css';

export default function WhyDary() {
  const { t } = useLocale();

  const points = [
    {
      title: t.why_direct,
      desc: t.why_direct_desc,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: t.why_time,
      desc: t.why_time_desc,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      title: t.why_cost,
      desc: t.why_cost_desc,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
      ),
    },
    {
      title: t.why_transparent,
      desc: t.why_transparent_desc,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
  ];

  return (
    <section className="why-section section" aria-label="Why DARY">
      <div className="container">
        <div className="section-header">
          <span className="section-tagline">{t.why_tagline}</span>
          <h2 className="section-title">{t.why_title}</h2>
        </div>

        <div className="why-grid">
          {points.map((p) => (
            <div className="why-card" key={p.title}>
              <div className="why-icon-wrap">{p.icon}</div>
              <div className="why-card-text">
                <h3 className="why-card-title">{p.title}</h3>
                <p className="why-card-desc">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
