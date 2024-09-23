import { IQuery } from '@/types/IQuery';
import axiosInstance from '@/utils/axios';
import API_ENDPOINTS from './API_ENDPOINTS';
import { IPaginate } from '@/types/IPaginate';
import { ICompany, ICompanyForm } from '@/types/ICompany';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';

export const COMPANY_QUERY_KEY: QueryKey = ['COMPANY_QUERY_KEY'];

export async function getCompaniesApi(params: IQuery): Promise<IPaginate<ICompany>> {
  return axiosInstance.get(API_ENDPOINTS.company.root, { params });
}

async function createCompanyApi(data: ICompanyForm): Promise<ICompany> {
  return axiosInstance.post(API_ENDPOINTS.company.root, data);
}

async function updateCompanyApi(id: number, data: Partial<ICompanyForm>): Promise<ICompany> {
  return axiosInstance.put(API_ENDPOINTS.company.update(id), data);
}

async function createCompanyContractApi(companyId: number, data: FormData): Promise<ICompany> {
  return axiosInstance.post(API_ENDPOINTS.company.contract(companyId), data);
}

async function deleteCompanyContractApi(id: number): Promise<ICompany> {
  return axiosInstance.delete(API_ENDPOINTS.company.deletContract(id));
}

export async function sendRequestFormApi(data: string[]) {
  return axiosInstance.post(API_ENDPOINTS.company.sendReqForm, data);
}

// Hook Functions
export function useCreateCompanyApi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCompanyApi,
    onSuccess(data) {
      queryClient.setQueriesData<IPaginate<ICompany>>({ queryKey: COMPANY_QUERY_KEY }, (oldData) => {
        if (oldData) {
          oldData.totalResults += 1;
          oldData.results = [data, ...oldData.results];
          return oldData;
        }
        return { results: [data], limit: 20, page: 1, totalPages: 1, totalResults: 1 };
      });
    },
  });
}

type UseUpdateCompanyApiProps = { id: number; data: Partial<ICompanyForm> };
export function useUpdateCompanyApi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: UseUpdateCompanyApiProps) => updateCompanyApi(id, data),
    onSuccess(data) {
      queryClient.setQueriesData<IPaginate<ICompany>>({ queryKey: COMPANY_QUERY_KEY }, (oldData) => {
        if (oldData) {
          oldData.results = oldData.results.map((x) => (x.id === data.id ? data : x));
          return oldData;
        }
      });
    },
  });
}

// Company Contract Hook Functions
type UseCreateCompanyContractApiProps = { companyId: number; data: FormData };
export function useCreateCompanyContractApi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ companyId, data }: UseCreateCompanyContractApiProps) => createCompanyContractApi(companyId, data),
    onSuccess(data) {
      queryClient.setQueriesData<IPaginate<ICompany>>({ queryKey: COMPANY_QUERY_KEY }, (oldData) => {
        if (oldData) {
          oldData.results = oldData.results.map((x) => (x.id === data.id ? data : x));
          return oldData;
        }
      });
    },
  });
}

export function useDeleteCompanyContractApi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCompanyContractApi,
    onSuccess(data) {
      queryClient.setQueriesData<IPaginate<ICompany>>({ queryKey: COMPANY_QUERY_KEY }, (oldData) => {
        if (oldData) {
          oldData.results = oldData.results.map((x) => (x.id === data.id ? data : x));
          return oldData;
        }
      });
    },
  });
}
