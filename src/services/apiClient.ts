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

export class ApiClient {
  static async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { data, headers: customHeaders, _retry = false, ...customOptions } = options;

    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const headers = new Headers(customHeaders);

    if (!isFormData && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    // Attach Bearer token from storage if available
    if (typeof window !== 'undefined' && !headers.has('Authorization')) {
      const storedToken =
        localStorage.getItem('accessToken') ||
        localStorage.getItem('token') ||
        sessionStorage.getItem('accessToken') ||
        sessionStorage.getItem('token');
      if (storedToken) {
        headers.set('Authorization', `Bearer ${storedToken}`);
      }
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

    let cleanEndpoint = endpoint.trim();
    let url: string;
    if (cleanEndpoint.startsWith('http://') || cleanEndpoint.startsWith('https://')) {
      url = cleanEndpoint;
    } else {
      const normalizedBase = API_BASE_URL.replace(/\/+$/, '');
      if (normalizedBase.endsWith('/api/v1') && cleanEndpoint.startsWith('/api/v1/')) {
        cleanEndpoint = cleanEndpoint.substring('/api/v1'.length);
      } else if (normalizedBase.endsWith('/api/v1') && cleanEndpoint === '/api/v1') {
        cleanEndpoint = '';
      }
      if (!cleanEndpoint.startsWith('/') && cleanEndpoint.length > 0) {
        cleanEndpoint = `/${cleanEndpoint}`;
      }
      url = `${normalizedBase}${cleanEndpoint}`;
    }

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

        // Auto-refresh token on 401 Unauthorized if not retried
        const isAuthEndpoint =
          endpoint.includes('/auth/login') ||
          endpoint.includes('/auth/register') ||
          endpoint.includes('/auth/refresh-token');

        if (response.status === 401 && !isAuthEndpoint && !_retry) {
          try {
            const refreshHeaders = new Headers();
            refreshHeaders.set('Content-Type', 'application/json');
            if (typeof window !== 'undefined') {
              const currentToken =
                localStorage.getItem('accessToken') || localStorage.getItem('token');
              if (currentToken) {
                refreshHeaders.set('Authorization', `Bearer ${currentToken}`);
              }
            }

            const refreshBase = url.startsWith('http')
              ? `${new URL(url).origin}/api/v1`
              : API_BASE_URL.replace(/\/+$/, '');

            const refreshRes = await fetch(`${refreshBase}/auth/refresh-token`, {
              method: 'POST',
              credentials: 'include',
              headers: refreshHeaders,
            });
            if (refreshRes.ok) {
              const refreshJson = await refreshRes.json().catch(() => null);
              const refreshedToken =
                refreshJson?.accessToken ||
                refreshJson?.token ||
                refreshJson?.data?.accessToken ||
                refreshJson?.data?.token;
              if (refreshedToken && typeof window !== 'undefined') {
                localStorage.setItem('accessToken', refreshedToken);
                localStorage.setItem('token', refreshedToken);
              }
              return this.request<T>(endpoint, { ...options, _retry: true });
            }
          } catch {}
        }

        throw new ApiError(message, code, response.status, json);
      }

      // Automatically store token if returned in successful response body
      if (json && typeof json === 'object') {
        const receivedToken =
          (json as any).accessToken ||
          (json as any).token ||
          (json as any).data?.accessToken ||
          (json as any).data?.token ||
          (json as any).data?.tokens?.accessToken ||
          (json as any).tokens?.accessToken;
        if (receivedToken && typeof window !== 'undefined') {
          localStorage.setItem('accessToken', receivedToken);
          localStorage.setItem('token', receivedToken);
        }
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
