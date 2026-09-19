import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../utils/LocaleContext';

interface OwnerDashboardHeaderProps {
  onOpenMobile: () => void;
}

export default function OwnerDashboardHeader({ onOpenMobile }: OwnerDashboardHeaderProps) {
  const { user } = useAuth();
  const { locale, setLocale } = useLocale();

  const firstName =
    user?.name?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    (locale === 'ar' ? 'المالك' : 'Owner');

  function toggleLocale() {
    setLocale(locale === 'ar' ? 'en' : 'ar');
  }

  return (
    <header className="dary-header">
      <div className="dary-header-start">
        <button
          type="button"
          className="dary-mobile-menu-btn"
          onClick={onOpenMobile}
          aria-label="Open menu"
        >
          ☰
        </button>
        <div className="dary-header-greeting">
          <h2>
            {locale === 'ar' ? `مرحبًا بك، ${firstName} 🏢` : `Welcome, ${firstName} 🏢`}
          </h2>
          <p>
            {locale === 'ar'
              ? 'لوحة تحكم المالك — إدارة العقارات، متابعة الحجوزات والإيرادات'
              : 'Owner Dashboard — Manage properties, track bookings and revenue'}
          </p>
        </div>
      </div>

      <div className="dary-header-actions">
        {/* Language switch */}
        <button
          type="button"
          className="dary-lang-toggle-btn"
          onClick={toggleLocale}
          aria-label="Switch Language"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span>{locale === 'ar' ? 'EN' : 'عربي'}</span>
        </button>
      </div>
    </header>
  );
}
