import { useState, useEffect, useCallback } from 'react';
import { useLocale } from '../../utils/LocaleContext';
import { OwnerService } from '../../services/ownerService';

export default function OwnerRevenuePage() {
  const { locale } = useLocale();
  const [revenueData, setRevenueData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Confirmed endpoint: GET /dashboard/owner/bookings/revenue
      const data = await OwnerService.getRevenue();
      setRevenueData(data);
    } catch (err: any) {
      console.error('[OwnerRevenuePage] GET /dashboard/owner/bookings/revenue failed:', err);
      setError(
        err?.message ||
          (locale === 'ar'
            ? 'تعذر تحميل بيانات الإيرادات من الخادم.'
            : 'Could not load revenue data from the server.')
      );
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  // Defensive extraction
  const parsedTotal =
    revenueData?.totalRevenue ??
    revenueData?.total ??
    revenueData?.revenue ??
    (typeof revenueData === 'number' ? revenueData : null);

  const currency = revenueData?.currency || (locale === 'ar' ? 'ج.م' : 'EGP');

  // Check if monthly breakdowns or list of items exist
  const items = Array.isArray(revenueData)
    ? revenueData
    : Array.isArray(revenueData?.items)
    ? revenueData.items
    : Array.isArray(revenueData?.monthlyRevenue)
    ? revenueData.monthlyRevenue
    : [];

  return (
    <div>
      <div className="dary-section-card">
        <div className="dary-section-header">
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--dary-navy)', margin: 0 }}>
              {locale === 'ar' ? 'تقرير الإيرادات والأداء المالي' : 'Revenue & Financial Overview'}
            </h2>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.875rem', color: 'var(--dary-muted)' }}>
              {locale === 'ar'
                ? 'متابعة الإيرادات المحققة من عقاراتك المؤجرة بناءً على الحجوزات الفعلية.'
                : 'Track financial earnings and booking revenue for your properties.'}
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--dary-muted)' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #E2E8F0', borderTopColor: '#0B2A4A', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              {locale === 'ar' ? 'جاري تحميل الإيرادات...' : 'Loading revenue data...'}
            </p>
          </div>
        ) : error ? (
          <div className="dary-error-state">
            <p className="dary-error-title">{locale === 'ar' ? 'خطأ في جلب بيانات الإيرادات' : 'API Error'}</p>
            <p className="dary-error-desc">{error}</p>
            <button type="button" className="dary-retry-btn" onClick={fetchRevenue}>
              {locale === 'ar' ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        ) : (
          <div>
            {/* Main Highlight Card */}
            <div
              style={{
                backgroundColor: 'linear-gradient(135deg, #0B2A4A 0%, #163E66 100%)',
                background: '#0B2A4A',
                borderRadius: '16px',
                padding: '2rem',
                color: '#FFFFFF',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.5rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.9rem', color: '#CBD5E1', display: 'block', marginBottom: '0.5rem' }}>
                  {locale === 'ar' ? 'إجمالي الإيرادات المسجلة' : 'Total Recorded Revenue'}
                </span>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
                  {parsedTotal !== null ? parsedTotal.toLocaleString() : '0'}
                  <span style={{ fontSize: '1.25rem', marginInlineStart: '0.5rem', color: '#B69F77' }}>
                    {currency}
                  </span>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '1rem 1.5rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  textAlign: locale === 'ar' ? 'left' : 'right',
                }}
              >
                <span style={{ fontSize: '0.8rem', color: '#CBD5E1', display: 'block' }}>
                  {locale === 'ar' ? 'المصدر المعتمد' : 'Verified Endpoint'}
                </span>
                <strong style={{ fontSize: '0.85rem', color: '#FFFFFF', fontFamily: 'monospace' }}>
                  GET /dashboard/owner/bookings/revenue
                </strong>
              </div>
            </div>

            {/* Breakdown or Raw details */}
            {items.length > 0 ? (
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--dary-navy)', fontWeight: 700, marginBottom: '1rem' }}>
                  {locale === 'ar' ? 'تفاصيل الفترات' : 'Periodic Breakdown'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {items.map((item: any, idx: number) => (
                    <div
                      key={item.id || idx}
                      style={{
                        padding: '1rem 1.25rem',
                        border: '1px solid var(--dary-border)',
                        borderRadius: '10px',
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontWeight: 600, color: 'var(--dary-navy)' }}>
                        {item.month || item.period || item.title || `${locale === 'ar' ? 'الفترة' : 'Period'} ${idx + 1}`}
                      </span>
                      <strong style={{ color: 'var(--dary-blue)', fontSize: '1.1rem' }}>
                        {item.revenue || item.amount || item.total || 0} {currency}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="dary-empty-state">
                <div className="dary-empty-icon">📊</div>
                <h4 className="dary-empty-title">{locale === 'ar' ? 'لا توجد تفاصيل دورية إضافية' : 'No Periodic Breakdown Available'}</h4>
                <p className="dary-empty-desc">
                  {locale === 'ar'
                    ? 'تم عرض إجمالي الإيرادات المسجلة أعلاه مباشرة من الخادم.'
                    : 'The total revenue provided by the backend is displayed above.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
