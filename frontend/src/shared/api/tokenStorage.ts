const ACCESS_TOKEN_KEY = 'meeting_minutes_access_token';
const REFRESH_TOKEN_KEY = 'meeting_minutes_refresh_token';

export const tokenStorage = {
  getAccessToken(): string | null {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setTokens(accessToken: string, refreshToken: string): void {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch (e) {
      console.error('Failed to save tokens to localStorage', e);
    }
  },

  setAccessToken(accessToken: string): void {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    } catch (e) {
      console.error('Failed to save access token to localStorage', e);
    }
  },

  clearTokens(): void {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (e) {
      console.error('Failed to clear tokens from localStorage', e);
    }
  },

  hasTokens(): boolean {
    return Boolean(this.getAccessToken() || this.getRefreshToken());
  },
};
