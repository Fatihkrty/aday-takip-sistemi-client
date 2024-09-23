import axiosInstance from '@/utils/axios';
import API_ENDPOINTS from './API_ENDPOINTS';
import { useQuery } from '@tanstack/react-query';
import { IDashboardInfo } from '@/types/IDashboardInfo';

const DASHBOARD_QUERY_KEY = ['DASHBOARD_QUERY_KEY'];

export async function getDashboardInfoApi(): Promise<IDashboardInfo> {
  return axiosInstance.get(API_ENDPOINTS.dashboard.root);
}

export async function getCompanyStatusInfoApi(): Promise<{ id: number; name: string; requestCount: number }[]> {
  return axiosInstance.get(API_ENDPOINTS.dashboard.companyStatus);
}

export function useDashboardInfoApi() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: getDashboardInfoApi,
  });
}

export function useGetCompanyStatusApi() {
  return useQuery({
    queryKey: ['COMPANY_STATUS_QUERY_KEY'],
    queryFn: getCompanyStatusInfoApi,
  });
}
