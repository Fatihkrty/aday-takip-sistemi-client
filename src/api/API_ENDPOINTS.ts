const AUTH = '/auth';
const USER = '/users';
const REQUEST = '/requests';
const COMPANY = '/companies';
const REFERRAL = '/referrals';
const DASHBOARD = '/dashboard';
const CANDIDATE = '/candidates';
const AUTOCOMPLETE = '/autocomplete';
const NOTIFICATION = '/notifications';
const EXTERNAL_REQUEST = '/external-requests';

const API_ENDPOINTS = {
  dashboard: {
    root: DASHBOARD,
    companyStatus: `${DASHBOARD}/company-status`,
  },
  auth: {
    me: `${AUTH}/me`,
    login: `${AUTH}/login`,
    logout: `${AUTH}/logout`,
    resetPassword: `${AUTH}/reset-password`,
    forgotPassword: `${AUTH}/forgot-password`,
  },
  notification: {
    base: NOTIFICATION,
    markAsRead: (id: number) => `${NOTIFICATION}/mark-as-read/${id}`,
  },
  user: {
    root: USER,
    update: (id: number) => `${USER}/${id}`,
    delete: (id: number) => `${USER}/${id}`,
  },
  company: {
    root: COMPANY,
    sendReqForm: `${COMPANY}/send-request-form`,
    contract: (id: number) => `${COMPANY}/contract/${id}`,
    update: (id: number) => `${COMPANY}/${id}`,
    delete: (id: number) => `${COMPANY}/${id}`,
    deletContract: (id: number) => `${COMPANY}/contract/${id}`,
  },
  candidate: {
    root: CANDIDATE,
    search: `${CANDIDATE}/search`,
    id: (id: number | string) => `${CANDIDATE}/${id}`,
    update: (id: number) => `${CANDIDATE}/${id}`,
    cv: (id: number | string) => `${CANDIDATE}/cv/${id}`,
    deleteCv: (id: number | string) => `${CANDIDATE}/cv/${id}`,
  },
  autocomplete: {
    search: {
      company: `${AUTOCOMPLETE}/search/companies`,
      user: `${AUTOCOMPLETE}/search/users`,
      location: `${AUTOCOMPLETE}/search/locations`,
      sector: `${AUTOCOMPLETE}/search/sectors`,
      position: `${AUTOCOMPLETE}/search/positions`,
    },
    position: `${AUTOCOMPLETE}/positions`,
    sector: `${AUTOCOMPLETE}/sectors`,
    location: `${AUTOCOMPLETE}/locations`,
  },
  request: {
    root: REQUEST,
    id: (id: number | string) => `${REQUEST}/${id}`,
    update: (id: number) => `${REQUEST}/${id}`,
    allow: (id: number | string) => `${REQUEST}/allow/${id}`,
    changeStatus: (id: number) => `${REQUEST}/change-status/${id}`,
  },
  referral: {
    root: REFERRAL,
    update: (id: number) => `${REFERRAL}/${id}`,
    delete: (id: number) => `${REFERRAL}/${id}`,
  },
  externalRequest: {
    root: EXTERNAL_REQUEST,
    code: (code: string) => `${EXTERNAL_REQUEST}/${code}`,
  },
};

export default API_ENDPOINTS;
