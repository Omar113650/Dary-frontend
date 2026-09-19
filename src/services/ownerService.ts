import { ApiClient } from './apiClient';

export interface OwnerPropertyStatusItem {
  status: string;
  count: number;
  [key: string]: any;
}

export interface OwnerBookingStatusItem {
  status: string;
  count: number;
  [key: string]: any;
}

export interface OwnerRevenueSummary {
  totalRevenue?: number;
  currency?: string;
  monthlyRevenue?: Array<{
    month?: string | number;
    year?: number;
    revenue?: number;
    [key: string]: any;
  }>;
  bookingsCount?: number;
  [key: string]: any;
}

export interface OwnerCalendarEvent {
  id?: string;
  bookingId?: string;
  propertyId?: string;
  propertyTitle?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  tenantName?: string;
  [key: string]: any;
}

export interface OwnerPropertyItem {
  id: string;
  title: string;
  description?: string;
  address?: string;
  city?: string;
  governorate?: string;
  propertyType?: string;
  propertyClass?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'ARCHIVED' | string;
  isAvailable?: boolean;
  price?: number;
  currency?: string;
  rooms?: any[];
  images?: Array<{ url?: string; isPrimary?: boolean } | string>;
  primaryImage?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface OwnerPropertyBookingItem {
  id: string;
  propertyId: string;
  roomId?: string;
  status: 'PENDING' | 'CONTACTED' | 'CLOSED' | 'CANCELLED' | string;
  bedsRequested?: number;
  startDate?: string;
  endDate?: string;
  tenant?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  createdAt?: string;
  [key: string]: any;
}

export class OwnerService {
  /**
   * 1. GET /dashboard/owner/properties/status
   * Returns property status counts for the owner
   */
  static async getPropertiesStatus(): Promise<any> {
    const res = await ApiClient.get<any>('/dashboard/owner/properties/status');
    return res?.data || res;
  }

  /**
   * 2. GET /dashboard/owner/bookings/status
   * Returns booking status counts for the owner
   */
  static async getBookingsStatus(): Promise<any> {
    const res = await ApiClient.get<any>('/dashboard/owner/bookings/status');
    return res?.data || res;
  }

  /**
   * 3. GET /dashboard/owner/bookings/revenue
   * Returns booking revenue metrics for the owner
   */
  static async getRevenue(): Promise<any> {
    const res = await ApiClient.get<any>('/dashboard/owner/bookings/revenue');
    return res?.data || res;
  }

  /**
   * 4. GET /dashboard/owner/calendar/summary
   * Returns owner calendar summary
   */
  static async getCalendarSummary(): Promise<any> {
    const res = await ApiClient.get<any>('/dashboard/owner/calendar/summary');
    return res?.data || res;
  }

  /**
   * 5. GET /properties/my
   * Confirmed owner-specific property listing endpoint
   */
  static async getMyProperties(): Promise<OwnerPropertyItem[]> {
    const res = await ApiClient.get<any>('/properties/my');
    const data = res?.data?.properties || res?.data?.items || res?.data || res?.properties || res;
    return Array.isArray(data) ? data : [];
  }

  /**
   * 6. GET /booking/property/:propertyId
   * Confirmed endpoint: Owner bookings against one of their properties
   */
  static async getPropertyBookings(propertyId: string): Promise<OwnerPropertyBookingItem[]> {
    const res = await ApiClient.get<any>(`/booking/property/${propertyId}`);
    const data = res?.data?.bookings || res?.data || res?.bookings || res;
    return Array.isArray(data) ? data : [];
  }
}
