import { IQuery } from '@/types/IQuery';
import axiosInstance from '@/utils/axios';
import API_ENDPOINTS from './API_ENDPOINTS';
import { IPaginate } from '@/types/IPaginate';
import { useMutation } from '@tanstack/react-query';
import { IReferral, IReferralForm } from '@/types/IReferral';

export const REFERRAL_QUERY_KEY = ['REFERRAL_QUERY_KEY'];

export async function getReferralsApi(params: IQuery): Promise<IPaginate<IReferral>> {
  return axiosInstance.get(API_ENDPOINTS.referral.root, { params });
}

export async function upsertReferralApi(data: IReferralForm): Promise<void> {
  return axiosInstance.post(API_ENDPOINTS.referral.root, data);
}

export function deleteReferralApi(id: number): Promise<void> {
  return axiosInstance.delete(API_ENDPOINTS.referral.delete(id));
}

export function useUpsertReferralApi() {
  return useMutation({
    mutationFn: upsertReferralApi,
  });
}

export function useDeleteReferralApi() {
  return useMutation({
    mutationFn: deleteReferralApi,
  });
}
