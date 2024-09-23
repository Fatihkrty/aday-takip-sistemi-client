import { ICompany } from './ICompany';
import { IRequestForm } from './IRequest';
import { IBaseResponse } from './IBaseResponse';

export interface IExternalRequestForm extends Omit<IRequestForm, 'company' | 'user' | 'companyWorkType'> {}

export interface IExternalRequest extends IBaseResponse {
  company: Pick<ICompany, 'id' | 'name' | 'email' | 'sector'>;
  code: string;
  isActive: boolean;
  createdAt: Date;
  companyId: number;
}
