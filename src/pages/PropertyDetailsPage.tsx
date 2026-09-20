import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLocale } from '../utils/LocaleContext';
import { propertyService } from '../services/propertyService';
import { TenantService } from '../services/tenantService';
import { useAuth } from '../context/AuthContext';
import type { Property } from '../types/property';

export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { locale } = useLocale();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Favorites state
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Booking request state
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // ── Load property from real API ───────────────────────────────────────────
  const fetchProperty = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await propertyService.getPropertyById(id);
      if (!data) {
        setError(locale === 'ar' ? 'لم يتم العثور على هذا العقار.' : 'Property not found.');
      } else {
        setProperty(data);
        // Record this as a recently viewed item (non-blocking)
        if (isAuthenticated) {
          TenantService.recordRecentlyViewed(id).catch(() => {
            // Non-critical — silently ignore
          });
        }
      }
    } catch (err: any) {
      setError(
        err?.message ||
          (locale === 'ar'
            ? 'تعذر تحميل بيانات العقار. يرجى المحاولة مرة أخرى.'
            : 'Could not load property details. Please try again.')
      );
    } finally {
      setLoading(false);
    }
  }, [id, locale, isAuthenticated]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  // ── Check if property is already favorited ────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated || !id) return;
    TenantService.getFavorites()
      .then((favs) => {
        const found = favs.some(
          (f) => f.propertyId === id || f.property?.id === id || f.id === id
        );
        setIsFavorite(found);
      })
      .catch(() => {/* non-critical */});
  }, [id, isAuthenticated]);

  // ── Toggle Favorite ───────────────────────────────────────────────────────
  async function handleToggleFavorite() {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!id) return;
    setFavLoading(true);
    try {
      if (isFavorite) {
        await TenantService.removeFavorite(id);
        setIsFavorite(false);
      } else {
        await TenantService.addFavorite(id);
        setIsFavorite(true);
      }
    } catch (err: any) {
      console.error('[PropertyDetails] Favorite toggle error:', err);
    } finally {
      setFavLoading(false);
    }
  }

  // ── Request to view / book ────────────────────────────────────────────────
  async function handleBookingRequest() {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!id) return;
    setBookingLoading(true);
    setBookingError(null);
    try {
      await TenantService.createBooking(id);
      setBookingSuccess(true);
    } catch (err: any) {
      setBookingError(
        err?.message ||
          (locale === 'ar'
            ? 'تعذر إرسال طلب الحجز. يرجى المحاولة مرة أخرى.'
            : 'Could not submit booking request. Please try again.')
      );
    } finally {
      setBookingLoading(false);
    }
  }

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="page" style={{ paddingTop: '7rem' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <div style={{ height: '380px', borderRadius: '20px', background: '#F1F5F9', marginBottom: '2rem', animation: 'shimmer 1.4s infinite' }} />
          <div style={{ height: '28px', width: '60%', borderRadius: '8px', background: '#F1F5F9', marginBottom: '1rem', animation: 'shimmer 1.4s infinite' }} />
          <div style={{ height: '18px', width: '40%', borderRadius: '8px', background: '#F1F5F9', marginBottom: '0.5rem', animation: 'shimmer 1.4s infinite' }} />
          <div style={{ height: '18px', width: '30%', borderRadius: '8px', background: '#F1F5F9', animation: 'shimmer 1.4s infinite' }} />
        </div>
      </main>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error || !property) {
    return (
      <main className="page" style={{ paddingTop: '7rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '540px' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-navy)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1.25rem', opacity: 0.4 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
            {locale === 'ar' ? 'تعذر تحميل العقار' : 'Property Not Available'}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {error || (locale === 'ar' ? 'لم يتم العثور على هذا العقار.' : 'This property could not be found.')}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={fetchProperty}
              style={{ padding: '0.65rem 1.4rem', borderRadius: '999px', background: 'var(--color-blue)', color: '#fff', fontWeight: 600, fontSize: '0.9rem', border: 'none', cursor: 'pointer' }}
            >
              {locale === 'ar' ? 'إعادة المحاولة' : 'Retry'}
            </button>
            <Link
              to="/properties"
              style={{ padding: '0.65rem 1.4rem', borderRadius: '999px', background: '#F1F5F9', color: 'var(--color-navy)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}
            >
              {locale === 'ar' ? 'تصفح العقارات' : 'Browse Properties'}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const displayTitle = property.title[locale] || property.title.ar || property.title.en;
  const displayLocation = property.location[locale] || property.location.ar || property.location.en;
  const displayType = property.type[locale] || property.type.ar || property.type.en;

  return (
    <main className="page" style={{ paddingTop: '7rem', paddingBottom: '4rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>

        {/* Back link */}
        <Link
          to="/properties"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', marginBottom: '1.5rem' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {locale === 'ar' ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
          </svg>
          {locale === 'ar' ? 'العودة إلى القائمة' : 'Back to listings'}
        </Link>

        {/* Hero Image */}
        <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', marginBottom: '2rem', aspectRatio: '16/9', background: '#F1F5F9' }}>
          <img
            src={property.image}
            alt={displayTitle}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&q=80&w=900&h=506&fit=crop';
            }}
          />

          {/* Favorite button overlay */}
          <button
            type="button"
            onClick={handleToggleFavorite}
            disabled={favLoading}
            aria-label={isFavorite ? (locale === 'ar' ? 'إزالة من المفضلة' : 'Remove from favorites') : (locale === 'ar' ? 'إضافة للمفضلة' : 'Add to favorites')}
            style={{
              position: 'absolute',
              top: '16px',
              insetInlineEnd: '16px',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#fff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
              color: isFavorite ? '#EF4444' : '#9CA3AF',
              fontSize: '1.2rem',
              transition: 'color 0.2s, transform 0.15s',
              opacity: favLoading ? 0.6 : 1,
            }}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        </div>

        {/* Property Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'start', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '0.5rem', lineHeight: 1.25 }}>
              {displayTitle}
            </h1>

            <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {displayLocation}
            </p>

            {/* Specs row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-navy)', background: '#F1F5F9', padding: '0.4rem 0.9rem', borderRadius: '999px' }}>
                🏠 {displayType}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-navy)', background: '#F1F5F9', padding: '0.4rem 0.9rem', borderRadius: '999px' }}>
                🛏 {property.bedrooms} {locale === 'ar' ? 'غرف' : 'Beds'}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-navy)', background: '#F1F5F9', padding: '0.4rem 0.9rem', borderRadius: '999px' }}>
                🚿 {property.bathrooms} {locale === 'ar' ? 'حمامات' : 'Baths'}
              </span>
            </div>
          </div>

          {/* Price + CTA card */}
          <div style={{ minWidth: '220px', border: '1px solid rgba(11,42,74,0.1)', borderRadius: '16px', padding: '1.5rem', background: '#fff', boxShadow: '0 4px 20px rgba(11,42,74,0.07)', flexShrink: 0 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
              {locale === 'ar' ? 'السعر الشهري' : 'Monthly Price'}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-blue)', lineHeight: 1, marginBottom: '0.35rem' }}>
              {property.price.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
              {property.currency} / {locale === 'ar' ? 'شهر' : 'month'}
            </div>

            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '0.75rem', background: '#F0FDF4', borderRadius: '10px', color: '#16A34A', fontWeight: 700, fontSize: '0.9rem' }}>
                ✅ {locale === 'ar' ? 'تم إرسال طلب الحجز!' : 'Booking request sent!'}
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleBookingRequest}
                  disabled={bookingLoading}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '10px',
                    background: 'var(--color-blue)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    border: 'none',
                    cursor: bookingLoading ? 'not-allowed' : 'pointer',
                    opacity: bookingLoading ? 0.7 : 1,
                    marginBottom: '0.75rem',
                  }}
                >
                  {bookingLoading
                    ? (locale === 'ar' ? 'جاري الإرسال...' : 'Sending...')
                    : (locale === 'ar' ? 'طلب حجز' : 'Request to Book')}
                </button>

                {bookingError && (
                  <p style={{ fontSize: '0.82rem', color: '#EF4444', textAlign: 'center', margin: 0 }}>{bookingError}</p>
                )}
              </>
            )}

            <button
              type="button"
              onClick={handleToggleFavorite}
              disabled={favLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '10px',
                background: 'transparent',
                color: isFavorite ? '#EF4444' : 'var(--color-navy)',
                fontWeight: 600,
                fontSize: '0.9rem',
                border: '1px solid rgba(11,42,74,0.15)',
                cursor: 'pointer',
                marginTop: '0.5rem',
              }}
            >
              {isFavorite
                ? (locale === 'ar' ? '❤️ محفوظ في المفضلة' : '❤️ Saved')
                : (locale === 'ar' ? '🤍 حفظ في المفضلة' : '🤍 Save to Favorites')}
            </button>
          </div>
        </div>

        {/* No additional fields fabricated — only fields returned by normalizeProperty are shown */}
        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '2rem', borderTop: '1px solid rgba(11,42,74,0.07)', paddingTop: '1rem' }}>
          {locale === 'ar'
            ? 'للحصول على مزيد من التفاصيل، قم بإرسال طلب الحجز وسيتواصل معك المالك مباشرة.'
            : 'For more details, submit a booking request and the owner will contact you directly.'}
        </p>
      </div>
    </main>
  );
}
