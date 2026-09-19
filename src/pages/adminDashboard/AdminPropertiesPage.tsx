import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../utils/LocaleContext';
import { AdminService } from '../../services/adminService';
import type { AdminPropertyItem, AdminStatusCount } from '../../services/adminService';

export default function AdminPropertiesPage() {
  const { locale } = useLocale();

  const [properties, setProperties] = useState<AdminPropertyItem[]>([]);
  const [propertiesStatus, setPropertiesStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 1. Fetch Property Status Metrics
  const fetchStatus = useCallback(async () => {
    setLoadingStatus(true);
    try {
      const data = await AdminService.getPropertiesStatus();
      setPropertiesStatus(data);
    } catch (err: any) {
      console.error('[AdminPropertiesPage] GET /dashboard/properties/status failed:', err);
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  // 2. Fetch Properties List
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AdminService.getProperties({ page, limit: 10 });
      const list = data?.properties || data?.items || data?.data || (Array.isArray(data) ? data : []);
      setProperties(Array.isArray(list) ? list : []);

      const total = data?.total || data?.meta?.total || (Array.isArray(list) ? list.length : 0);
      const limit = data?.limit || 10;
      setTotalPages(Math.max(1, Math.ceil(total / limit)));
    } catch (err: any) {
      console.error('[AdminPropertiesPage] GET /dashboard/properties failed:', err);
      setError(
        err?.message ||
          (locale === 'ar'
            ? 'تعذر تحميل قائمة العقارات من الخادم.'
            : 'Could not load properties from the server.')
      );
    } finally {
      setLoading(false);
    }
  }, [page, locale]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

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

  const statusMetrics = normalizeStatusList(propertiesStatus);

  const filteredProperties = statusFilter
    ? properties.filter((p) => p.status === statusFilter)
    : properties;

  return (
    <div className="dary-page-container">
      {/* Header */}
      <div className="dary-page-header">
        <div>
          <h1 className="dary-page-title" style={{ color: '#0B2A4A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🏢</span>
            <span>{locale === 'ar' ? 'إدارة العقارات والوحدات' : 'Properties Management'}</span>
          </h1>
          <p className="dary-page-subtitle">
            {locale === 'ar'
              ? 'مراجعة كافة عروض سكن الطلاب المضافة، التأكد من استيفاء الشروط والموافقة أو المراجعة.'
              : 'Audit, review and oversee student housing listings registered across the platform.'}
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="dary-metrics-grid" style={{ marginBottom: '1.5rem' }}>
        {statusMetrics.map((item, idx) => (
          <div key={idx} className="dary-metric-card">
            <div className="dary-metric-icon-wrap" style={{ backgroundColor: '#F0FDF4', color: '#16A34A' }}>
              🏠
            </div>
            <div>
              <h3 className="dary-metric-number">
                {loadingStatus ? '...' : item.count}
              </h3>
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
          {['', 'APPROVED', 'PENDING', 'SUSPENDED', 'REJECTED'].map((st) => (
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

      {/* Properties Table / Cards */}
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
            <p>{locale === 'ar' ? 'جاري تحميل قائمة العقارات...' : 'Loading properties...'}</p>
          </div>
        ) : error ? (
          <div className="dary-error-alert" style={{ margin: '1rem' }}>
            <span>{error}</span>
            <button type="button" onClick={fetchProperties} className="dary-retry-btn">
              {locale === 'ar' ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748B' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🏠</span>
            <p style={{ fontWeight: 600, color: '#0B2A4A' }}>
              {locale === 'ar' ? 'لا توجد عقارات مطابقة.' : 'No properties found.'}
            </p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="dary-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E2E8F0', textAlign: locale === 'ar' ? 'right' : 'left' }}>
                    <th style={{ padding: '0.85rem 1rem', color: '#0B2A4A' }}>{locale === 'ar' ? 'العقار' : 'Property'}</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#0B2A4A' }}>{locale === 'ar' ? 'المالك' : 'Owner'}</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#0B2A4A' }}>{locale === 'ar' ? 'المدينة' : 'City'}</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#0B2A4A' }}>{locale === 'ar' ? 'السعر' : 'Price'}</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#0B2A4A' }}>{locale === 'ar' ? 'الحالة' : 'Status'}</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#0B2A4A' }}>{locale === 'ar' ? 'التاريخ' : 'Created'}</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#0B2A4A' }}>{locale === 'ar' ? 'إجراء' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.map((p) => {
                    const primaryImg =
                      Array.isArray(p.images) && p.images.length > 0
                        ? typeof p.images[0] === 'string'
                          ? p.images[0]
                          : p.images[0]?.url
                        : null;

                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {primaryImg ? (
                              <img
                                src={primaryImg}
                                alt={p.title}
                                style={{
                                  width: '44px',
                                  height: '44px',
                                  borderRadius: '8px',
                                  objectFit: 'cover',
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: '44px',
                                  height: '44px',
                                  borderRadius: '8px',
                                  backgroundColor: '#EEF3FF',
                                  color: '#2F6BFF',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '1.2rem',
                                }}
                              >
                                🏢
                              </div>
                            )}
                            <div>
                              <div style={{ fontWeight: 600, color: '#0B2A4A' }}>{p.title}</div>
                              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                                {p.propertyType || p.propertyClass || 'Student Housing'}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '0.85rem 1rem', color: '#475569', fontSize: '0.85rem' }}>
                          <div>{p.owner?.name || p.ownerId || '—'}</div>
                          {p.owner?.email && <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{p.owner.email}</div>}
                        </td>

                        <td style={{ padding: '0.85rem 1rem', color: '#475569', fontSize: '0.85rem' }}>
                          {p.city || p.governorate || '—'}
                        </td>

                        <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0B2A4A', fontSize: '0.85rem' }}>
                          {p.price !== undefined ? `${p.price.toLocaleString()} ${p.currency || (locale === 'ar' ? 'ج.م' : 'EGP')}` : '—'}
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span
                            style={{
                              padding: '0.25rem 0.65rem',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              backgroundColor:
                                p.status === 'APPROVED'
                                  ? '#DCFCE7'
                                  : p.status === 'PENDING'
                                  ? '#FEF9C3'
                                  : '#FEE2E2',
                              color:
                                p.status === 'APPROVED'
                                  ? '#15803D'
                                  : p.status === 'PENDING'
                                  ? '#A16207'
                                  : '#B91C1C',
                            }}
                          >
                            {p.status || 'ACTIVE'}
                          </span>
                        </td>

                        <td style={{ padding: '0.85rem 1rem', color: '#64748B', fontSize: '0.82rem' }}>
                          {p.createdAt ? new Date(p.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US') : '—'}
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <Link
                            to={`/properties/${p.id}`}
                            style={{
                              padding: '0.35rem 0.75rem',
                              borderRadius: '6px',
                              backgroundColor: '#0B2A4A',
                              color: '#FFFFFF',
                              textDecoration: 'none',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                            }}
                          >
                            {locale === 'ar' ? 'عرض' : 'View'}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
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
