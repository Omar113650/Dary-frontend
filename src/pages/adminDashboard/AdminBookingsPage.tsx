import { useState, useEffect, useCallback } from 'react';
import { useLocale } from '../../utils/LocaleContext';
import { AdminService } from '../../services/adminService';
import type { AdminBookingItem, AdminStatusCount } from '../../services/adminService';

export default function AdminBookingsPage() {
  const { locale } = useLocale();

  const [bookings, setBookings] = useState<AdminBookingItem[]>([]);
  const [bookingsStatus, setBookingsStatus] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 1. Fetch Bookings Metrics & Revenue
  const fetchMetrics = useCallback(async () => {
    setLoadingMetrics(true);
    try {
      const [statusRes, revRes] = await Promise.allSettled([
        AdminService.getBookingsStatus(),
        AdminService.getBookingsRevenue(),
      ]);
      if (statusRes.status === 'fulfilled') {
        setBookingsStatus(statusRes.value);
      }
      if (revRes.status === 'fulfilled') {
        setRevenueData(revRes.value);
      }
    } catch (err: any) {
      console.error('[AdminBookingsPage] metrics fetch failed:', err);
    } finally {
      setLoadingMetrics(false);
    }
  }, []);

  // 2. Fetch Bookings List
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AdminService.getBookings({ page, limit: 10 });
      const list = data?.bookings || data?.items || data?.data || (Array.isArray(data) ? data : []);
      setBookings(Array.isArray(list) ? list : []);

      const total = data?.total || data?.meta?.total || (Array.isArray(list) ? list.length : 0);
      const limit = data?.limit || 10;
      setTotalPages(Math.max(1, Math.ceil(total / limit)));
    } catch (err: any) {
      console.error('[AdminBookingsPage] GET /dashboard/bookings failed:', err);
      setError(
        err?.message ||
          (locale === 'ar'
            ? 'تعذر تحميل قائمة الحجوزات من الخادم.'
            : 'Could not load bookings from the server.')
      );
    } finally {
      setLoading(false);
    }
  }, [page, locale]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const normalizeStatusList = (raw: any): AdminStatusCount[] => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'object') {
      return Object.entries(raw).map(([key, val]) => ({
        status: key,
        count: typeof val === 'number' ? val : Number((val as any)?.count || 0),
      }));
    }
    return [];
  };

  const statusMetrics = normalizeStatusList(bookingsStatus);

  const parsedRevenue =
    revenueData?.totalRevenue ??
    revenueData?.revenue ??
    revenueData?.total ??
    (typeof revenueData === 'number' ? revenueData : null);

  const revenueCurrency = revenueData?.currency || (locale === 'ar' ? 'ج.م' : 'EGP');

  const filteredBookings = statusFilter
    ? bookings.filter((b) => b.status === statusFilter)
    : bookings;

  return (
    <div className="dary-page-container">
      {/* Header */}
      <div className="dary-page-header">
        <div>
          <h1 className="dary-page-title" style={{ color: '#0B2A4A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📅</span>
            <span>{locale === 'ar' ? 'إدارة ومتابعة الحجوزات' : 'Bookings Management'}</span>
          </h1>
          <p className="dary-page-subtitle">
            {locale === 'ar'
              ? 'متابعة كافة طلبات حجز الغرف والأسرة لطلاب الجامعات بين المستأجرين وأصحاب العقارات.'
              : 'Supervise all student room & bed bookings, contracts, and payment transactions.'}
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="dary-metrics-grid" style={{ marginBottom: '1.5rem' }}>
        {/* Revenue Card */}
        <div className="dary-metric-card">
          <div className="dary-metric-icon-wrap" style={{ backgroundColor: '#FAF5FF', color: '#9333EA' }}>
            💰
          </div>
          <div>
            <h3 className="dary-metric-number">
              {loadingMetrics ? '...' : parsedRevenue !== null ? `${parsedRevenue.toLocaleString()} ${revenueCurrency}` : '—'}
            </h3>
            <p className="dary-metric-label">{locale === 'ar' ? 'إجمالي الحصيلة المالية' : 'Total Revenue'}</p>
          </div>
        </div>

        {/* Status Badges */}
        {statusMetrics.map((item, idx) => (
          <div key={idx} className="dary-metric-card">
            <div className="dary-metric-icon-wrap" style={{ backgroundColor: '#EEF3FF', color: '#2F6BFF' }}>
              📋
            </div>
            <div>
              <h3 className="dary-metric-number">{loadingMetrics ? '...' : item.count}</h3>
              <p className="dary-metric-label">{item.status}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="dary-card" style={{ marginBottom: '1.5rem', padding: '0.75rem 1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, color: '#0B2A4A', fontSize: '0.9rem' }}>
            {locale === 'ar' ? 'تصفية الحالة:' : 'Filter Status:'}
          </span>
          {['', 'CONFIRMED', 'PENDING', 'CONTACTED', 'CLOSED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: statusFilter === st ? '#0B2A4A' : '#CBD5E1',
                backgroundColor: statusFilter === st ? '#0B2A4A' : '#FFFFFF',
                color: statusFilter === st ? '#FFFFFF' : '#475569',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {st === '' ? (locale === 'ar' ? 'الكل' : 'All') : st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="dary-card">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>
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
            <p>{locale === 'ar' ? 'جاري تحميل قائمة الحجوزات...' : 'Loading bookings...'}</p>
          </div>
        ) : error ? (
          <div className="dary-error-alert" style={{ margin: '1rem' }}>
            <span>{error}</span>
            <button type="button" onClick={fetchBookings} className="dary-retry-btn">
              {locale === 'ar' ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748B' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>📅</span>
            <p style={{ fontWeight: 600, color: '#0B2A4A' }}>
              {locale === 'ar' ? 'لا توجد حجوزات مطابقة.' : 'No bookings found.'}
            </p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="dary-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E2E8F0', textAlign: locale === 'ar' ? 'right' : 'left' }}>
                    <th style={{ padding: '0.85rem 1rem', color: '#0B2A4A' }}>#</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#0B2A4A' }}>{locale === 'ar' ? 'العقار' : 'Property'}</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#0B2A4A' }}>{locale === 'ar' ? 'المستأجر' : 'Tenant'}</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#0B2A4A' }}>{locale === 'ar' ? 'الفترة' : 'Dates'}</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#0B2A4A' }}>{locale === 'ar' ? 'المبلغ' : 'Amount'}</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#0B2A4A' }}>{locale === 'ar' ? 'الحالة' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '0.85rem 1rem', color: '#64748B', fontSize: '0.85rem' }}>
                        {b.id ? b.id.substring(0, 8) : '—'}
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 600, color: '#0B2A4A' }}>
                          {b.property?.title || b.propertyId || 'Student Housing'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                          {b.property?.city || b.property?.address || ''}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', color: '#475569', fontSize: '0.85rem' }}>
                        <div style={{ fontWeight: 600 }}>{b.tenant?.name || b.tenantId || '—'}</div>
                        {b.tenant?.email && <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{b.tenant.email}</div>}
                      </td>

                      <td style={{ padding: '0.85rem 1rem', color: '#64748B', fontSize: '0.82rem' }}>
                        {b.startDate ? new Date(b.startDate).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US') : '—'}
                        {' → '}
                        {b.endDate ? new Date(b.endDate).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US') : '—'}
                      </td>

                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0B2A4A', fontSize: '0.85rem' }}>
                        {b.totalPrice !== undefined ? `${b.totalPrice.toLocaleString()} ${revenueCurrency}` : '—'}
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          style={{
                            padding: '0.25rem 0.65rem',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            backgroundColor:
                              b.status === 'CONFIRMED'
                                ? '#DCFCE7'
                                : b.status === 'PENDING'
                                ? '#FEF9C3'
                                : '#FEE2E2',
                            color:
                              b.status === 'CONFIRMED'
                                ? '#15803D'
                                : b.status === 'PENDING'
                                ? '#A16207'
                                : '#B91C1C',
                          }}
                        >
                          {b.status || 'PENDING'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.25rem',
                  borderTop: '1px solid #E2E8F0',
                }}
              >
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    background: page <= 1 ? '#F1F5F9' : '#FFFFFF',
                    cursor: page <= 1 ? 'not-allowed' : 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  {locale === 'ar' ? 'السابق' : 'Previous'}
                </button>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    background: page >= totalPages ? '#F1F5F9' : '#FFFFFF',
                    cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  {locale === 'ar' ? 'التالي' : 'Next'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
