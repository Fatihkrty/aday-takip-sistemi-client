import { IQuery } from '@/types/IQuery';
import axiosInstance from '@/utils/axios';
import API_ENDPOINTS from './API_ENDPOINTS';
import { IPaginate } from '@/types/IPaginate';
import { IUser, IUserInputForm } from '@/types/IUser';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';

export const USER_QUERY_KEY: QueryKey = ['USER_QUERY_KEY'];

export async function getUsersAPI(params: IQuery): Promise<IPaginate<IUser>> {
  return axiosInstance.get(API_ENDPOINTS.user.root, { params });
}

async function createUserAPI(data: IUserInputForm): Promise<IUser> {
  return axiosInstance.post(API_ENDPOINTS.user.root, data);
}

async function updateUserAPI(id: number, data: Partial<IUserInputForm>): Promise<IUser> {
  return axiosInstance.put(API_ENDPOINTS.user.update(id), data);
}

async function deleteUserAPI(id: number): Promise<void> {
  return axiosInstance.delete(API_ENDPOINTS.user.delete(id));
}

export function useCreateUserAPI() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IUserInputForm) => createUserAPI(data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}

type UpdateUseUserApiProps = { id: number; data: Partial<IUserInputForm> };
export function useUpdateUserAPI() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: UpdateUseUserApiProps) => updateUserAPI(id, data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}

export function useDeleteUserAPI() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteUserAPI(id),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}
