import { ReactNode } from 'react';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem';

interface Props extends MenuItemProps {
  icon: ReactNode;
  label: string;
  color?: any;
}

export function RowActionItem({ icon, label, color, ...props }: Props) {
  return (
    <MenuItem {...props}>
      <ListItemIcon sx={{ color }}>{icon}</ListItemIcon>
      <ListItemText sx={{ color }}>{label}</ListItemText>
    </MenuItem>
  );
}
