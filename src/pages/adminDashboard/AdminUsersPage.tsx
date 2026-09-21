import { useState, useEffect, useCallback } from 'react';
import { useLocale } from '../../utils/LocaleContext';
import { AdminService } from '../../services/adminService';
import type { AdminUserItem, AdminStatusCount } from '../../services/adminService';

export default function AdminUsersPage() {
  const { locale } = useLocale();

  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [usersStatus, setUsersStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Updating User State
  const [activeUpdatingId, setActiveUpdatingId] = useState<string | null>(null);

  // 1. Fetch Users Status counts
  const fetchUsersStatus = useCallback(async () => {
    setLoadingStatus(true);
    try {
      const data = await AdminService.getUsersStatus();
      setUsersStatus(data);
    } catch (err: any) {
      console.error('[AdminUsersPage] GET /dashboard/users/status failed:', err);
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  // 2. Fetch Users List
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page, limit: 10 };
      if (search.trim()) params.search = search.trim();
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;

      const data = await AdminService.getUsers(params);
      const list = data?.users || data?.items || data?.data || (Array.isArray(data) ? data : []);
      setUsers(Array.isArray(list) ? list : []);

      const total = data?.total || data?.meta?.total || (Array.isArray(list) ? list.length : 0);
      const limit = data?.limit || 10;
      setTotalPages(Math.max(1, Math.ceil(total / limit)));
    } catch (err: any) {
      console.error('[AdminUsersPage] GET /dashboard/users failed:', err);
      setError(
        err?.message ||
          (locale === 'ar'
            ? 'تعذر تحميل قائمة المستخدمين من الخادم.'
            : 'Could not load users list from the server.')
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, statusFilter, locale]);

  useEffect(() => {
    fetchUsersStatus();
  }, [fetchUsersStatus]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle Status Update
  const handleUpdateStatus = async (userId: string, newStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') => {
    setActiveUpdatingId(userId);
    setActionMessage(null);
    try {
      await AdminService.updateUserStatus(userId, newStatus);
      setActionMessage({
        type: 'success',
        text: locale === 'ar' ? 'تم تحديث حالة المستخدم بنجاح.' : 'User status updated successfully.',
      });
      // Refresh list & status metrics in parallel
      await Promise.all([fetchUsers(), fetchUsersStatus()]);
    } catch (err: any) {
      console.error('[AdminUsersPage] PATCH /auth/users/:id/status failed:', err);
      setActionMessage({
        type: 'error',
        text: err?.message || (locale === 'ar' ? 'فشل تحديث حالة المستخدم.' : 'Failed to update user status.'),
      });
    } finally {
      setActiveUpdatingId(null);
    }
  };

  // Handle Role Assignment
  const handleAssignRole = async (userId: string, currentRole: string) => {
    const nextRole =
      currentRole.toLowerCase() === 'admin'
        ? 'tenant'
        : currentRole.toLowerCase() === 'owner'
        ? 'admin'
        : 'owner';

    setActiveUpdatingId(userId);
    setActionMessage(null);
    try {
      await AdminService.assignRole(userId, nextRole);
      setActionMessage({
        type: 'success',
        text: locale === 'ar' ? `تم تعيين الدور (${nextRole}) بنجاح.` : `Role (${nextRole}) assigned successfully.`,
      });
      await Promise.all([fetchUsers(), fetchUsersStatus()]);
    } catch (err: any) {
      console.error('[AdminUsersPage] POST /roles/assign failed:', err);
      setActionMessage({
        type: 'error',
        text: err?.message || (locale === 'ar' ? 'فشل تعيين دور المستخدم.' : 'Failed to assign user role.'),
      });
    } finally {
      setActiveUpdatingId(null);
    }
  };

  // Safe parse status counts
  const normalizeStatusList = (raw: any): AdminStatusCount[] => {
    if (!raw) return [];
    const unwrapped =
      (raw?.status && typeof raw.status === 'object' && !Array.isArray(raw.status))
        ? raw.status
        : (raw?.data && typeof raw.data === 'object' && !Array.isArray(raw.data))
        ? raw.data
        : raw;

    if (Array.isArray(unwrapped)) {
      return unwrapped
        .filter((item) => item && item.status && String(item.status).toLowerCase() !== 'total')
        .map((item) => ({
          status: String(item.status).toUpperCase(),
          count: typeof item.count === 'number' ? item.count : Number(item.count || 0),
        }));
    }

    if (typeof unwrapped === 'object') {
      return Object.entries(unwrapped)
        .filter(([key, val]) => {
          const lower = key.toLowerCase();
          return lower !== 'total' && lower !== 'totalproperties' && typeof val === 'number';
        })
        .map(([key, val]) => ({
          status: key.toUpperCase(),
          count: Number(val || 0),
        }));
    }
    return [];
  };

  const statusMetrics = normalizeStatusList(usersStatus);

  return (
    <div className="dary-page-container">
      {/* Page Header */}
      <div className="dary-page-header">
        <div>
          <h1 className="dary-page-title" style={{ color: '#0B2A4A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>👥</span>
            <span>{locale === 'ar' ? 'إدارة المستخدمين والأدوار' : 'Users & Access Control'}</span>
          </h1>
          <p className="dary-page-subtitle">
            {locale === 'ar'
              ? 'مراقبة جميع حسابات الطلاب، الملاك، ومديري النظام، مع إمكانية تعديل الحالة وتعيين الصلاحيات.'
              : 'Monitor student tenants, property owners, and system administrators with role & status controls.'}
          </p>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionMessage && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderRadius: '8px',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: actionMessage.type === 'success' ? '#DCFCE7' : '#FEE2E2',
            color: actionMessage.type === 'success' ? '#15803D' : '#B91C1C',
            border: `1px solid ${actionMessage.type === 'success' ? '#86EFAC' : '#FCA5A5'}`,
          }}
        >
          <span>{actionMessage.text}</span>
          <button
            type="button"
            onClick={() => setActionMessage(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="dary-metrics-grid" style={{ marginBottom: '1.5rem' }}>
        {statusMetrics.map((item, idx) => (
          <div key={idx} className="dary-metric-card">
            <div className="dary-metric-icon-wrap" style={{ backgroundColor: '#EEF3FF', color: '#2F6BFF' }}>
              👤
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

      {/* Filter and Search Bar */}
      <div className="dary-card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ flex: '1 1 240px' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={locale === 'ar' ? 'بحث بالاسم أو البريد الإلكتروني...' : 'Search name or email...'}
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Role Filter */}
          <div style={{ minWidth: '160px' }}>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.9rem',
                backgroundColor: '#FFFFFF',
                outline: 'none',
              }}
            >
              <option value="">{locale === 'ar' ? 'جميع الأدوار (Roles)' : 'All Roles'}</option>
              <option value="tenant">{locale === 'ar' ? 'طالب / مستأجر (Tenant)' : 'Tenant'}</option>
              <option value="owner">{locale === 'ar' ? 'مالك عقار (Owner)' : 'Owner'}</option>
              <option value="admin">{locale === 'ar' ? 'مدير نظام (Admin)' : 'Admin'}</option>
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ minWidth: '160px' }}>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.9rem',
                backgroundColor: '#FFFFFF',
                outline: 'none',
              }}
            >
              <option value="">{locale === 'ar' ? 'جميع الحالات (Status)' : 'All Statuses'}</option>
              <option value="ACTIVE">{locale === 'ar' ? 'نشط (ACTIVE)' : 'ACTIVE'}</option>
              <option value="INACTIVE">{locale === 'ar' ? 'غير نشط (INACTIVE)' : 'INACTIVE'}</option>
              <option value="SUSPENDED">{locale === 'ar' ? 'معلّق (SUSPENDED)' : 'SUSPENDED'}</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => fetchUsers()}
            className="dary-primary-btn"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}
          >
            {locale === 'ar' ? 'تحديث' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Users Table */}
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
            <p>{locale === 'ar' ? 'جاري تحميل قائمة المستخدمين...' : 'Loading users list...'}</p>
          </div>
        ) : error ? (
          <div className="dary-error-alert" style={{ margin: '1rem' }}>
            <span>{error}</span>
            <button type="button" onClick={fetchUsers} className="dary-retry-btn">
              {locale === 'ar' ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748B' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>👥</span>
            <p style={{ fontWeight: 600, color: '#0B2A4A' }}>
              {locale === 'ar' ? 'لم يتم العثور على مستخدمين مطابقين.' : 'No matching users found.'}
            </p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="dary-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E2E8F0', textAlign: locale === 'ar' ? 'right' : 'left' }}>
                    <th style={{ padding: '0.85rem 1rem', color: '#0B2A4A' }}>{locale === 'ar' ? 'المستخدم' : 'User'}</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#0B2A4A' }}>{locale === 'ar' ? 'الدور (Role)' : 'Role'}</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#0B2A4A' }}>{locale === 'ar' ? 'الحالة' : 'Status'}</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#0B2A4A' }}>{locale === 'ar' ? 'الهاتف' : 'Phone'}</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#0B2A4A' }}>{locale === 'ar' ? 'تاريخ التسجيل' : 'Registered'}</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#0B2A4A' }}>{locale === 'ar' ? 'إجراءات الإدارة' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const fullName = u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email;
                    const directRole = u.role || 'tenant';
                    const isBusy = activeUpdatingId === u.id;

                    return (
                      <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                backgroundColor: '#0B2A4A',
                                color: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                              }}
                            >
                              {(fullName[0] || 'U').toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: '#0B2A4A' }}>{fullName}</div>
                              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{u.email}</div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span
                            style={{
                              padding: '0.25rem 0.65rem',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              backgroundColor:
                                directRole === 'admin'
                                  ? '#FEF3C7'
                                  : directRole === 'owner'
                                  ? '#EFF6FF'
                                  : '#F1F5F9',
                              color:
                                directRole === 'admin'
                                  ? '#B45309'
                                  : directRole === 'owner'
                                  ? '#1D4ED8'
                                  : '#475569',
                            }}
                          >
                            {directRole.toUpperCase()}
                          </span>
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span
                            style={{
                              padding: '0.25rem 0.65rem',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              backgroundColor:
                                u.status === 'ACTIVE'
                                  ? '#DCFCE7'
                                  : u.status === 'SUSPENDED'
                                  ? '#FEE2E2'
                                  : '#F1F5F9',
                              color:
                                u.status === 'ACTIVE'
                                  ? '#15803D'
                                  : u.status === 'SUSPENDED'
                                  ? '#B91C1C'
                                  : '#64748B',
                            }}
                          >
                            {u.status || 'ACTIVE'}
                          </span>
                        </td>

                        <td style={{ padding: '0.85rem 1rem', color: '#64748B', fontSize: '0.85rem' }}>
                          {u.phone || '—'}
                        </td>

                        <td style={{ padding: '0.85rem 1rem', color: '#64748B', fontSize: '0.82rem' }}>
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US') : '—'}
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {/* Toggle / Update Status */}
                            {u.status === 'SUSPENDED' ? (
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleUpdateStatus(u.id, 'ACTIVE')}
                                style={{
                                  padding: '0.3rem 0.65rem',
                                  borderRadius: '6px',
                                  backgroundColor: '#16A34A',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                  cursor: isBusy ? 'not-allowed' : 'pointer',
                                }}
                              >
                                {locale === 'ar' ? 'تفعيل' : 'Activate'}
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleUpdateStatus(u.id, 'SUSPENDED')}
                                style={{
                                  padding: '0.3rem 0.65rem',
                                  borderRadius: '6px',
                                  backgroundColor: '#DC2626',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                  cursor: isBusy ? 'not-allowed' : 'pointer',
                                }}
                              >
                                {locale === 'ar' ? 'تعليق' : 'Suspend'}
                              </button>
                            )}

                            {/* Change Role */}
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleAssignRole(u.id, directRole)}
                              style={{
                                padding: '0.3rem 0.65rem',
                                borderRadius: '6px',
                                backgroundColor: '#F1F5F9',
                                color: '#0B2A4A',
                                border: '1px solid #CBD5E1',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: isBusy ? 'not-allowed' : 'pointer',
                              }}
                            >
                              {locale === 'ar' ? 'تغيير الدور' : 'Reassign Role'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
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
