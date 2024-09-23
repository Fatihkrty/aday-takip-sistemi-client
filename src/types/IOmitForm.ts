import { IBaseResponse } from './IBaseResponse';

export type OmitForm<T, K extends keyof Omit<T, keyof IBaseResponse>> = Partial<Omit<T, K | keyof IBaseResponse>>;
