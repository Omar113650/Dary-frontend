import { ApiClient } from './apiClient';
import type { Property } from '../types/property';

export interface PropertyFilterParams {
  search?: string;
  city?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  propertyClass?: string;
  genderAllowed?: string;
  availableOnly?: boolean;
  page?: number;
  limit?: number;
}

export function normalizeProperty(raw: any): Property {
  const id = String(raw.id || raw._id || raw.propertyId || '');

  const title =
    typeof raw.title === 'object' && raw.title !== null
      ? { ar: raw.title.ar || raw.title.en || '', en: raw.title.en || raw.title.ar || '' }
      : { ar: String(raw.title || ''), en: String(raw.title || '') };

  let locAr = '';
  let locEn = '';
  if (typeof raw.location === 'object' && raw.location !== null) {
    locAr = raw.location.ar || (typeof raw.location.city === 'object' ? raw.location.city.ar : raw.location.city) || '';
    locEn = raw.location.en || (typeof raw.location.city === 'object' ? raw.location.city.en : raw.location.city) || '';
  } else {
    const city = raw.city || '';
    const district = raw.district || raw.governorate || '';
    locAr = [city, district].filter(Boolean).join(', ') || String(raw.location || '');
    locEn = [city, district].filter(Boolean).join(', ') || String(raw.location || '');
  }

  const rawType = raw.propertyType || raw.type || '';
  const typeMap: Record<string, { ar: string; en: string }> = {
    apartment: { ar: 'شقة', en: 'Apartment' },
    shared_apartment: { ar: 'شقة مشتركة', en: 'Shared Apartment' },
    studio: { ar: 'استوديو', en: 'Studio' },
    room: { ar: 'غرفة', en: 'Room' },
    private_room: { ar: 'غرفة خاصة', en: 'Private Room' },
    dormitory: { ar: 'سكن طلابي', en: 'Dormitory' },
    villa: { ar: 'فيلا', en: 'Villa' },
  };
  const typeKey = String(rawType).toLowerCase();
  const type =
    typeof raw.type === 'object' && raw.type !== null
      ? { ar: raw.type.ar || '', en: raw.type.en || '' }
      : typeMap[typeKey] || { ar: String(rawType || 'سكن طلابي'), en: String(rawType || 'Student Housing') };

  const price = Number(raw.price || raw.startingPrice || 0);
  const currency = String(raw.currency || 'AED');

  const bedrooms = Number(raw.bedrooms || raw.rooms || (Array.isArray(raw.roomsConfig) ? raw.roomsConfig.length : 1) || 1);
  const bathrooms = Number(raw.bathrooms || 1);

  let image = '';
  if (raw.image && typeof raw.image === 'string') {
    image = raw.image;
  } else if (Array.isArray(raw.images) && raw.images.length > 0) {
    const primary = raw.images.find((img: any) => img.isPrimary) || raw.images[0];
    image = typeof primary === 'string' ? primary : primary?.url || '';
  } else if (Array.isArray(raw.roomPhotos) && raw.roomPhotos.length > 0) {
    image = raw.roomPhotos[0];
  } else if (raw.photos && Array.isArray(raw.photos) && raw.photos.length > 0) {
    image = raw.photos[0];
  }
  if (!image || image.startsWith('file://')) {
    image = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&q=80&w=600&h=400&fit=crop';
  }

  return {
    id,
    title,
    location: { ar: locAr || 'غير محدد', en: locEn || 'Unspecified' },
    type,
    price,
    currency,
    bedrooms,
    bathrooms,
    image,
  };
}

export const propertyService = {
  async getProperties(filters?: PropertyFilterParams): Promise<Property[]> {
    const query = new URLSearchParams();

    if (filters) {
      if (filters.search) query.append('search', filters.search);
      if (filters.city) query.append('city', filters.city);
      if (filters.propertyType) query.append('propertyType', filters.propertyType);
      if (filters.minPrice !== undefined && !isNaN(filters.minPrice)) query.append('minPrice', String(filters.minPrice));
      if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) query.append('maxPrice', String(filters.maxPrice));
      if (filters.bedrooms !== undefined && !isNaN(filters.bedrooms)) query.append('bedrooms', String(filters.bedrooms));
      if (filters.propertyClass) query.append('propertyClass', filters.propertyClass);
      if (filters.genderAllowed) query.append('genderAllowed', filters.genderAllowed);
      if (filters.availableOnly !== undefined) query.append('availableOnly', String(filters.availableOnly));
      if (filters.page) query.append('page', String(filters.page));
      if (filters.limit) query.append('limit', String(filters.limit));
    }

    const queryString = query.toString();
    const endpoint = queryString ? `/properties?${queryString}` : '/properties';

    const response = await ApiClient.get<any>(endpoint);

    let rawList: any[] = [];
    if (Array.isArray(response)) {
      rawList = response;
    } else if (response && Array.isArray(response.data)) {
      rawList = response.data;
    } else if (response && Array.isArray(response.properties)) {
      rawList = response.properties;
    }

    return rawList.map(normalizeProperty);
  },

  async getPropertyById(id: string): Promise<Property | null> {
    try {
      const response = await ApiClient.get<any>(`/properties/${id}`);
      const raw = response?.data || response?.property || response;
      if (!raw || (!raw.id && !raw._id && !raw.propertyId)) {
        return null;
      }
      return normalizeProperty(raw);
    } catch {
      return null;
    }
  },
};
