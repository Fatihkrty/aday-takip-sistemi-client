import * as XLSX from 'xlsx';
import { ICandidate } from '@/types/ICandidate';
import { getCompatibilityText, getMilitaryServiceText } from '@/utils/enum';

export function createCandidateXlsx(candidates: ICandidate[]) {
  const normalizedCandidates = candidates.map((x) => ({
    id: x.id,
    name: x.name,
    militaryService: getMilitaryServiceText(x.militaryService),
    compatibility: x.compatibility ? getCompatibilityText(x.compatibility) : 'Bilinmiyor',
    email: x.email ?? 'Bilinmiyor',
    phone: x.phone ?? 'Bilinmiyor',
    note: x.note ?? 'Bilinmiyor',
    location: x.location ?? 'Bilinmiyor',
    salary: x.salary ?? 'Bilinmiyor',
    rate: x.rate ?? 'Bilinmiyor',
    positions: x.positions.map((x) => x.position.name).join(', '),
    references: x.references.map((x) => `${x.name} (${x.phone})`).join(', '),
    languages: x.languages.map((x) => `${x.name} (${x.rate})`).join(', '),
    createdAt: new Date(x.createdAt),
  }));

  const workSheet = XLSX.utils.json_to_sheet(normalizedCandidates, { cellStyles: true });

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, workSheet, 'Adaylar');
  XLSX.utils.sheet_add_aoa(
    workSheet,
    [
      [
        'ID',
        'Ad Soyad',
        'Askerlik Durumu',
        'Uyum',
        'Email',
        'Telefon',
        'Notlar',
        'Lokasyon',
        'Maaş',
        'Değerli CV',
        'Pozisyonlar',
        'Referanslar',
        'Diller',
        'Kayıt Tarihi',
      ],
    ],
    {
      origin: 'A1',
    }
  );

  return XLSX.writeFile(workbook, `Adaylar - ${new Date().toLocaleDateString('tr-TR')}.xlsx`, { compression: true });
}
