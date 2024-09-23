'use client';

import paths from '@/routes/paths';
import axios, { AxiosError, isAxiosError, HttpStatusCode, CreateAxiosDefaults } from 'axios';

const axiosConfig: CreateAxiosDefaults = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
};

const axiosInstance = axios.create(axiosConfig);

axiosInstance.interceptors.response.use(
  (res) => res.data,
  async (error) => {
    if (isAxiosError(error) && error.code === AxiosError.ERR_BAD_REQUEST) {
      const statusCode = error.response?.status;

      if (statusCode === HttpStatusCode.Forbidden) {
        window.location.href = '/forbidden';
      } else if (statusCode === HttpStatusCode.Unauthorized) {
        if (window.location.pathname !== paths.login) {
          window.location.href = `${paths.login}?expired=true`;
        }
      }

      error.message = error.response?.data.message || 'Bir  şeyler ters gitti';

      throw error;
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
