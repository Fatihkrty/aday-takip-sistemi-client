import { IUser } from '@/types/IUser';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { useState, SyntheticEvent } from 'react';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useAuthContext } from '@/auth/hooks/useAuthContext';

interface IAccountMenuProps {
  logout: () => void;
  handleClose: () => void;
  user: IUser | null;
}

function AccountMenu({ logout, handleClose, user }: IAccountMenuProps) {
  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <Paper sx={{ width: 240, maxWidth: '100%' }}>
      <Stack sx={{ p: 2 }}>
        <Typography textAlign="center" variant="subtitle1">
          {user?.name}
        </Typography>
        <Typography textAlign="center" color="text.secondary">
          {user?.email}
        </Typography>
      </Stack>
      <Divider sx={{ borderStyle: 'dashed' }} />
      <MenuList>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText>Çıkış</ListItemText>
        </MenuItem>
      </MenuList>
    </Paper>
  );
}

export default function AccountPopover() {
  const { logout, user } = useAuthContext();

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const handleClick = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Avatar
        alt={user?.name}
        src={''}
        sx={{ cursor: 'pointer', width: 40, height: 40, marginLeft: 2 }}
        variant="circular"
        onClick={handleClick}
      >
        {user?.name[0]}
      </Avatar>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <AccountMenu logout={logout} handleClose={handleClose} user={user} />
      </Popover>
    </>
  );
}
