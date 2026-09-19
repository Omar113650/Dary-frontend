import { useState, useEffect, useCallback } from 'react';
import { useLocale } from '../../utils/LocaleContext';
import { OwnerService } from '../../services/ownerService';
import type {
  OwnerPropertyItem,
  OwnerPropertyBookingItem,
} from '../../services/ownerService';

export default function OwnerBookingsPage() {
  const { locale } = useLocale();

  // Booking status breakdown
  const [bookingStatusData, setBookingStatusData] = useState<any>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);

  // Properties to select from
  const [properties, setProperties] = useState<OwnerPropertyItem[]>([]);
  const [selectedPropId, setSelectedPropId] = useState<string>('');

  // Property bookings list
  const [propertyBookings, setPropertyBookings] = useState<OwnerPropertyBookingItem[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    setLoadingStatus(true);
    setStatusError(null);
    try {
      const data = await OwnerService.getBookingsStatus();
      setBookingStatusData(data);
    } catch (err: any) {
      console.error('[OwnerBookingsPage] GET /dashboard/owner/bookings/status failed:', err);
      setStatusError(
        err?.message ||
          (locale === 'ar'
            ? 'تعذر تحميل إحصائيات الحجوزات من الخادم.'
            : 'Could not load bookings status from the server.')
      );
    } finally {
      setLoadingStatus(false);
    }
  }, [locale]);

  const fetchProperties = useCallback(async () => {
    try {
      const list = await OwnerService.getMyProperties();
      setProperties(list);
      if (list.length > 0 && !selectedPropId) {
        setSelectedPropId(list[0].id);
      }
    } catch (err) {
      console.warn('[OwnerBookingsPage] Could not load properties list:', err);
    }
  }, [selectedPropId]);

  const fetchPropertyBookings = useCallback(async (propId: string) => {
    if (!propId) return;
    setLoadingBookings(true);
    setBookingsError(null);
    try {
      // Confirmed endpoint: GET /booking/property/:propertyId
      const data = await OwnerService.getPropertyBookings(propId);
      setPropertyBookings(data);
    } catch (err: any) {
      console.error(`[OwnerBookingsPage] GET /booking/property/${propId} failed:`, err);
      setBookingsError(
        err?.message ||
          (locale === 'ar'
            ? 'تعذر تحميل طلبات الحجز لهذا العقار.'
            : 'Could not load bookings for this property.')
      );
    } finally {
      setLoadingBookings(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchStatus();
    fetchProperties();
  }, [fetchStatus, fetchProperties]);

  useEffect(() => {
    if (selectedPropId) {
      fetchPropertyBookings(selectedPropId);
    }
  }, [selectedPropId, fetchPropertyBookings]);

  function getStatusBadge(status?: string) {
    const s = (status || '').toUpperCase();
    if (s === 'PENDING') {
      return (
        <span className="dary-badge dary-badge-pending">
          {locale === 'ar' ? 'قيد المراجعة' : 'Pending'}
        </span>
      );
    }
    if (s === 'CONTACTED') {
      return (
        <span className="dary-badge dary-badge-contacted">
          {locale === 'ar' ? 'تم التواصل' : 'Contacted'}
        </span>
      );
    }
    if (s === 'CLOSED') {
      return (
        <span className="dary-badge dary-badge-closed">
          {locale === 'ar' ? 'مكتمل' : 'Closed'}
        </span>
      );
    }
    if (s === 'CANCELLED') {
      return (
        <span className="dary-badge dary-badge-cancelled">
          {locale === 'ar' ? 'ملغي' : 'Cancelled'}
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
              {locale === 'ar' ? 'إدارة طلبات الحجز' : 'Manage Bookings'}
            </h2>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.875rem', color: 'var(--dary-muted)' }}>
              {locale === 'ar'
                ? 'متابعة طلبات الحجز الواردة من الطلاب على كافة عقاراتك المسجلة.'
                : 'Review booking requests submitted by students for your properties.'}
            </p>
          </div>
        </div>

        {/* 1. Status Overview */}
        {loadingStatus ? (
          <div style={{ padding: '1rem 0', textAlign: 'center', color: 'var(--dary-muted)', fontSize: '0.85rem' }}>
            {locale === 'ar' ? 'جاري تحميل ملخص الحجوزات...' : 'Loading status overview...'}
          </div>
        ) : statusError ? (
          <div className="dary-error-state" style={{ marginBottom: '1.5rem' }}>
            <p className="dary-error-title">{locale === 'ar' ? 'خطأ في جلب حالة الحجوزات' : 'API Error'}</p>
            <p className="dary-error-desc">{statusError}</p>
            <button type="button" className="dary-retry-btn" onClick={fetchStatus}>
              {locale === 'ar' ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        ) : bookingStatusData ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {typeof bookingStatusData === 'object' &&
              Object.entries(bookingStatusData)
                .filter(([k]) => !['success', 'message', 'status', 'statusCode'].includes(k))
                .map(([key, val]) => (
                  <div key={key} style={{ padding: '1rem', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid var(--dary-border)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dary-navy)' }}>
                      {typeof val === 'number' ? val : typeof val === 'object' ? (val as any).count || 0 : '0'}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--dary-muted)' }}>{key}</span>
                  </div>
                ))}
          </div>
        ) : null}

        {/* 2. Property Selector */}
        {properties.length > 0 && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '10px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--dary-navy)', marginBottom: '0.5rem' }}>
              {locale === 'ar' ? 'تصفية حسب العقار:' : 'Filter by Property:'}
            </label>
            <select
              value={selectedPropId}
              onChange={(e) => setSelectedPropId(e.target.value)}
              style={{
                maxWidth: '400px',
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid var(--dary-border)',
                backgroundColor: '#FFFFFF',
                fontSize: '0.9rem',
              }}
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} {p.city ? `(${p.city})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 3. Bookings List */}
        {loadingBookings ? (
          <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--dary-muted)' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #E2E8F0', borderTopColor: '#0B2A4A', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              {locale === 'ar' ? 'جاري تحميل الحجوزات...' : 'Loading bookings...'}
            </p>
          </div>
        ) : bookingsError ? (
          <div className="dary-error-state">
            <p className="dary-error-title">{locale === 'ar' ? 'خطأ في جلب الحجوزات' : 'API Error'}</p>
            <p className="dary-error-desc">{bookingsError}</p>
            <button
              type="button"
              className="dary-retry-btn"
              onClick={() => fetchPropertyBookings(selectedPropId)}
            >
              {locale === 'ar' ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        ) : propertyBookings.length === 0 ? (
          <div className="dary-empty-state">
            <div className="dary-empty-icon">📑</div>
            <h4 className="dary-empty-title">{locale === 'ar' ? 'لا توجد طلبات حجز لهذا العقار' : 'No Bookings for this Property'}</h4>
            <p className="dary-empty-desc">
              {locale === 'ar'
                ? 'ستظهر هنا طلبات الحجز فور قيام الطلاب بتقديم طلب حجز على هذا السكن.'
                : 'Booking requests will appear here when students book this accommodation.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {propertyBookings.map((b) => (
              <div
                key={b.id}
                style={{
                  border: '1px solid var(--dary-border)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--dary-navy)', fontWeight: 700 }}>
                      {b.tenant?.name || (locale === 'ar' ? 'طلب حجز طالب' : 'Student Booking Request')}
                    </h3>
                    {getStatusBadge(b.status)}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--dary-muted)' }}>
                    {b.tenant?.email ? `${b.tenant.email} • ` : ''}
                    {b.tenant?.phone ? `${b.tenant.phone} • ` : ''}
                    {b.bedsRequested ? `${b.bedsRequested} ${locale === 'ar' ? 'أسرة' : 'beds'} • ` : ''}
                    {b.createdAt ? new Date(b.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US') : ''}
                  </p>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--dary-muted)', textAlign: locale === 'ar' ? 'left' : 'right' }}>
                  <span style={{ display: 'block' }}>
                    {locale === 'ar' ? 'تاريخ الحجز' : 'Booking Period'}
                  </span>
                  <strong style={{ color: 'var(--dary-navy)' }}>
                    {b.startDate ? new Date(b.startDate).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US') : '—'}
                    {' → '}
                    {b.endDate ? new Date(b.endDate).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US') : '—'}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
