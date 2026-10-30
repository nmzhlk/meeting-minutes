import { tokenStorage } from './tokenStorage';
import type { TokenRefreshResponse } from '../types/auth';

const API_BASE_URL = '/api';

export interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
  _retry?: boolean;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
const unauthorizedListeners: Set<() => void> = new Set();

const notifyUnauthorized = () => {
  unauthorizedListeners.forEach((listener) => listener());
};

const executeRefreshToken = async (): Promise<string | null> => {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    tokenStorage.clearTokens();
    notifyUnauthorized();
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      tokenStorage.clearTokens();
      notifyUnauthorized();
      return null;
    }

    const data: TokenRefreshResponse = await response.json();
    tokenStorage.setAccessToken(data.access_token);
    return data.access_token;
  } catch {
    tokenStorage.clearTokens();
    notifyUnauthorized();
    return null;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
};

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuth = false, _retry = false, headers: customHeaders, ...restOptions } = options;
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((customHeaders as Record<string, string>) || {}),
  };

  if (!skipAuth) {
    const accessToken = tokenStorage.getAccessToken();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
  }

  const response = await fetch(url, {
    ...restOptions,
    headers,
  });

  if (response.status === 401 && !skipAuth && !_retry && !endpoint.includes('/auth/')) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = executeRefreshToken();
    }

    const newAccessToken = await refreshPromise;
    if (newAccessToken) {
      return request<T>(endpoint, {
        ...options,
        _retry: true,
      });
    }
  }

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    let errorData: unknown = null;
    try {
      errorData = await response.json();
      if (errorData && typeof errorData === 'object' && 'detail' in errorData) {
        const detail = (errorData as { detail: unknown }).detail;
        if (typeof detail === 'string') {
          errorMessage = detail;
        } else if (Array.isArray(detail)) {
          errorMessage = detail
            .map((item) => {
              if (item && typeof item === 'object' && 'msg' in item) {
                const loc = Array.isArray(item.loc)
                  ? item.loc.filter((part: unknown) => part !== 'body').join('.')
                  : '';
                return loc ? `${loc}: ${item.msg}` : String(item.msg);
              }
              return JSON.stringify(item);
            })
            .join('; ');
        } else {
          errorMessage = JSON.stringify(detail);
        }
      }
    } catch {
    }
    throw new ApiError(response.status, errorMessage, errorData);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

export const httpClient = {
  onUnauthorized(listener: () => void): () => void {
    unauthorizedListeners.add(listener);
    return () => {
      unauthorizedListeners.delete(listener);
    };
  },

  request,

  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};
