import { useState, useEffect, type ReactNode } from 'react';
import type { User, UserLoginInput, UserRegisterInput } from '../../shared/types';
import { authApi, tokenStorage, httpClient } from '../../shared/api';
import { AuthContext } from './context';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      if (!tokenStorage.hasTokens()) {
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const currentUser = await authApi.getMe();
        if (isMounted) {
          setUser(currentUser);
        }
      } catch {
        if (isMounted) {
          setUser(null);
          tokenStorage.clearTokens();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    const unsubscribe = httpClient.onUnauthorized(() => {
      if (isMounted) {
        setUser(null);
        tokenStorage.clearTokens();
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const login = async (credentials: UserLoginInput) => {
    const response = await authApi.login(credentials);
    tokenStorage.setTokens(response.access_token, response.refresh_token);
    setUser(response.user);
  };

  const register = async (data: UserRegisterInput) => {
    const response = await authApi.register(data);
    tokenStorage.setTokens(response.access_token, response.refresh_token);
    setUser(response.user);
  };

  const logout = async () => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch (e) {
        console.warn('Failed to invalidate refresh token on logout', e);
      }
    }
    tokenStorage.clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
