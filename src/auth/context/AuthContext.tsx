'use client';

import { createContext } from 'react';
import { IUser } from '@/types/IUser';
import { ILoginForm } from '@/types/ILoginForm';

interface IAuthContext {
  loading: boolean;
  authenticated: boolean;
  user: IUser | null;
  login: (data: ILoginForm) => Promise<void>;
  logout: () => void;
  clearSession: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext({} as IAuthContext);
