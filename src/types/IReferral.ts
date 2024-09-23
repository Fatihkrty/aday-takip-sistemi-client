import { IRequest } from './IRequest';
import { ICandidate } from './ICandidate';
import { IBaseResponse } from './IBaseResponse';
import { CandidateStatus } from '@/constants/candidate-status';

export interface IReferral extends IBaseResponse {
  status: CandidateStatus;
  request: IRequest;
  description: string | null;
  candidate: ICandidate;
  candidateId: number;
  requestId: number;
  createdAt: Date;
}

export interface IReferralForm {
  id?: number;
  requestId?: number;
  candidateId?: number;
  status?: CandidateStatus;
  description?: string | null;
}
