import { IUser } from '@/types/IUser';
import axiosInstance from '@/utils/axios';
import API_ENDPOINTS from './API_ENDPOINTS';
import { ILoginForm } from '@/types/ILoginForm';
import { IResetPasswordForm } from '@/types/IResetPasswordForm';
import { IForgotPasswordForm } from '@/types/IForgotPasswordForm';

export async function loginAPI(data: ILoginForm): Promise<IUser> {
  return axiosInstance.post(API_ENDPOINTS.auth.login, data);
}

export async function logoutAPI() {
  return axiosInstance.get(API_ENDPOINTS.auth.logout);
}

export async function forgotPasswordAPI(data: IForgotPasswordForm): Promise<void> {
  return axiosInstance.post(API_ENDPOINTS.auth.forgotPassword, data);
}

export async function resetPasswordAPI(data: Omit<IResetPasswordForm, 'confirmPassword'>): Promise<void> {
  return axiosInstance.post(API_ENDPOINTS.auth.resetPassword, data);
}

export async function getMeAPI(): Promise<IUser> {
  return axiosInstance.get(API_ENDPOINTS.auth.me);
}
