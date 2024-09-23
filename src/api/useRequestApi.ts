import { IQuery } from '@/types/IQuery';
import axiosInstance from '@/utils/axios';
import API_ENDPOINTS from './API_ENDPOINTS';
import { IRequest } from '@/types/IRequest';
import { IPaginate } from '@/types/IPaginate';
import { RequestStatus } from '@/constants/request-status';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const ALL_REQUEST_QUERY_KEY = ['ALL_REQUEST_QUERY_KEY'];
export const MY_REQUEST_QUERY_KEY = ['MY_REQUEST_QUERY_KEY'];
export const WAITING_REQUEST_QUERY_KEY = ['WAITING_REQUEST_QUERY_KEY'];

export async function getRequestsApi(params: IQuery): Promise<IPaginate<IRequest>> {
  return axiosInstance.get(API_ENDPOINTS.request.root, { params });
}

export async function getRequestApi(id: number | string): Promise<IRequest> {
  return axiosInstance.get(API_ENDPOINTS.request.id(id));
}

export async function createRequestApi(data: any): Promise<void> {
  return axiosInstance.post(API_ENDPOINTS.request.root, data);
}

export async function updateRequestApi(id: number, data: any): Promise<void> {
  return axiosInstance.put(API_ENDPOINTS.request.update(id), data);
}

export async function changeRequestStatusApi(id: number, status: RequestStatus): Promise<void> {
  return axiosInstance.put(API_ENDPOINTS.request.changeStatus(id), { status });
}

export async function allowRequestApi(id: number): Promise<void> {
  return axiosInstance.get(API_ENDPOINTS.request.allow(id));
}

export function useGetRequestApi(id: number | string) {
  return useQuery({
    queryKey: ['GET_ONE_REQUEST_QUERY_KEY', id],
    queryFn: () => getRequestApi(id),
    gcTime: 0,
    staleTime: 0,
  });
}

export function useCreateRequestApi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRequestApi,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ALL_REQUEST_QUERY_KEY });
    },
  });
}

export function useUpdateRequestApi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateRequestApi(id, data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ALL_REQUEST_QUERY_KEY });
    },
  });
}

export function useChangeRequestStatusApi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: RequestStatus }) => changeRequestStatusApi(id, status),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ALL_REQUEST_QUERY_KEY });
    },
  });
}

export function useAllowRequestApi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: allowRequestApi,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ALL_REQUEST_QUERY_KEY });
    },
  });
}
