import { IBaseResponse } from './IBaseResponse';

export interface INotification extends IBaseResponse {
  message: string;
  isReaded: boolean;
  createdAt: Date;
  userId: number;
}
