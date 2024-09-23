import { IQuery } from '@/types/IQuery';
import axiosInstance from '@/utils/axios';
import API_ENDPOINTS from './API_ENDPOINTS';
import { IPaginate } from '@/types/IPaginate';
import { IExternalRequest, IExternalRequestForm } from '@/types/IExternalRequest';

export const EXTERNAL_REQUEST_QUERY_KEY = ['EXTERNAL_REQUEST_QUERY_KEY'];

export async function getExternalRequestsApi(params: IQuery): Promise<IPaginate<IExternalRequest>> {
  return axiosInstance.get(API_ENDPOINTS.externalRequest.root, { params });
}

export async function getExternalRequestWithCode(code: string): Promise<void> {
  return axiosInstance.get(API_ENDPOINTS.externalRequest.code(code));
}

export async function createExternalRequestApi(code: string, data: IExternalRequestForm): Promise<void> {
  return axiosInstance.post(API_ENDPOINTS.externalRequest.code(code), data);
}
