import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { fDate } from '@/utils/format-time';
import Typography from '@mui/material/Typography';
import { deepOrange } from '@mui/material/colors';
import { useAuthContext } from '@/auth/hooks/useAuthContext';

export default function Account() {
  const { user } = useAuthContext();

  if (!user) {
    return null;
  }

  return (
    <Box
      sx={{
        p: 1,
        display: 'flex',
        bgcolor: 'white',
        alignItems: 'center',
      }}
    >
      <Box sx={{ mr: 2 }}>
        <Avatar sx={{ width: 56, height: 56, bgcolor: deepOrange[500] }} src={''}>
          {user.name[0]}
        </Avatar>

        <Typography variant="body2" textAlign="center" noWrap sx={{ color: 'text.secondary' }}>
          {user.role}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" fontSize="18px">
          {user.name}
        </Typography>
        <Box sx={{ my: 0.7 }} />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Kayıt Tarihi
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {fDate(user.createdAt)}
        </Typography>
      </Box>
    </Box>
  );
}
