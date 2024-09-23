import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import ListItem from '@mui/material/ListItem';
import { useState, SyntheticEvent } from 'react';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';
import { alpha } from '@mui/system/colorManipulator';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import HistoryIcon from '@mui/icons-material/History';
import { INotification } from '@/types/INotification';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import { fDateDifferenceAutoText } from '@/utils/format-time';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useNotification, useMarkAsReadNotification } from '@/api/useNotificationApi';

export default function NotificationPopover() {
  const [page, setPage] = useState(0);
  const { data = [], refetch } = useNotification(page);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const { mutateAsync: markAsRead } = useMarkAsReadNotification();
  const notifyCount = getNotifyCount(data);

  const handleClickNotification = (e: SyntheticEvent) => {
    setAnchorEl(e.currentTarget);
  };

  const handleReadNotification = (id: number) => {
    markAsRead(id, {
      onSuccess() {
        refetch();
      },
    });
  };

  return (
    <>
      <IconButton onClick={handleClickNotification}>
        <Badge badgeContent={notifyCount} color="error">
          <NotificationsActiveIcon />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography sx={{ m: 2 }}>Bildirimler</Typography>

        <List disablePadding sx={{ width: 340, height: 340, overflow: 'auto' }}>
          {data?.map((x) => (
            <ListItem
              key={x.id}
              sx={{ mb: 0.2, bgcolor: (theme) => (x.isReaded ? 'inherit' : alpha(theme.palette.warning.light, 0.3)) }}
              secondaryAction={
                !x.isReaded && (
                  <Button
                    size="small"
                    variant="text"
                    color="success"
                    onClick={() => handleReadNotification(x.id)}
                    startIcon={<DoneAllIcon />}
                    sx={{ textTransform: 'none' }}
                  >
                    Okundu
                  </Button>
                )
              }
            >
              <ListItemIcon>
                {x.isReaded ? (
                  <DoneAllIcon sx={{ color: (theme) => theme.palette.success.light, mr: 1 }} />
                ) : (
                  <HistoryIcon sx={{ color: (theme) => theme.palette.warning.light, mr: 1 }} />
                )}
              </ListItemIcon>

              <ListItemText>
                <Typography sx={{ mr: 2 }} variant="body2">
                  {x.message}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {fDateDifferenceAutoText(new Date(), x.createdAt)}
                </Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>

        <Divider />

        <ButtonGroup color="success" fullWidth variant="text">
          <Button
            disabled={page === 0}
            sx={{ textTransform: 'none' }}
            startIcon={<ArrowBackIos />}
            onClick={() => setPage((pre) => pre - 1)}
          >
            Önceki
          </Button>
          <Button
            sx={{ textTransform: 'none' }}
            endIcon={<ArrowForwardIos />}
            onClick={() => setPage((pre) => pre + 1)}
            disabled={data.length === 0 || data.length < 10}
          >
            Sonraki
          </Button>
        </ButtonGroup>
      </Popover>
    </>
  );
}

function getNotifyCount(data: INotification[]) {
  let count = 0;
  if (!data.length) return count;

  for (let i = 0; i < data.length; i++) {
    const notify = data[i];
    if (!notify.isReaded) {
      count++;
    }
  }

  return count;
}
