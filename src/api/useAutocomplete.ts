import { IQuery } from '@/types/IQuery';
import axiosInstance from '@/utils/axios';
import API_ENDPOINTS from './API_ENDPOINTS';
import { IPaginate } from '@/types/IPaginate';
import { IAutocomplete } from '@/types/IAutocomplete';

export interface IGetAutocompleteDataProps {
  url: keyof typeof API_ENDPOINTS.autocomplete.search;
  search: string;
}

export async function getAutocompleteDatasApi(
  url: keyof typeof API_ENDPOINTS.autocomplete,
  params: IQuery
): Promise<IPaginate<IAutocomplete>> {
  return axiosInstance.get(API_ENDPOINTS.autocomplete[url] as string, { params });
}

export async function getStringAutocompleteApi({ url, search }: IGetAutocompleteDataProps): Promise<string[]> {
  return axiosInstance.get(API_ENDPOINTS.autocomplete.search[url], { params: { name: search } });
}

export async function getObjectAutocompleteApi({ url, search }: IGetAutocompleteDataProps): Promise<IAutocomplete[]> {
  return axiosInstance.get(API_ENDPOINTS.autocomplete.search[url], { params: { name: search } });
}
