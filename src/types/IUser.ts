import { IBaseResponse } from './IBaseResponse';
import { UserRoles } from '@/constants/user-roles.enum';

export interface IUser extends IBaseResponse {
  name: string;
  email: string;
  phone: string | null;
  role: UserRoles;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
}

export interface IUserInputForm {
  name: string | null;
  email: string | null;
  phone?: string | null;
  role: UserRoles;
  isActive: boolean;
}
