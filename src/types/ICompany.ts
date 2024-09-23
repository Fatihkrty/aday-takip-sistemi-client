import { IBaseResponse } from './IBaseResponse';

export interface ICompanyContract extends IBaseResponse {
  uri: string;
  name: string;
  endDate: Date;
  startDate: Date;
  createdAt: Date;
}

export interface ICompany extends IBaseResponse {
  name: string;
  sector: string;
  createdAt: Date;
  email: string | null;
  address: string | null;
  location: string | null;
  description: string | null;
  contracts: ICompanyContract[];
}

export interface ICompanyForm {
  name: string | null;
  sector: string | null;
  email: string | null;
  address: string | null;
  location: string | null;
  description: string | null;
}
