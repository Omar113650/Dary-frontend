import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../utils/LocaleContext';

export default function TenantRoute({ children }: { children?: ReactNode }) {
  const { isAuthenticated, isLoading, isTenant, logout, role } = useAuth();
  const location = useLocation();
  const { t } = useLocale();

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#F7F8FA',
          gap: '1rem',
          fontFamily: 'inherit',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid #E2E8F0',
            borderTopColor: '#0B2A4A',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p style={{ color: '#64748B', fontSize: '0.95rem' }}>{t.loading || 'جاري التحميل...'}</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Strict role checking: only 'tenant' allowed
  if (!isTenant) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          backgroundColor: '#F7F8FA',
          textAlign: 'center',
          fontFamily: 'inherit',
        }}
      >
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '2.5rem 2rem',
            maxWidth: '480px',
            boxShadow: '0 4px 20px rgba(11, 42, 74, 0.08)',
            border: '1px solid #E2E8F0',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#FEF3C7',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              fontSize: '1.5rem',
            }}
          >
            ⚠️
          </div>
          <h2 style={{ color: '#0B2A4A', fontSize: '1.35rem', marginBottom: '0.75rem', fontWeight: 700 }}>
            {t.auth_tenant_only_title || 'لوحة تحكم المستأجرين'}
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {t.auth_tenant_only_desc ||
              `أنت مسجل الدخول بدور "${role || 'غير محدد'}". لوحة التحكم هذه مخصصة لحسابات الطلاب والمستأجرين فقط.`}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <a
              href="/"
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                backgroundColor: '#F1F5F9',
                color: '#0B2A4A',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              {t.nav_home || 'الرئيسية'}
            </a>
            <button
              onClick={() => logout()}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                backgroundColor: '#0B2A4A',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              {t.auth_logout_btn || 'تسجيل الخروج'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : null;
}
