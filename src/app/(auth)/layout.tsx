import GuestLayout from '@/layouts/guest';
import { AuthProvider } from '@/auth/context/AuthProvider';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthProvider>
      <GuestLayout>{children}</GuestLayout>
    </AuthProvider>
  );
}
