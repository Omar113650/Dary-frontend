import { useLocale } from '../../utils/LocaleContext';
import { locationOptions, typeOptions, priceOptions } from '../../data/properties';
import './PropertySearch.css';

export default function PropertySearch() {
  const { t, locale } = useLocale();

  return (
    <div className="search-container" role="search">
      {/* 1. Location */}
      <div className="search-segment">
        <div className="search-badge" aria-hidden="true">
          <svg
            className="search-field-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div className="search-text-col">
          <label htmlFor="search-location" className="search-label">
            {t.search_location}
          </label>
          <select id="search-location" className="search-select">
            <option value="">{t.search_all_locations}</option>
            {locationOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label[locale]}
              </option>
            ))}
          </select>
        </div>
        <svg
          className="search-chevron"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      <div className="search-divider" aria-hidden="true" />

      {/* 2. Property Type */}
      <div className="search-segment">
        <div className="search-badge" aria-hidden="true">
          <svg
            className="search-field-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <div className="search-text-col">
          <label htmlFor="search-type" className="search-label">
            {t.search_type}
          </label>
          <select id="search-type" className="search-select">
            <option value="">{t.search_all_types}</option>
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label[locale]}
              </option>
            ))}
          </select>
        </div>
        <svg
          className="search-chevron"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      <div className="search-divider" aria-hidden="true" />

      {/* 3. Price */}
      <div className="search-segment">
        <div className="search-badge" aria-hidden="true">
          <svg
            className="search-field-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
            <path d="M7 7h.01" />
          </svg>
        </div>
        <div className="search-text-col">
          <label htmlFor="search-price" className="search-label">
            {t.search_price} <span className="search-currency">(AED)</span>
          </label>
          <select id="search-price" className="search-select">
            <option value="">{t.search_all_prices}</option>
            {priceOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label[locale]}
              </option>
            ))}
          </select>
        </div>
        <svg
          className="search-chevron"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* 4. Search Button (Direct child inside the white container) */}
      <button type="button" className="search-button" aria-label={t.search_button}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span>{t.search_button}</span>
      </button>
    </div>
  );
}
