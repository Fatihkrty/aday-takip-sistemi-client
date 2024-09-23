import List from '@mui/material/List';
import { alpha } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useRouter, usePathname } from 'next/navigation';
import ListItemButton from '@mui/material/ListItemButton';
import { useAuthContext } from '@/auth/hooks/useAuthContext';
import { DRAWER_MENU, ISidePanelMenuItem } from '@/layouts/config';

type NavItemProps = {
  menuItem: ISidePanelMenuItem;
};

function NavItem({ menuItem }: NavItemProps) {
  const { push } = useRouter();
  const pathname = usePathname();
  const isActive = pathname === menuItem.path;

  return (
    <ListItem disablePadding>
      <ListItemButton
        sx={(theme) => ({
          ':hover': {
            bgcolor: isActive ? alpha(theme.palette.success.light, 0.8) : theme.palette.action.disabledBackground,
          },
          color: isActive ? 'white' : 'black',
          background: (theme) => (isActive ? theme.palette.success.light : 'white'),
          borderRadius: 2,
        })}
        onClick={() => push(menuItem.path)}
      >
        <ListItemIcon sx={{ color: isActive ? 'white' : 'text.secondary' }}>{menuItem.icon}</ListItemIcon>
        <ListItemText primary={<Typography fontWeight={isActive ? 'bold' : 'inherit'}>{menuItem.name}</Typography>} />
      </ListItemButton>
    </ListItem>
  );
}

function Subheader({ label }: { label: string }) {
  return (
    <Typography
      sx={(theme) => ({
        ...theme.typography.overline,
        ml: 1,
        fontSize: 12,
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(1),
        color: theme.palette.text.secondary,
      })}
    >
      {label}
    </Typography>
  );
}

export default function NavList() {
  const { user } = useAuthContext();

  return (
    <List sx={{ p: 1 }}>
      {DRAWER_MENU.map((value, index) => (
        <div key={index}>
          {value.subheader && <Subheader label={value.subheader} />}

          {value.items.map((item) => {
            if (item.role && item.role !== user?.role) {
              return null;
            }
            return <NavItem key={item.path} menuItem={item} />;
          })}
        </div>
      ))}
    </List>
  );
}
