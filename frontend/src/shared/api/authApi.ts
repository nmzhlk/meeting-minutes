import { httpClient } from './httpClient';
import type {
  TokenRefreshResponse,
  TokenResponse,
  User,
  UserLoginInput,
  UserRegisterInput,
} from '../types';

export const authApi = {
  login(credentials: UserLoginInput): Promise<TokenResponse> {
    return httpClient.post<TokenResponse>('/auth/login', credentials, { skipAuth: true });
  },

  register(data: UserRegisterInput): Promise<TokenResponse> {
    return httpClient.post<TokenResponse>('/auth/register', data, { skipAuth: true });
  },

  refreshToken(refreshToken: string): Promise<TokenRefreshResponse> {
    return httpClient.post<TokenRefreshResponse>(
      '/auth/refresh',
      { refresh_token: refreshToken },
      { skipAuth: true }
    );
  },

  logout(refreshToken: string): Promise<void> {
    return httpClient.post<void>(
      '/auth/logout',
      { refresh_token: refreshToken },
      { skipAuth: true }
    );
  },

  getMe(): Promise<User> {
    return httpClient.get<User>('/auth/me');
  },
};
