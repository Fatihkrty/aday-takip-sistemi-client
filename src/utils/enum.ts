import { WorkDay } from '@/constants/work-day';
import { Gender } from '@/constants/gender.enum';
import { WorkType } from '@/constants/work-type';
import { SideRights } from '@/constants/side-rights';
import { UserRoles } from '@/constants/user-roles.enum';
import { Compatibility } from '@/constants/compatibility';
import { RequestStatus } from '@/constants/request-status';
import { MilitaryService } from '@/constants/military-service';
import { CandidateStatus } from '@/constants/candidate-status';
import { CompanyWorkType } from '@/constants/company-work-type';

export function getCandidateStatusText(value: keyof typeof CandidateStatus) {
  switch (value) {
    case 'evaluation':
      return 'Değerlendirme Aşaması';
    case 'employment':
      return 'İstihdam Edildi';
    case 'cancellation':
      return 'İptal Edildi';
    case 'elimination':
      return 'Elendi';
  }
}

export function getRequestStatusText(value: keyof typeof RequestStatus) {
  switch (value) {
    case 'open':
      return 'Açık';
    case 'closed':
      return 'Kapalı';
    case 'cancelled':
      return 'İptal edildi';
  }
}

export function getSideRightsText(value: keyof typeof SideRights) {
  switch (value) {
    case 'car':
      return 'Araç';
    case 'meal':
      return 'Yemek';
    case 'phone':
      return 'Telefon';
    case 'health':
      return 'Özel Sağlık Sigortası';
    case 'transport':
      return 'Ulaşım';
  }
}

export function getWorkDayText(value: keyof typeof WorkDay) {
  switch (value) {
    case 'saturday':
      return 'Cumartesi';
    case 'sunday':
      return 'Pazar';
    case 'weekday':
      return 'Haftaiçi';
  }
}

export function getCompanyWorkTypeText(value: keyof typeof CompanyWorkType | null) {
  switch (value) {
    case 'longlist':
      return 'Longlist';
    case 'reference':
      return 'Referans';
    case 'shortlist':
      return 'Shortlist';
  }
  return '';
}

export function getWorkTypeText(value: keyof typeof WorkType) {
  switch (value) {
    case 'full':
      return 'Full Time';
    case 'shift':
      return 'Vardiyalı';
    case 'partTime':
      return 'Part Time';
  }
}

export function getGenderText(value: keyof typeof Gender | null) {
  switch (value) {
    case 'male':
      return 'Erkek';
    case 'female':
      return 'Kadın';
  }
  return 'Farketmez';
}

export function getUserRoleText(value: keyof typeof UserRoles) {
  switch (value) {
    case UserRoles.admin:
      return 'Admin';
    case UserRoles.user:
      return 'Kullanıcı';
  }
}

export function getMilitaryServiceText(value: keyof typeof MilitaryService | null) {
  switch (value) {
    case 'done':
      return 'Yapıldı';
    case 'exempt':
      return 'Muaf';
    case 'notDone':
      return 'Yapılmadı';
  }
  return 'Farketmez';
}

export function getCompatibilityText(value: keyof typeof Compatibility) {
  switch (value) {
    case 'notr':
      return 'Nötr';
    case 'positive':
      return 'Pozitif';
    case 'negative':
      return 'Negatif';
    case 'blackList':
      return 'Kara Liste';
    case 'incompatible':
      return 'Uyumsuz';
  }
}

export function enumToArray<T extends object>(enumData: T): (keyof T)[] {
  return Object.keys(enumData) as (keyof T)[];
}
