import { useLocale } from '../../utils/LocaleContext';
import './TrustFeatures.css';

export default function TrustFeatures() {
  const { t } = useLocale();

  const values = [
    {
      title: t.trust_easiest,
      desc: t.trust_easiest_desc,
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
    },
    {
      title: t.trust_direct,
      desc: t.trust_direct_desc,
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: t.trust_trusted,
      desc: t.trust_trusted_desc,
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="values-section" aria-label="DARY Core Values">
      <div className="container">
        <div className="values-grid">
          {values.map((item) => (
            <div className="value-column" key={item.title}>
              <div className="value-icon-wrap" aria-hidden="true">
                {item.icon}
              </div>
              <div className="value-text-block">
                <h3 className="value-title">{item.title}</h3>
                <p className="value-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
