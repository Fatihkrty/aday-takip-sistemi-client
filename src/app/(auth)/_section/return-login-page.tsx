import NextLink from 'next/link';
import paths from '@/routes/paths';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ReturnLoginPage() {
  return (
    <Box display="flex" alignItems="center">
      <ArrowBackIcon color="primary" />

      <Link component={NextLink} passHref href={paths.login} underline="hover" sx={{ textDecoration: 'none', ml: 1 }}>
        Giriş Ekranına Dön
      </Link>
    </Box>
  );
}
