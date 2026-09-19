import { useState, useEffect, useCallback } from 'react';
import { useLocale } from '../../utils/LocaleContext';
import { AdminService } from '../../services/adminService';
import type { AdminCalendarBookingEvent } from '../../services/adminService';

export default function AdminCalendarPage() {
  const { locale } = useLocale();

  const [events, setEvents] = useState<AdminCalendarBookingEvent[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Date filters
  const today = new Date().toISOString().split('T')[0];
  const nextMonthDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(nextMonthDate);

  const fetchCalendarData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [calRes, sumRes] = await Promise.allSettled([
        AdminService.getBookingCalendar(startDate, endDate),
        AdminService.getCalendarSummary(),
      ]);

      if (calRes.status === 'fulfilled') {
        const raw = calRes.value;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.events)
          ? raw.events
          : Array.isArray(raw?.bookings)
          ? raw.bookings
          : Array.isArray(raw?.data)
          ? raw.data
          : [];
        setEvents(list);
      } else {
        throw calRes.reason;
      }

      if (sumRes.status === 'fulfilled') {
        setSummary(sumRes.value);
      }
    } catch (err: any) {
      console.error('[AdminCalendarPage] fetchCalendarData failed:', err);
      setError(
        err?.message ||
          (locale === 'ar'
            ? 'تعذر تحميل بيانات تقويم الحجوزات من الخادم.'
            : 'Could not load calendar data from the server.')
      );
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, locale]);

  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  return (
    <div className="dary-page-container">
      {/* Header */}
      <div className="dary-page-header">
        <div>
          <h1 className="dary-page-title" style={{ color: '#0B2A4A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🗓️</span>
            <span>{locale === 'ar' ? 'تقويم التسكين والإشغال الشامل' : 'Booking & Occupancy Calendar'}</span>
          </h1>
          <p className="dary-page-subtitle">
            {locale === 'ar'
              ? 'متابعة مواعيد وصول الطلاب ومغادرتهم، نسب الإشغال، وفترات سريان العقود لجميع عقارات المنصة.'
              : 'Track student check-ins, check-outs, occupancy blocks, and contract validity across all housing.'}
          </p>
        </div>
      </div>

      {/* Date Filter Controls */}
      <div className="dary-card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '0.25rem' }}>
              {locale === 'ar' ? 'من تاريخ:' : 'From:'}
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '0.25rem' }}>
              {locale === 'ar' ? 'إلى تاريخ:' : 'To:'}
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="button"
            onClick={fetchCalendarData}
            className="dary-primary-btn"
            style={{ padding: '0.55rem 1.25rem', marginTop: '1.25rem', fontSize: '0.85rem' }}
          >
            {locale === 'ar' ? 'تطبيق الفلترة' : 'Apply Filter'}
          </button>
        </div>

        {summary && (
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {summary.totalBookings !== undefined && (
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                {locale === 'ar' ? 'إجمالي الحجوزات بالتقويم:' : 'Calendar Bookings:'}{' '}
                <strong style={{ color: '#0B2A4A' }}>{summary.totalBookings}</strong>
              </div>
            )}
            {summary.occupancyRate !== undefined && (
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                {locale === 'ar' ? 'نسبة الإشغال:' : 'Occupancy:'}{' '}
                <strong style={{ color: '#2F6BFF' }}>{summary.occupancyRate}%</strong>
              </div>
            )}
            {summary.activeEvents !== undefined && (
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                {locale === 'ar' ? 'المواعيد النشطة:' : 'Active Events:'}{' '}
                <strong style={{ color: '#16A34A' }}>{summary.activeEvents}</strong>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Events List */}
      <div className="dary-card">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                border: '3px solid #E2E8F0',
                borderTopColor: '#0B2A4A',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 1rem',
              }}
            />
            <p>{locale === 'ar' ? 'جاري تحميل مواعيد التقويم...' : 'Loading calendar events...'}</p>
          </div>
        ) : error ? (
          <div className="dary-error-alert" style={{ margin: '1rem' }}>
            <span>{error}</span>
            <button type="button" onClick={fetchCalendarData} className="dary-retry-btn">
              {locale === 'ar' ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        ) : events.length === 0 ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748B' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🗓️</span>
            <p style={{ fontWeight: 600, color: '#0B2A4A' }}>
              {locale === 'ar' ? 'لا توجد مواعيد مسجلة في هذه الفترة الزمنية.' : 'No calendar events scheduled in this period.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
            {events.map((evt, idx) => (
              <div
                key={evt.id || idx}
                style={{
                  border: '1px solid #E2E8F0',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: '#0B2A4A' }}>
                      {evt.propertyTitle || (locale === 'ar' ? 'سكن طلابي' : 'Student Housing')}
                    </span>
                    {evt.status && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          backgroundColor: evt.status === 'CONFIRMED' ? '#DCFCE7' : '#FEF9C3',
                          color: evt.status === 'CONFIRMED' ? '#15803D' : '#A16207',
                        }}
                      >
                        {evt.status}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                    {locale === 'ar' ? 'المستأجر:' : 'Tenant:'}{' '}
                    <strong style={{ color: '#0B2A4A' }}>{evt.tenantName || '—'}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ textAlign: locale === 'ar' ? 'left' : 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{locale === 'ar' ? 'فترة الحجز' : 'Duration'}</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0B2A4A' }}>
                      {evt.startDate ? new Date(evt.startDate).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US') : '—'}
                      {' → '}
                      {evt.endDate ? new Date(evt.endDate).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US') : '—'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
