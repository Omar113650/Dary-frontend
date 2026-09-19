import { useState, useEffect, useCallback } from 'react';
import { useLocale } from '../../utils/LocaleContext';
import { OwnerService } from '../../services/ownerService';

export default function OwnerCalendarPage() {
  const { locale } = useLocale();
  const [calendarData, setCalendarData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCalendar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Confirmed endpoint: GET /dashboard/owner/calendar/summary
      const data = await OwnerService.getCalendarSummary();
      setCalendarData(data);
    } catch (err: any) {
      console.error('[OwnerCalendarPage] GET /dashboard/owner/calendar/summary failed:', err);
      setError(
        err?.message ||
          (locale === 'ar'
            ? 'تعذر تحميل ملخص التقويم من الخادم.'
            : 'Could not load calendar summary from the server.')
      );
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchCalendar();
  }, [fetchCalendar]);

  // Defensive array or object checking
  const events = Array.isArray(calendarData)
    ? calendarData
    : Array.isArray(calendarData?.events)
    ? calendarData.events
    : Array.isArray(calendarData?.bookings)
    ? calendarData.bookings
    : [];

  return (
    <div>
      <div className="dary-section-card">
        <div className="dary-section-header">
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--dary-navy)', margin: 0 }}>
              {locale === 'ar' ? 'تقويم الحجوزات والإشغال' : 'Booking & Occupancy Calendar'}
            </h2>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.875rem', color: 'var(--dary-muted)' }}>
              {locale === 'ar'
                ? 'متابعة مواعيد تسكين الطلاب، فترات الحجز، وتواريخ انتهاء عقود الإيجار.'
                : 'Track student check-in dates, booking duration, and lease expiration dates.'}
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--dary-muted)' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #E2E8F0', borderTopColor: '#0B2A4A', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              {locale === 'ar' ? 'جاري تحميل التقويم...' : 'Loading calendar...'}
            </p>
          </div>
        ) : error ? (
          <div className="dary-error-state">
            <p className="dary-error-title">{locale === 'ar' ? 'خطأ في جلب بيانات التقويم' : 'API Error'}</p>
            <p className="dary-error-desc">{error}</p>
            <button type="button" className="dary-retry-btn" onClick={fetchCalendar}>
              {locale === 'ar' ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        ) : events.length === 0 && (!calendarData || Object.keys(calendarData).length === 0) ? (
          <div className="dary-empty-state">
            <div className="dary-empty-icon">📅</div>
            <h4 className="dary-empty-title">{locale === 'ar' ? 'لا توجد مواعيد مسجلة في التقويم' : 'No Events in Calendar'}</h4>
            <p className="dary-empty-desc">
              {locale === 'ar'
                ? 'عند تسجيل وتأكيد حجوزات جديدة، ستظهر مواعيدها وفترات الإشغال هنا تلقائيًا.'
                : 'Confirmed bookings and lease periods will appear here automatically.'}
            </p>
          </div>
        ) : events.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {events.map((evt: any, idx: number) => (
              <div
                key={evt.id || idx}
                style={{
                  border: '1px solid var(--dary-border)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.05rem', color: 'var(--dary-navy)', fontWeight: 700 }}>
                    {evt.title || evt.propertyTitle || (locale === 'ar' ? 'موعد حجز' : 'Booking Schedule')}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--dary-muted)' }}>
                    {evt.tenantName ? `${evt.tenantName} • ` : ''}
                    {evt.status ? `${evt.status} • ` : ''}
                    {evt.date || (evt.startDate ? `${new Date(evt.startDate).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')} → ${new Date(evt.endDate).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}` : '')}
                  </p>
                </div>

                {evt.status && (
                  <span className="dary-badge dary-badge-open">
                    {evt.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '1.25rem', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
            <h4 style={{ margin: '0 0 0.5rem', color: 'var(--dary-navy)', fontSize: '0.95rem' }}>
              {locale === 'ar' ? 'بيانات التقويم المباشرة من الخادم:' : 'Calendar Data from Server:'}
            </h4>
            <pre style={{ margin: 0, fontSize: '0.85rem', overflowX: 'auto', fontFamily: 'monospace' }}>
              {JSON.stringify(calendarData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
