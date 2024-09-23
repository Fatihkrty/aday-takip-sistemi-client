import { IReferral } from './IReferral';
import { IBaseResponse } from './IBaseResponse';
import { Gender } from '@/constants/gender.enum';
import { Compatibility } from '@/constants/compatibility';
import { MilitaryService } from '@/constants/military-service';

export interface ICandidateCv extends IBaseResponse {
  uri: string;
  isExternal: boolean;
}

export interface ICandidateLanguage extends IBaseResponse {
  name: string;
  rate: number;
}

export interface ICandidatePosition extends IBaseResponse {
  name: string;
}

export interface ICandidateReference extends IBaseResponse {
  name: string;
  phone: string | null;
}

export interface ICandidate extends IBaseResponse {
  name: string;
  gender: Gender;
  militaryService: MilitaryService;
  compatibility: Compatibility | null;
  email: string | null;
  phone: string | null;
  note: string | null;
  location: string | null;
  salary: number | null;
  cvs: ICandidateCv[];
  rate: number | null;
  positions: { position: ICandidatePosition }[];
  references: ICandidateReference[];
  languages: ICandidateLanguage[];
  createdAt: Date;
  deletedAt?: Date;
  referrals: IReferral[];
}

// Form Inputs

export interface ICandidateForm
  extends Record<
    keyof Omit<ICandidate, 'id' | 'createdAt' | 'cvs' | 'deletedAt' | 'referrals'>,
    string | null | Array<any> | number
  > {
  references: { name: string | null; phone: string | null }[];
  languages: { name: string | null; rate: number | null }[];
}

export interface ISearchCandidateResponse extends IBaseResponse {
  name: string;
  positions: { position: { name: string } }[];
  referrals: IReferral[];
}
