import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLocale } from '../../utils/LocaleContext';
import logo from '../../assets/branding/FINAL-LOGO1.png';
import './Navbar.css';

export default function Navbar() {
  const { t, locale, setLocale } = useLocale();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track window.scrollY for State 1 (Top of Page) vs State 2 (After Scroll)
  useEffect(() => {
    function handleScroll() {
      const isScrolled = window.scrollY > 40;
      setScrolled(isScrolled);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const links = [
    { to: '/', label: t.nav_home },
    { to: '/properties', label: t.nav_properties },
    { to: '/about', label: t.nav_about },
  ];

  function toggleLocale() {
    setLocale(locale === 'ar' ? 'en' : 'ar');
  }

  function isActive(path: string) {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }

  return (
    <header className={`navbar-wrapper ${scrolled ? 'navbar-wrapper--scrolled' : ''}`}>
      <nav
        className={`navbar-bar ${scrolled ? 'navbar-bar--scrolled' : 'navbar-bar--top'}`}
        aria-label="Main Navigation"
      >
        {/* Brand Logo */}
        <div className="navbar-side navbar-brand-wrap">
          <Link to="/" className="navbar-brand" aria-label={t.site_name}>
            <img src={logo} alt={t.site_name} className="navbar-logo" />
          </Link>
        </div>

        {/* Centered Navigation Links */}
        <div className="navbar-center">
          <ul className="navbar-links">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={
                    'navbar-link' + (isActive(link.to) ? ' navbar-link--active' : '')
                  }
                >
                  <span>{link.label}</span>
                  {isActive(link.to) && <span className="navbar-link-indicator" />}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Language Switcher & Mobile Hamburger */}
        <div className="navbar-side navbar-actions">
          <button
            type="button"
            className="navbar-locale-pill"
            onClick={toggleLocale}
            aria-label="Toggle language"
          >
            <svg
              className="navbar-globe-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span className="navbar-locale-text">
              {locale === 'ar' ? 'EN' : 'عربي'}
            </span>
            <svg
              className="navbar-locale-chevron"
              width="11"
              height="11"
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
          </button>

          <button
            type="button"
            className="navbar-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Floating Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="navbar-mobile-card">
          <ul className="navbar-mobile-links">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={
                    'navbar-mobile-link' +
                    (isActive(link.to) ? ' navbar-mobile-link--active' : '')
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="navbar-mobile-footer">
            <button
              type="button"
              className="navbar-mobile-locale"
              onClick={() => {
                toggleLocale();
                setMobileOpen(false);
              }}
            >
              {locale === 'ar' ? 'English' : 'عربي'}
            </button>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div
          className="navbar-mobile-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </header>
  );
}
