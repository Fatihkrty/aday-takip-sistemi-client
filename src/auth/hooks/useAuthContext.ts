'use client';

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('AuthContext context must be use inside AuthProvider');
  }

  return context;
};
