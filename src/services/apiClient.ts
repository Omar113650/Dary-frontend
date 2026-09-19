export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://dary-gold.vercel.app/api/v1';

export interface RequestOptions extends RequestInit {
  data?: any;
  _retry?: boolean;
}

export class ApiError extends Error {
  code: string;
  status: number;
  data?: any;

  constructor(message: string, code = 'API_ERROR', status = 500, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.data = data;
  }
}

// Track whether a refresh is currently pending to prevent multiple refresh calls
let isRefreshing = false;
let refreshSubscribers: ((success: boolean) => void)[] = [];

function subscribeTokenRefresh(cb: (success: boolean) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(success: boolean) {
  refreshSubscribers.forEach((cb) => cb(success));
  refreshSubscribers = [];
}

export class ApiClient {
  private static async performTokenRefresh(): Promise<boolean> {
    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((success) => resolve(success));
      });
    }

    isRefreshing = true;

    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const refreshOk = refreshResponse.ok;
      onRefreshed(refreshOk);
      return refreshOk;
    } catch (err) {
      console.error('[ApiClient] Token refresh network failure:', err);
      onRefreshed(false);
      return false;
    } finally {
      isRefreshing = false;
    }
  }

  static async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { data, headers: customHeaders, _retry = false, ...customOptions } = options;

    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const headers = new Headers(customHeaders);

    if (!isFormData && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const config: RequestInit = {
      ...customOptions,
      credentials: 'include',
      headers,
    };

    if (data !== undefined) {
      if (isFormData) {
        config.body = data;
      } else if (typeof data === 'string') {
        config.body = data;
      } else {
        config.body = JSON.stringify(data);
      }
    }

    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, config);
      const json = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          json?.message ||
          json?.error?.message ||
          response.statusText ||
          'Request failed';
        const code = json?.code || json?.error?.code || 'HTTP_ERROR';

        // Single retry on specific 401 message containing 'refresh' or 'expired'
        const isTokenExpired =
          response.status === 401 &&
          typeof message === 'string' &&
          message.toLowerCase().includes('refresh');

        if (isTokenExpired && !_retry) {
          const refreshSuccess = await this.performTokenRefresh();
          if (refreshSuccess) {
            return this.request<T>(endpoint, { ...options, _retry: true });
          }
        }

        throw new ApiError(message, code, response.status, json);
      }

      return json as T;
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error?.message || 'Network error occurred. Please check your connection.',
        'NETWORK_ERROR',
        0
      );
    }
  }

  static get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  static post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', data });
  }

  static put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', data });
  }

  static patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', data });
  }

  static delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}
