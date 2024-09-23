import { IUser } from './IUser';
import { ICompany } from './ICompany';
import { IReferral } from './IReferral';
import { WorkDay } from '@/constants/work-day';
import { IBaseResponse } from './IBaseResponse';
import { WorkType } from '@/constants/work-type';
import { Gender } from '@/constants/gender.enum';
import { SideRights } from '@/constants/side-rights';
import { RequestStatus } from '@/constants/request-status';
import { MilitaryService } from '@/constants/military-service';
import { CompanyWorkType } from '@/constants/company-work-type';

export interface IRequestLanguage extends IBaseResponse {
  name: string;
  rate: number;
}

export interface IRequest extends IBaseResponse {
  department: string | null;
  workerReqCount: number;
  jobDescription: string | null;
  requiredQualifications: string | null;
  description: string | null;
  salary: number;
  prim: boolean;
  workType: WorkType[];
  companyWorkType: CompanyWorkType | null;
  workDays: WorkDay[];
  workHourStart: string | null;
  workHourEnd: string | null;
  advisorName: string | null;
  advisorPhone: string | null;
  advisorTitle: string | null;
  advisorEmail: string | null;
  sideRights: SideRights[];
  gender: Gender | null;
  militaryService: MilitaryService | null;
  status: RequestStatus;
  closedAt: Date | null;
  isExternal: boolean;
  languages: IRequestLanguage[];
  referrals: IReferral[];
  position: { id: number; name: string } | null;
  user: Pick<IUser, 'id' | 'name'> | null;
  company: Pick<ICompany, 'id' | 'name'>;
}

export interface IRequestForm
  extends Omit<
    IRequest,
    'id' | 'company' | 'closedAt' | 'isExternal' | 'status' | 'languages' | 'position' | 'referrals'
  > {
  languages: { name: string | null; rate: number }[];
  company: Pick<ICompany, 'id' | 'name'> | null;
  position: string | null;
}
