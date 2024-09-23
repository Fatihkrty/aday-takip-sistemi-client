import DashboardLayout from '@/layouts/dashboard';
import { AuthProvider } from '@/auth/context/AuthProvider';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthProvider>
      <DashboardLayout>{children}</DashboardLayout>;
    </AuthProvider>
  );
}
