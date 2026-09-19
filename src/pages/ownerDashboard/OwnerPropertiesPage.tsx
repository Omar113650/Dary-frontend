import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../utils/LocaleContext';
import { OwnerService } from '../../services/ownerService';
import type { OwnerPropertyItem } from '../../services/ownerService';

export default function OwnerPropertiesPage() {
  const { locale } = useLocale();
  const [properties, setProperties] = useState<OwnerPropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Confirmed endpoint: GET /properties/my
      const data = await OwnerService.getMyProperties();
      setProperties(data);
    } catch (err: any) {
      console.error('[OwnerPropertiesPage] GET /properties/my failed:', err);
      setError(
        err?.message ||
          (locale === 'ar'
            ? 'تعذر تحميل عقاراتك من الخادم.'
            : 'Could not load your properties from the server.')
      );
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  function getStatusBadge(status?: string) {
    const s = (status || '').toUpperCase();
    if (s === 'APPROVED' || s === 'ACTIVE') {
      return (
        <span className="dary-badge dary-badge-closed">
          {locale === 'ar' ? 'معتمد ومتاح' : 'Approved'}
        </span>
      );
    }
    if (s === 'PENDING') {
      return (
        <span className="dary-badge dary-badge-pending">
          {locale === 'ar' ? 'قيد المراجعة' : 'Pending Approval'}
        </span>
      );
    }
    if (s === 'REJECTED') {
      return (
        <span className="dary-badge dary-badge-cancelled" style={{ color: '#DC2626', backgroundColor: '#FEE2E2' }}>
          {locale === 'ar' ? 'مرفوض' : 'Rejected'}
        </span>
      );
    }
    if (s === 'SUSPENDED') {
      return (
        <span className="dary-badge dary-badge-cancelled">
          {locale === 'ar' ? 'معلّق' : 'Suspended'}
        </span>
      );
    }
    return <span className="dary-badge">{status || '—'}</span>;
  }

  return (
    <div>
      <div className="dary-section-card">
        <div className="dary-section-header">
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--dary-navy)', margin: 0 }}>
              {locale === 'ar' ? 'عقاراتي المسجلة' : 'My Registered Properties'}
            </h2>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.875rem', color: 'var(--dary-muted)' }}>
              {locale === 'ar'
                ? 'قائمة بالعقارات والوحدات السكنية المسجلة بحسابك وحالتها التشغيلية.'
                : 'Manage student housing listings registered under your owner account.'}
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--dary-muted)' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #E2E8F0', borderTopColor: '#0B2A4A', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              {locale === 'ar' ? 'جاري تحميل العقارات...' : 'Loading properties...'}
            </p>
          </div>
        ) : error ? (
          <div className="dary-error-state">
            <p className="dary-error-title">{locale === 'ar' ? 'خطأ في جلب العقارات' : 'API Error'}</p>
            <p className="dary-error-desc">{error}</p>
            <button type="button" className="dary-retry-btn" onClick={fetchProperties}>
              {locale === 'ar' ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        ) : properties.length === 0 ? (
          <div className="dary-empty-state">
            <div className="dary-empty-icon">🏢</div>
            <h4 className="dary-empty-title">{locale === 'ar' ? 'لا توجد عقارات مسجلة' : 'No Properties Found'}</h4>
            <p className="dary-empty-desc">
              {locale === 'ar'
                ? 'لم تقم بتسجيل أي عقارات حتى الآن. عند إضافة عقارات جديدة ستظهر وتدار من هنا.'
                : 'You have not registered any student housing properties yet. When you add listings, they will appear here.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.5rem' }}>
            {properties.map((property) => {
              const image =
                property.primaryImage ||
                (Array.isArray(property.images) && property.images[0]
                  ? typeof property.images[0] === 'string'
                    ? property.images[0]
                    : property.images[0].url
                  : '') ||
                '/placeholder.jpg';

              return (
                <div
                  key={property.id}
                  style={{
                    border: '1px solid var(--dary-border)',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ position: 'relative', height: '170px', backgroundColor: '#F1F5F9' }}>
                    <img
                      src={image}
                      alt={property.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div style={{ position: 'absolute', top: '10px', insetInlineStart: '10px' }}>
                      {getStatusBadge(property.status)}
                    </div>
                  </div>

                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.1rem', color: 'var(--dary-navy)', fontWeight: 700 }}>
                      {property.title}
                    </h3>
                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: 'var(--dary-muted)' }}>
                      {property.city ? `${property.city} • ` : ''}
                      {property.address || ''}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--dary-muted)' }}>
                      {property.propertyType && (
                        <span style={{ backgroundColor: '#F8FAFC', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                          🏢 {property.propertyType}
                        </span>
                      )}
                      {property.rooms && (
                        <span style={{ backgroundColor: '#F8FAFC', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                          🛏️ {property.rooms.length} {locale === 'ar' ? 'غرف' : 'Rooms'}
                        </span>
                      )}
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--dary-border)' }}>
                      <span style={{ fontWeight: 800, color: 'var(--dary-blue)', fontSize: '1.15rem' }}>
                        {property.price ? `${property.price} ${property.currency || (locale === 'ar' ? 'ج.م' : 'EGP')}` : '—'}
                      </span>
                      <Link
                        to={`/properties/${property.id}`}
                        style={{
                          padding: '0.45rem 0.9rem',
                          borderRadius: '8px',
                          backgroundColor: 'var(--dary-blue-light)',
                          color: 'var(--dary-blue)',
                          fontSize: '0.825rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        {locale === 'ar' ? 'معاينة العرض' : 'View Listing'}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
