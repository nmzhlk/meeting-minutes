import { createContext } from 'react';
import type { User, UserLoginInput, UserRegisterInput } from '../../shared/types';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: UserLoginInput) => Promise<void>;
  register: (data: UserRegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
