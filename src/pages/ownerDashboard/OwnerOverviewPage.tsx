import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../utils/LocaleContext';
import { OwnerService } from '../../services/ownerService';

export default function OwnerOverviewPage() {
  const { user } = useAuth();
  const { locale } = useLocale();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/owner-dashboard-preview')
    ? '/owner-dashboard-preview'
    : '/owner-dashboard';

  const firstName =
    user?.name?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    (locale === 'ar' ? 'المالك' : 'Owner');

  // 1. Property Status State
  const [propertiesStatus, setPropertiesStatus] = useState<any>(null);
  const [loadingProps, setLoadingProps] = useState(true);
  const [propsError, setPropsError] = useState<string | null>(null);

  // 2. Booking Status State
  const [bookingsStatus, setBookingsStatus] = useState<any>(null);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  // 3. Revenue State
  const [revenueData, setRevenueData] = useState<any>(null);
  const [loadingRevenue, setLoadingRevenue] = useState(true);
  const [revenueError, setRevenueError] = useState<string | null>(null);

  // 4. Calendar State
  const [calendarData, setCalendarData] = useState<any>(null);
  const [loadingCalendar, setLoadingCalendar] = useState(true);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  // Fetch Section A: GET /dashboard/owner/properties/status
  const fetchPropertiesStatus = useCallback(async () => {
    setLoadingProps(true);
    setPropsError(null);
    try {
      const data = await OwnerService.getPropertiesStatus();
      setPropertiesStatus(data);
    } catch (err: any) {
      console.error('[OwnerOverview] GET /dashboard/owner/properties/status failed:', err);
      setPropsError(
        err?.message ||
          (locale === 'ar'
            ? 'تعذر تحميل حالة العقارات من الخادم.'
            : 'Could not load properties status from the server.')
      );
    } finally {
      setLoadingProps(false);
    }
  }, [locale]);

  // Fetch Section B: GET /dashboard/owner/bookings/status
  const fetchBookingsStatus = useCallback(async () => {
    setLoadingBookings(true);
    setBookingsError(null);
    try {
      const data = await OwnerService.getBookingsStatus();
      setBookingsStatus(data);
    } catch (err: any) {
      console.error('[OwnerOverview] GET /dashboard/owner/bookings/status failed:', err);
      setBookingsError(
        err?.message ||
          (locale === 'ar'
            ? 'تعذر تحميل حالة الحجوزات من الخادم.'
            : 'Could not load bookings status from the server.')
      );
    } finally {
      setLoadingBookings(false);
    }
  }, [locale]);

  // Fetch Section C: GET /dashboard/owner/bookings/revenue
  const fetchRevenue = useCallback(async () => {
    setLoadingRevenue(true);
    setRevenueError(null);
    try {
      const data = await OwnerService.getRevenue();
      setRevenueData(data);
    } catch (err: any) {
      console.error('[OwnerOverview] GET /dashboard/owner/bookings/revenue failed:', err);
      setRevenueError(
        err?.message ||
          (locale === 'ar'
            ? 'تعذر تحميل بيانات الإيرادات من الخادم.'
            : 'Could not load revenue data from the server.')
      );
    } finally {
      setLoadingRevenue(false);
    }
  }, [locale]);

  // Fetch Section D: GET /dashboard/owner/calendar/summary
  const fetchCalendar = useCallback(async () => {
    setLoadingCalendar(true);
    setCalendarError(null);
    try {
      const data = await OwnerService.getCalendarSummary();
      setCalendarData(data);
    } catch (err: any) {
      console.error('[OwnerOverview] GET /dashboard/owner/calendar/summary failed:', err);
      setCalendarError(
        err?.message ||
          (locale === 'ar'
            ? 'تعذر تحميل ملخص التقويم من الخادم.'
            : 'Could not load calendar summary from the server.')
      );
    } finally {
      setLoadingCalendar(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchPropertiesStatus();
    fetchBookingsStatus();
    fetchRevenue();
    fetchCalendar();
  }, [fetchPropertiesStatus, fetchBookingsStatus, fetchRevenue, fetchCalendar]);

  // Helper to safely parse status counts
  function extractStatusEntries(raw: any): Array<{ status: string; count: number }> {
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw.map((item) => ({
        status: item.status || item.name || item.key || 'UNKNOWN',
        count: Number(item.count || item._count || item.total || 0),
      }));
    }
    if (typeof raw === 'object') {
      const entries: Array<{ status: string; count: number }> = [];
      const ignoredKeys = ['success', 'message', 'status', 'statusCode', 'data'];
      for (const [key, val] of Object.entries(raw)) {
        if (!ignoredKeys.includes(key)) {
          if (typeof val === 'number') {
            entries.push({ status: key, count: val });
          } else if (val && typeof val === 'object' && 'count' in (val as any)) {
            entries.push({ status: key, count: Number((val as any).count) });
          }
        }
      }
      return entries;
    }
    return [];
  }

  const propStatusList = extractStatusEntries(propertiesStatus);
  const bookingStatusList = extractStatusEntries(bookingsStatus);

  // Parse revenue safely
  const parsedRevenue =
    revenueData?.totalRevenue ??
    revenueData?.revenue ??
    revenueData?.total ??
    (typeof revenueData === 'number' ? revenueData : null);

  const revenueCurrency = revenueData?.currency || (locale === 'ar' ? 'ج.م' : 'EGP');

  return (
    <div>
      {/* 1. Welcome Card */}
      <div className="dary-welcome-card">
        <div>
          <h1 className="dary-welcome-title">
            {locale === 'ar' ? `مرحبًا بك، ${firstName} 🏢` : `Welcome, ${firstName} 🏢`}
          </h1>
          <p className="dary-welcome-subtitle">
            {locale === 'ar'
              ? 'متابعة شاملة لعقاراتك، نسب الإشغال، الحجوزات، والأداء المالي لسكنك الطلابي.'
              : 'Comprehensive overview of your properties, occupancy rates, bookings, and revenue.'}
          </p>
        </div>

        <div className="dary-welcome-actions">
          <Link to={`${basePath}/properties`} className="dary-primary-btn">
            <span>{locale === 'ar' ? 'إدارة العقارات' : 'Manage Properties'}</span>
          </Link>
          <Link to={`${basePath}/bookings`} className="dary-secondary-btn">
            <span>{locale === 'ar' ? 'عرض الحجوزات' : 'View Bookings'}</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Metric Cards (Revenue + Total Counts) */}
      <div className="dary-metrics-grid">
        {/* Revenue Card */}
        <div className="dary-metric-card">
          <div className="dary-metric-icon-wrap" style={{ backgroundColor: '#EEF3FF', color: '#2F6BFF' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <h3 className="dary-metric-number">
              {loadingRevenue ? (
                '...'
              ) : revenueError ? (
                '—'
              ) : parsedRevenue !== null ? (
                `${parsedRevenue.toLocaleString()} ${revenueCurrency}`
              ) : (
                '0'
              )}
            </h3>
            <p className="dary-metric-label">
              {locale === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}
            </p>
          </div>
        </div>

        {/* Properties Total */}
        <div className="dary-metric-card">
          <div className="dary-metric-icon-wrap" style={{ backgroundColor: '#F0FDF4', color: '#16A34A' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div>
            <h3 className="dary-metric-number">
              {loadingProps ? '...' : propsError ? '—' : propStatusList.reduce((acc, curr) => acc + curr.count, 0)}
            </h3>
            <p className="dary-metric-label">
              {locale === 'ar' ? 'إجمالي العقارات' : 'Total Properties'}
            </p>
          </div>
        </div>

        {/* Bookings Total */}
        <div className="dary-metric-card">
          <div className="dary-metric-icon-wrap" style={{ backgroundColor: '#FEF9C3', color: '#CA8A04' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
          </div>
          <div>
            <h3 className="dary-metric-number">
              {loadingBookings ? '...' : bookingsError ? '—' : bookingStatusList.reduce((acc, curr) => acc + curr.count, 0)}
            </h3>
            <p className="dary-metric-label">
              {locale === 'ar' ? 'إجمالي الحجوزات' : 'Total Bookings'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Section A: Property Status (GET /dashboard/owner/properties/status) */}
      <div className="dary-section-card">
        <div className="dary-section-header">
          <div>
            <h3>{locale === 'ar' ? 'حالة العقارات المسجلة' : 'Properties Status'}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--dary-muted)' }}>
              GET /dashboard/owner/properties/status
            </span>
          </div>
          <Link to={`${basePath}/properties`} className="dary-view-all-link">
            <span>{locale === 'ar' ? 'عرض العقارات' : 'View All'}</span>
            <span>→</span>
          </Link>
        </div>

        {loadingProps ? (
          <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--dary-muted)' }}>
            <div style={{ width: '30px', height: '30px', border: '3px solid #E2E8F0', borderTopColor: '#0B2A4A', borderRadius: '50%', margin: '0 auto 0.75rem', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ margin: 0, fontSize: '0.875rem' }}>{locale === 'ar' ? 'جاري تحميل حالة العقارات...' : 'Loading property status...'}</p>
          </div>
        ) : propsError ? (
          <div className="dary-error-state">
            <p className="dary-error-title">{locale === 'ar' ? 'فشل تحميل حالة العقارات' : 'Failed to Load Property Status'}</p>
            <p className="dary-error-desc">{propsError}</p>
            <button type="button" className="dary-retry-btn" onClick={fetchPropertiesStatus}>
              {locale === 'ar' ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        ) : propStatusList.length === 0 ? (
          <div className="dary-empty-state">
            <div className="dary-empty-icon">🏠</div>
            <h4 className="dary-empty-title">{locale === 'ar' ? 'لا توجد عقارات مسجلة' : 'No Properties Found'}</h4>
            <p className="dary-empty-desc">
              {locale === 'ar'
                ? 'لم تقم بإضافة أي عقار إلى حسابك حتى الآن.'
                : 'No properties registered to your owner account yet.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {propStatusList.map((item) => (
              <div
                key={item.status}
                style={{
                  padding: '1.25rem',
                  border: '1px solid var(--dary-border)',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--dary-navy)', marginBottom: '0.35rem' }}>
                  {item.count}
                </div>
                <span className="dary-badge" style={{ backgroundColor: '#F1F5F9', color: '#0B2A4A' }}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Section B: Booking Status (GET /dashboard/owner/bookings/status) */}
      <div className="dary-section-card">
        <div className="dary-section-header">
          <div>
            <h3>{locale === 'ar' ? 'حالة طلبات الحجز' : 'Bookings Status'}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--dary-muted)' }}>
              GET /dashboard/owner/bookings/status
            </span>
          </div>
          <Link to={`${basePath}/bookings`} className="dary-view-all-link">
            <span>{locale === 'ar' ? 'عرض الحجوزات' : 'View All'}</span>
            <span>→</span>
          </Link>
        </div>

        {loadingBookings ? (
          <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--dary-muted)' }}>
            <div style={{ width: '30px', height: '30px', border: '3px solid #E2E8F0', borderTopColor: '#0B2A4A', borderRadius: '50%', margin: '0 auto 0.75rem', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ margin: 0, fontSize: '0.875rem' }}>{locale === 'ar' ? 'جاري تحميل حالة الحجوزات...' : 'Loading booking status...'}</p>
          </div>
        ) : bookingsError ? (
          <div className="dary-error-state">
            <p className="dary-error-title">{locale === 'ar' ? 'فشل تحميل حالة الحجوزات' : 'Failed to Load Booking Status'}</p>
            <p className="dary-error-desc">{bookingsError}</p>
            <button type="button" className="dary-retry-btn" onClick={fetchBookingsStatus}>
              {locale === 'ar' ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        ) : bookingStatusList.length === 0 ? (
          <div className="dary-empty-state">
            <div className="dary-empty-icon">📋</div>
            <h4 className="dary-empty-title">{locale === 'ar' ? 'لا توجد طلبات حجز' : 'No Bookings Found'}</h4>
            <p className="dary-empty-desc">
              {locale === 'ar'
                ? 'لم يتم تسجيل أي طلبات حجز لعقاراتك بعد.'
                : 'No bookings registered for your properties yet.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {bookingStatusList.map((item) => (
              <div
                key={item.status}
                style={{
                  padding: '1.25rem',
                  border: '1px solid var(--dary-border)',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--dary-blue)', marginBottom: '0.35rem' }}>
                  {item.count}
                </div>
                <span className="dary-badge" style={{ backgroundColor: '#EEF3FF', color: '#2F6BFF' }}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Section D: Calendar Summary (GET /dashboard/owner/calendar/summary) */}
      <div className="dary-section-card">
        <div className="dary-section-header">
          <div>
            <h3>{locale === 'ar' ? 'ملخص التقويم والمواعيد' : 'Calendar Summary'}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--dary-muted)' }}>
              GET /dashboard/owner/calendar/summary
            </span>
          </div>
          <Link to={`${basePath}/calendar`} className="dary-view-all-link">
            <span>{locale === 'ar' ? 'فتح التقويم' : 'Open Calendar'}</span>
            <span>→</span>
          </Link>
        </div>

        {loadingCalendar ? (
          <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--dary-muted)' }}>
            <div style={{ width: '30px', height: '30px', border: '3px solid #E2E8F0', borderTopColor: '#0B2A4A', borderRadius: '50%', margin: '0 auto 0.75rem', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ margin: 0, fontSize: '0.875rem' }}>{locale === 'ar' ? 'جاري تحميل ملخص التقويم...' : 'Loading calendar...'}</p>
          </div>
        ) : calendarError ? (
          <div className="dary-error-state">
            <p className="dary-error-title">{locale === 'ar' ? 'فشل تحميل التقويم' : 'Failed to Load Calendar'}</p>
            <p className="dary-error-desc">{calendarError}</p>
            <button type="button" className="dary-retry-btn" onClick={fetchCalendar}>
              {locale === 'ar' ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        ) : !calendarData || (Array.isArray(calendarData) && calendarData.length === 0) ? (
          <div className="dary-empty-state">
            <div className="dary-empty-icon">📅</div>
            <h4 className="dary-empty-title">{locale === 'ar' ? 'لا توجد مواعيد بالتقويم حاليًا' : 'No Calendar Events'}</h4>
            <p className="dary-empty-desc">
              {locale === 'ar'
                ? 'ستظهر هنا المواعيد، فترات الحجز، وتواريخ بدء وانتهاء الإيجار تلقائيًا.'
                : 'Booking schedules, check-in, and check-out dates will appear here automatically.'}
            </p>
          </div>
        ) : (
          <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '10px' }}>
            <pre style={{ margin: 0, fontSize: '0.85rem', overflowX: 'auto', fontFamily: 'monospace' }}>
              {JSON.stringify(calendarData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
