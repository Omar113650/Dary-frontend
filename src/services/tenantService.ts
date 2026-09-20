import { ApiClient } from './apiClient';

export interface RentalBooking {
  id: string;
  status: 'PENDING' | 'CONTACTED' | 'CLOSED' | 'CANCELLED' | string;
  bedsRequested?: number;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
  contactedAt?: string | null;
  note?: string | null;
  property?: {
    id: string;
    title?: string;
    address?: string;
    city?: string;
    price?: number;
    currency?: string;
    images?: Array<{ url?: string; isPrimary?: boolean } | string>;
    primaryImage?: string;
    [key: string]: any;
  };
  room?: {
    id: string;
    roomType?: string;
    roomNumber?: string;
    price?: number;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface FavoriteItem {
  id?: string;
  userId?: string;
  propertyId?: string;
  createdAt?: string;
  property?: any;
  [key: string]: any;
}

export interface RecentlyViewedItem {
  id?: string;
  userId?: string;
  propertyId?: string;
  viewedAt?: string;
  createdAt?: string;
  property?: any;
  [key: string]: any;
}

export interface SavedSearchItem {
  id: string;
  name?: string;
  city?: string;
  governorate?: string;
  propertyType?: string;
  propertyClass?: string;
  targetTenantType?: string;
  genderAllowed?: string;
  minPrice?: number;
  maxPrice?: number;
  rooms?: number;
  createdAt?: string;
  [key: string]: any;
}

export interface NotificationItem {
  id: string;
  title?: string;
  message?: string;
  body?: string;
  content?: string;
  isRead?: boolean;
  read?: boolean;
  channel?: string;
  event?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface SupportTicketItem {
  id: string;
  category?: string;
  subject?: string;
  description?: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'ARCHIVED' | 'CLOSED' | string;
  createdAt?: string;
  updatedAt?: string;
  messages?: any[];
  [key: string]: any;
}

export interface TicketMessageItem {
  id: string;
  ticketId?: string;
  senderId?: string;
  senderRole?: string;
  senderName?: string;
  message?: string;
  content?: string;
  createdAt?: string;
  attachments?: any[];
  [key: string]: any;
}

export class TenantService {
  // ==========================================
  // RENTALS (STRICTLY GET /dashboard/rentals)
  // ==========================================
  /**
   * Fetches tenant rentals. Strictly uses GET /dashboard/rentals.
   * No fallback to other endpoints.
   */
  static async getRentals(): Promise<RentalBooking[]> {
    const res = await ApiClient.get<any>('/dashboard/rentals');
    const data = res?.data?.rentals || res?.data?.bookings || res?.data || res?.rentals || res;
    return Array.isArray(data) ? data : [];
  }

  /**
   * Cancels a tenant booking with a mandatory note.
   */
  static async cancelBooking(bookingId: string, note: string): Promise<any> {
    return ApiClient.patch(`/booking/${bookingId}/cancel`, { note });
  }

  // ==========================================
  // FAVORITES
  // ==========================================
  static async getFavorites(): Promise<FavoriteItem[]> {
    const res = await ApiClient.get<any>('/favorites');
    const data = res?.data?.favorites || res?.data || res?.favorites || res;
    return Array.isArray(data) ? data : [];
  }

  static async addFavorite(propertyId: string): Promise<any> {
    return ApiClient.post('/favorites', { propertyId });
  }

  static async removeFavorite(propertyId: string): Promise<any> {
    return ApiClient.delete(`/favorites/${propertyId}`);
  }

  // ==========================================
  // RECENTLY VIEWED
  // ==========================================
  static async getRecentlyViewed(): Promise<RecentlyViewedItem[]> {
    const res = await ApiClient.get<any>('/dashboard/recently-viewed');
    const data = res?.data?.recentlyViewed || res?.data || res?.recentlyViewed || res;
    return Array.isArray(data) ? data : [];
  }

  static async removeRecentlyViewed(propertyId: string): Promise<any> {
    return ApiClient.delete(`/recently-viewed/${propertyId}`);
  }

  /**
   * Records that the authenticated user viewed a property.
   * POST /recently-viewed with { propertyId }
   */
  static async recordRecentlyViewed(propertyId: string): Promise<any> {
    return ApiClient.post('/recently-viewed', { propertyId });
  }

  static async clearRecentlyViewed(): Promise<any> {
    return ApiClient.delete('/dashboard/recently-viewed');
  }

  // ==========================================
  // BOOKING REQUEST
  // ==========================================
  /**
   * Creates a new booking/contact request for a property.
   * POST /booking with { propertyId }
   */
  static async createBooking(propertyId: string, payload?: Record<string, any>): Promise<any> {
    return ApiClient.post('/booking', { propertyId, ...payload });
  }

  // ==========================================
  // SAVED SEARCHES
  // ==========================================
  static async getSavedSearches(): Promise<SavedSearchItem[]> {
    const res = await ApiClient.get<any>('/saved-searches');
    const data = res?.data?.savedSearches || res?.data || res?.savedSearches || res;
    return Array.isArray(data) ? data : [];
  }

  static async deleteSavedSearch(id: string): Promise<any> {
    return ApiClient.delete(`/saved-searches/${id}`);
  }

  // ==========================================
  // NOTIFICATIONS
  // ==========================================
  static async getNotifications(page = 1, limit = 20): Promise<{ items: NotificationItem[]; total?: number }> {
    const res = await ApiClient.get<any>(`/notifications?page=${page}&limit=${limit}`);
    const data = res?.data?.notifications || res?.data?.items || res?.data || res;
    const items = Array.isArray(data) ? data : (data?.notifications || []);
    return {
      items,
      total: res?.data?.total || items.length,
    };
  }

  static async markNotificationAsRead(id: string): Promise<any> {
    return ApiClient.patch(`/notifications/${id}/read`);
  }

  static async markAllNotificationsAsRead(): Promise<any> {
    return ApiClient.patch('/notifications/read-all');
  }

  // ==========================================
  // SUPPORT TICKETS
  // ==========================================
  static async getMyTickets(): Promise<SupportTicketItem[]> {
    const res = await ApiClient.get<any>('/support-ticket/my');
    const data = res?.data?.tickets || res?.data || res?.tickets || res;
    return Array.isArray(data) ? data : [];
  }

  static async createTicket(payload: { category: string; subject: string; description: string }): Promise<any> {
    return ApiClient.post('/support-ticket', payload);
  }

  /**
   * Confirmed endpoint: GET /support-ticket/{id}/messages
   */
  static async getTicketMessages(ticketId: string): Promise<TicketMessageItem[]> {
    const res = await ApiClient.get<any>(`/support-ticket/${ticketId}/messages`);
    const data = res?.data?.messages || res?.data || res;
    return Array.isArray(data) ? data : [];
  }

  /**
   * NOTE: Sending messages (POST /support-ticket/:id/messages) is currently isolated/disabled
   * as the exact request body contract is not yet confirmed by the backend team.
   */
  static async sendTicketMessage(_ticketId: string, _payload: any): Promise<never> {
    throw new Error('Support ticket message submission is pending backend contract confirmation.');
  }
}
