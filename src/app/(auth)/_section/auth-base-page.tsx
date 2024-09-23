import Image from 'next/image';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';

type Props = {
  children: React.ReactNode;
};

export default function AuthBasePage({ children }: Props) {
  return (
    <Container
      maxWidth="xs"
      sx={{
        height: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Stack sx={{ alignItems: 'center' }}>
        <Image style={{ marginBottom: 8 }} priority alt="logo" width={360} height={320} src="/assets/ats_logo.svg" />

        <Divider sx={{ width: 1, mb: 2 }} />

        {children}
      </Stack>
    </Container>
  );
}
