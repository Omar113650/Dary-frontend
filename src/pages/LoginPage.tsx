import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocale } from '../utils/LocaleContext';
import logo from '../assets/branding/FINAL-LOGO1.png';
import './Auth.css';

export default function LoginPage() {
  const { t, locale, setLocale } = useLocale();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function toggleLocale() {
    setLocale(locale === 'ar' ? 'en' : 'ar');
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isLoading) return;

    // UI/UX only — local mock submission
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 800);
  }

  return (
    <div className="auth-page-root">
      <div className="auth-shell">
        {/* 1. Authentication Form Side (Left on Desktop) */}
        <main className="auth-form-panel">
          <header className="auth-top-bar">
            <Link to="/" className="auth-brand-link" aria-label={t.site_name}>
              <img src={logo} alt={t.site_name} className="auth-mobile-logo" />
            </Link>

            <div className="auth-top-actions">
              <Link to="/" className="auth-back-link">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ transform: locale === 'ar' ? 'scaleX(-1)' : 'none' }}
                >
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>{t.auth_back_home}</span>
              </Link>

              <button
                type="button"
                className="auth-locale-btn"
                onClick={toggleLocale}
                aria-label="Toggle language"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span>{locale === 'ar' ? 'EN' : 'عربي'}</span>
              </button>
            </div>
          </header>

          <div className="auth-form-container">
            <div className="auth-form-header">
              <div className="auth-eyebrow-wrap">
                <span className="auth-eyebrow-accent" aria-hidden="true" />
                <span className="auth-eyebrow">{t.auth_login_eyebrow}</span>
              </div>
              <h1 className="auth-title">{t.auth_login_title}</h1>
              <p className="auth-subtitle">{t.auth_login_subtitle}</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {/* Email Field */}
              <div className="auth-field-group">
                <label htmlFor="login-email" className="auth-label">
                  {t.auth_email_label}
                </label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon" aria-hidden="true">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    className="auth-input"
                    placeholder={t.auth_email_placeholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="auth-field-group">
                <label htmlFor="login-password" className="auth-label">
                  {t.auth_password_label}
                </label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon" aria-hidden="true">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className="auth-input"
                    placeholder={t.auth_password_placeholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="auth-options-row">
                <label className="auth-checkbox-label">
                  <input
                    type="checkbox"
                    className="auth-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>{t.auth_remember_me}</span>
                </label>

                <a
                  href="#forgot"
                  className="auth-forgot-link"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  {t.auth_forgot_password}
                </a>
              </div>

              {/* Primary Submit CTA Button */}
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="auth-btn-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    <span>{locale === 'ar' ? 'جاري التحقق...' : 'Signing in...'}</span>
                  </>
                ) : (
                  <span>{t.auth_login_button}</span>
                )}
              </button>

              {/* Divider */}
              <div className="auth-divider">
                <span>{t.auth_divider_or}</span>
              </div>

              {/* Google Social Login */}
              <button
                type="button"
                className="auth-google-btn"
                onClick={() => {
                  // UI placeholder
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>{t.auth_google_login}</span>
              </button>
            </form>

            <div className="auth-switch-prompt">
              <span>{t.auth_no_account}</span>
              <Link to="/register" className="auth-switch-link">
                {t.auth_create_account_link}
              </Link>
            </div>
          </div>

          <div style={{ height: '0.5rem' }} />
        </main>

        {/* 2. DARY Navy Visual Brand Area (Right on Desktop) */}
        <aside className="auth-visual-panel" aria-label="Brand Overview">
          <div className="auth-visual-header">
            <Link to="/" className="auth-visual-logo-wrap" aria-label={t.site_name}>
              <img src={logo} alt={t.site_name} className="auth-visual-logo" />
            </Link>
          </div>

          <div className="auth-visual-content">
            <div className="auth-visual-tagline-badge">
              <span className="auth-gold-badge-dot" aria-hidden="true" />
              <span>{t.auth_brand_badge}</span>
            </div>

            <h2 className="auth-visual-title">
              {locale === 'ar' ? (
                <>
                  سكنك الطلابي الأنسب،
                  <br />
                  بخطوات أوضح وأسهل
                </>
              ) : (
                <>
                  The student housing that fits you,
                  <br />
                  made simpler
                </>
              )}
            </h2>

            <ul className="auth-visual-pillars">
              <li className="auth-visual-pillar-item">
                <span className="auth-visual-pillar-icon" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>{t.auth_brand_feature1}</span>
              </li>

              <li className="auth-visual-pillar-item">
                <span className="auth-visual-pillar-icon" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>{t.auth_brand_feature2}</span>
              </li>

              <li className="auth-visual-pillar-item">
                <span className="auth-visual-pillar-icon" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>{t.auth_brand_feature3}</span>
              </li>
            </ul>
          </div>

          <div className="auth-visual-footer">
            <span className="auth-visual-badge-pill">
              <svg className="auth-footer-gold-star" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>{locale === 'ar' ? 'منصة السكن الطلابي المعتمدة' : 'Verified Student Housing'}</span>
            </span>
            <span>© 2026 DARY</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
