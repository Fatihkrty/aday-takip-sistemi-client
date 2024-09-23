import { IQuery } from '@/types/IQuery';
import axiosInstance from '@/utils/axios';
import API_ENDPOINTS from './API_ENDPOINTS';
import { IPaginate } from '@/types/IPaginate';
import { ICandidate, ISearchCandidateResponse } from '@/types/ICandidate';
import { QueryKey, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const CANDIDATE_QUERY_KEY: QueryKey = ['CANDIDATE_QUERY_KEY'];

export async function searchCandidateApi(name: string): Promise<ISearchCandidateResponse[]> {
  return axiosInstance.get(API_ENDPOINTS.candidate.search, { params: { name } });
}

export async function getCandidateApi(id: number | string): Promise<ICandidate> {
  return axiosInstance.get(API_ENDPOINTS.candidate.id(id));
}

export async function getCandidatesApi(params: IQuery): Promise<IPaginate<ICandidate>> {
  return axiosInstance.get(API_ENDPOINTS.candidate.root, { params });
}

async function createCandidateApi(data: any): Promise<void> {
  return axiosInstance.post(API_ENDPOINTS.candidate.root, data);
}

async function updateCandidateApi(id: number, data: any): Promise<void> {
  return axiosInstance.put(API_ENDPOINTS.candidate.update(id), data);
}

async function createCandidateCvApi(id: number, data: FormData): Promise<ICandidate> {
  return axiosInstance.post(API_ENDPOINTS.candidate.cv(id), data);
}

async function deleteCandidateCvApi(id: number): Promise<ICandidate> {
  return axiosInstance.delete(API_ENDPOINTS.candidate.deleteCv(id));
}

export function useGetCandidateApi(id: number | string) {
  return useQuery({
    queryKey: ['ONE_CANDIDATE_QUERY_KEY', id],
    queryFn: () => getCandidateApi(id),
    staleTime: 0,
    gcTime: 0,
  });
}

export function useCreateCandidateApi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCandidateApi,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: CANDIDATE_QUERY_KEY });
    },
  });
}

export function useUpdateCandidateApi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateCandidateApi(id, data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: CANDIDATE_QUERY_KEY });
    },
  });
}

export function useCreateCandidateCvApi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => createCandidateCvApi(id, data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: CANDIDATE_QUERY_KEY });
    },
  });
}

export function useDeleteCandidateCv() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCandidateCvApi,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: CANDIDATE_QUERY_KEY });
    },
  });
}
