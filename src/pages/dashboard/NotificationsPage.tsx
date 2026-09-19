import { useState, useEffect, useCallback } from 'react';
import { useLocale } from '../../utils/LocaleContext';
import { TenantService } from '../../services/tenantService';
import type { NotificationItem } from '../../services/tenantService';

export default function NotificationsPage() {
  const { locale } = useLocale();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await TenantService.getNotifications(1, 50);
      setNotifications(res.items);
    } catch (err: any) {
      console.error('[NotificationsPage] GET failed:', err);
      setError(
        err?.message ||
          (locale === 'ar'
            ? 'تعذر تحميل الإشعارات من الخادم.'
            : 'Could not load notifications from the server.')
      );
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  async function handleMarkAsRead(id: string) {
    try {
      await TenantService.markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true, read: true } : n))
      );
    } catch (err) {
      console.error('[NotificationsPage] Mark as read error:', err);
    }
  }

  async function handleMarkAllAsRead() {
    setIsMarkingAll(true);
    try {
      await TenantService.markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, read: true }))
      );
    } catch (err: any) {
      console.error('[NotificationsPage] Mark all read error:', err);
      alert(err?.message || (locale === 'ar' ? 'فشل تحديث الإشعارات' : 'Failed to mark all as read'));
    } finally {
      setIsMarkingAll(false);
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead && !n.read).length;

  return (
    <div>
      <div className="dary-section-card">
        <div className="dary-section-header">
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--dary-navy)', margin: 0 }}>
              {locale === 'ar' ? 'الإشعارات والتنبيهات' : 'Notifications & Alerts'}
            </h2>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.875rem', color: 'var(--dary-muted)' }}>
              {locale === 'ar'
                ? 'تحديثات الحجوزات، حالة الطلبات، ورسائل الدعم الفني.'
                : 'Booking status updates, tenant notices, and support alerts.'}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAll}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                backgroundColor: '#EFF6FF',
                color: 'var(--dary-blue)',
                border: '1px solid #BFDBFE',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isMarkingAll
                ? locale === 'ar'
                  ? 'جاري التحديث...'
                  : 'Updating...'
                : locale === 'ar'
                ? 'تحديد الكل كمقروء'
                : 'Mark All as Read'}
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--dary-muted)' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #E2E8F0', borderTopColor: '#0B2A4A', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              {locale === 'ar' ? 'جاري تحميل الإشعارات...' : 'Loading notifications...'}
            </p>
          </div>
        ) : error ? (
          <div className="dary-error-state">
            <p className="dary-error-title">{locale === 'ar' ? 'خطأ في جلب البيانات' : 'API Error'}</p>
            <p className="dary-error-desc">{error}</p>
            <button type="button" className="dary-retry-btn" onClick={fetchNotifications}>
              {locale === 'ar' ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="dary-empty-state">
            <div className="dary-empty-icon">🔔</div>
            <h4 className="dary-empty-title">{locale === 'ar' ? 'لا توجد إشعارات حالية' : 'No Notifications'}</h4>
            <p className="dary-empty-desc">
              {locale === 'ar'
                ? 'أنت مطلع على كافة التحديثات! سنخبرك هنا فور وجود أي تحديثات تخص حجوزاتك أو حسابك.'
                : 'You are all caught up! We will notify you here when there are updates on your bookings or inquiries.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {notifications.map((item) => {
              const isUnread = !item.isRead && !item.read;
              const title = item.title || (locale === 'ar' ? 'إشعار جديد' : 'New Notification');
              const message = item.message || item.body || item.content || '';
              const dateStr = item.createdAt
                ? new Date(item.createdAt).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')
                : '';

              return (
                <div
                  key={item.id}
                  onClick={() => isUnread && handleMarkAsRead(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    padding: '1.15rem 1.25rem',
                    borderRadius: '12px',
                    border: `1px solid ${isUnread ? '#BFDBFE' : 'var(--dary-border)'}`,
                    backgroundColor: isUnread ? '#F8FAFF' : '#FFFFFF',
                    cursor: isUnread ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: isUnread ? '#2F6BFF' : '#CBD5E1',
                        marginTop: '0.45rem',
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <h4
                        style={{
                          margin: '0 0 0.25rem',
                          fontSize: '0.95rem',
                          color: 'var(--dary-navy)',
                          fontWeight: isUnread ? 700 : 600,
                        }}
                      >
                        {title}
                      </h4>
                      {message && (
                        <p style={{ margin: '0 0 0.4rem', fontSize: '0.85rem', color: 'var(--dary-muted)', lineHeight: 1.5 }}>
                          {message}
                        </p>
                      )}
                      {dateStr && (
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{dateStr}</span>
                      )}
                    </div>
                  </div>

                  {isUnread && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(item.id);
                      }}
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: '6px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--dary-border)',
                        color: 'var(--dary-blue)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {locale === 'ar' ? 'تعليم كمقروء' : 'Mark as Read'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
