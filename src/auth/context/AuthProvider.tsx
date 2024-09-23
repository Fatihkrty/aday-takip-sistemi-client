'use client';

import { IUser } from '@/types/IUser';
import { AuthContext } from './AuthContext';
import { ILoginForm } from '@/types/ILoginForm';
import { getMeAPI, loginAPI, logoutAPI } from '@/api/authApi';
import SplashScreen from '@/components/loading/splash-screen';
import { useMemo, ReactNode, useEffect, useReducer, useCallback } from 'react';

interface Payload {
  loading: boolean;
  authenticated: boolean;
  user: IUser | null;
}

const initialState: Payload = {
  user: null,
  loading: true,
  authenticated: false,
};

const reducer = (_: Payload, payload: Payload): Payload => payload;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const clearSession = () => {
    dispatch({
      user: null,
      loading: false,
      authenticated: false,
    });
  };

  const setSession = (user: IUser) => {
    dispatch({
      user,
      loading: false,
      authenticated: true,
    });
  };

  const initialize = useCallback(async function () {
    try {
      const user = await getMeAPI();
      setSession(user);
    } catch (err) {
      clearSession();
    }
  }, []);

  const login = useCallback(async (data: ILoginForm) => {
    try {
      const user = await loginAPI(data);
      setSession(user);
    } catch (error) {
      clearSession();
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutAPI();
      clearSession();
    } catch (error) {
      throw error;
    }
  }, []);

  const memoized = useMemo(
    () => ({
      ...state,
      login,
      logout,
      refreshUser: initialize,
      clearSession,
    }),
    [login, logout, initialize, state]
  );

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <AuthContext.Provider value={memoized}>
      <AuthContext.Consumer>{(auth) => (auth.loading ? <SplashScreen /> : children)}</AuthContext.Consumer>
    </AuthContext.Provider>
  );
}
