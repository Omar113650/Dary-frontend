export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://dary-gold.vercel.app/api/v1';

export interface RequestOptions extends RequestInit {
  data?: any;
}

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code = 'API_ERROR', status = 500) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

export class ApiClient {
  private static getHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...customHeaders,
    });

    try {
      const token = localStorage.getItem('dary_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    } catch {
      // Ignore localStorage access errors
    }

    return headers;
  }

  static async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { data, headers: customHeaders, ...customOptions } = options;

    const config: RequestInit = {
      ...customOptions,
      headers: this.getHeaders(customHeaders),
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, config);
      const json = await response.json().catch(() => null);

      if (!response.ok) {
        throw new ApiError(
          json?.message || json?.error?.message || response.statusText || 'Request failed',
          json?.code || json?.error?.code || 'HTTP_ERROR',
          response.status
        );
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
}
