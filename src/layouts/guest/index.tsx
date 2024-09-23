'use client';

import paths from '@/routes/paths';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useAuthContext } from '@/auth/hooks/useAuthContext';

interface Props {
  children: ReactNode;
}
export default function GuestLayout({ children }: Props) {
  const { authenticated } = useAuthContext();
  const { replace } = useRouter();

  useEffect(() => {
    if (authenticated) replace(paths.home);
  }, [authenticated, replace]);

  return children;
}
