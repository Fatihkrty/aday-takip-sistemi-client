import axiosInstance from '@/utils/axios';
import API_ENDPOINTS from './API_ENDPOINTS';
import { INotification } from '@/types/INotification';
import { QueryKey, useQuery, useMutation } from '@tanstack/react-query';

const NOTIFICATION_QUERY_KEY: QueryKey = ['NOTIFICATION_QUERY_KEY'];

async function getNotificationsAPI(page: number): Promise<INotification[]> {
  return axiosInstance.get(API_ENDPOINTS.notification.base, { params: { page, limit: 10 } });
}

async function markAsReadNotificationAPI(id: number): Promise<void> {
  return axiosInstance.get(API_ENDPOINTS.notification.markAsRead(id));
}

export function useNotification(page: number) {
  return useQuery({
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    queryKey: [NOTIFICATION_QUERY_KEY, page],
    queryFn: () => getNotificationsAPI(page),
  });
}

export function useMarkAsReadNotification() {
  return useMutation({
    mutationFn: (id: number) => markAsReadNotificationAPI(id),
  });
}
