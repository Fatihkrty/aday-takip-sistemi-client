import * as XLSX from 'xlsx';
import { IRequest } from '@/types/IRequest';
import {
  getGenderText,
  getWorkDayText,
  getWorkTypeText,
  getSideRightsText,
  getRequestStatusText,
  getCompanyWorkTypeText,
  getMilitaryServiceText,
} from '@/utils/enum';

export function exportRequestXlsx(request: IRequest[]) {
  const normalized = request.map((x) => ({
    department: x.department ?? 'Bilinmiyor',
    workerReqCount: x.workerReqCount ?? 'Bilinmiyor',
    jobDescription: x.jobDescription ?? 'Bilinmiyor',
    description: x.description ?? 'Bilinmiyor',
    salary: x.salary ?? 'Bilinmiyor',
    prim: x.prim ? 'Var' : 'Yok',
    workHourStart: x.workHourStart ?? 'Bilinmiyor',
    workHourEnd: x.workHourEnd ?? 'Bilinmiyor',
    advisorName: x.advisorName ?? 'Bilinmiyor',
    advisorEmail: x.advisorEmail ?? 'Bilinmiyor',
    advisorPhone: x.advisorPhone ?? 'Bilinmiyor',
    advisorTitle: x.advisorTitle ?? 'Bilinmiyor',
    workType: x.workType.map((y) => getWorkTypeText(y)).join(', '),
    companyWorkType: x.companyWorkType ? getCompanyWorkTypeText(x.companyWorkType) : 'Bilinmiyor',
    workDays: x.workDays.map((y) => getWorkDayText(y)).join(', '),
    sideRights: x.sideRights.map((y) => getSideRightsText(y)).join(', '),
    gender: x.gender ? getGenderText(x.gender) : 'Bilinmiyor',
    militaryService: x.militaryService ? getMilitaryServiceText(x.militaryService) : 'Bilinmiyor',
    status: getRequestStatusText(x.status),
    closedAt: x.closedAt ? new Date(x.closedAt) : 'Bilinmiyor',
    isExternal: x.isExternal ? 'Dış Talep' : 'Normal Talep',
    languages: x.languages.map((y) => `${y.name} (${y.rate})`).join(', '),
    position: x.position?.name ?? 'Bilinmiyor',
    user: x.user?.name || 'Bilinmiyor',
    company: x.company.name,
  }));

  const workSheet = XLSX.utils.json_to_sheet(normalized);
  const workBook = XLSX.utils.book_new();

  const headers = [
    'Departman',
    'Talep Edilen Personel Sayısı',
    'Görev Tanımı',
    'Ek Açıklamalar',
    'Maaş',
    'Prim',
    'İş Başlangıç Saati',
    'İş Bitiş Saati',
    'Yetkili Ad Soyad',
    'Yetkili Email',
    'Yetkili Telefon',
    'Yetkili Ünvan',
    'Çalışma Şekli',
    'Firma Çalışma Şekli',
    'Çalışma Günleri',
    'Yan Haklar',
    'Cinsiyet',
    'Askerlik',
    'Durum',
    'Talep Kapanış Tarihi',
    'Talep Türü',
    'Diller',
    'Pozisyon',
    'Danışan',
    'Firma',
  ];

  workSheet['!cols'] = headers.map((x) => ({ wch: x.length }));
  XLSX.utils.sheet_add_aoa(workSheet, [headers], { origin: 'A1' });
  XLSX.utils.book_append_sheet(workBook, workSheet, 'Talepler');

  return XLSX.writeFile(workBook, `Talepler - ${new Date().toLocaleDateString()}.xlsx`);
}
