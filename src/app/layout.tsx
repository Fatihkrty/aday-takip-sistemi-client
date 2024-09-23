import dayjs from 'dayjs';
import ThemeProvider from '@/theme';
import { Nunito } from 'next/font/google';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import SnackbarProvider from '@/components/snackbar';
import QueryClientProvider from '@/components/react-query';
import LocalizationProvider from '@/components/localization';

export const metadata = {
  title: 'Aday Takip Sistemi',
  description: 'Aday Takip Sistemi',
};
const nunito = Nunito({ subsets: ['latin'] });

dayjs.extend(isBetweenPlugin);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={nunito.className}>
        <LocalizationProvider>
          <QueryClientProvider>
            <ThemeProvider>
              <SnackbarProvider>{children}</SnackbarProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
