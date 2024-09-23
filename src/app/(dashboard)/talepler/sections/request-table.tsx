import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { IRequest } from '@/types/IRequest';
import tlCurrency from '@/utils/tl-currency';
import { IPaginate } from '@/types/IPaginate';
import { WorkDay } from '@/constants/work-day';
import { fDatetime } from '@/utils/format-time';
import { WorkType } from '@/constants/work-type';
import { Gender } from '@/constants/gender.enum';
import LiveMRTTable from '@/components/mrt-table';
import Typography from '@mui/material/Typography';
import { SideRights } from '@/constants/side-rights';
import { UseQueryResult } from '@tanstack/react-query';
import { MilitaryService } from '@/constants/military-service';
import { CompanyWorkType } from '@/constants/company-work-type';
import FiberManualRecord from '@mui/icons-material/FiberManualRecord';
import { MRT_ColumnDef, MRT_TableOptions } from 'material-react-table';
import { ITableFilter } from '@/components/mrt-table/hooks/useTableFilter';
import {
  enumToArray,
  getGenderText,
  getWorkDayText,
  getWorkTypeText,
  getSideRightsText,
  getRequestStatusText,
  getCompanyWorkTypeText,
  getMilitaryServiceText,
} from '@/utils/enum';

interface Props extends Omit<MRT_TableOptions<IRequest>, 'columns' | 'data'> {
  tableFilter: ITableFilter;
  queryData: UseQueryResult<IPaginate<IRequest>, Error>;
}

export default function RequestsTable(props: Props) {
  const columns = useMemo<Array<MRT_ColumnDef<IRequest>>>(
    () => [
      {
        size: 120,
        header: 'Talep No',
        accessorKey: 'id',
        enableSorting: true,
        muiFilterTextFieldProps: {
          type: 'number',
        },
        accessorFn(originalRow) {
          return `#${originalRow.id}`;
        },
        Cell({ row }) {
          return (
            <Box display="flex" alignItems="center" justifyContent="center">
              <FiberManualRecord color={row.original.isExternal ? 'error' : 'success'} fontSize={'small'} />
              <Typography variant="inherit">#{row.id}</Typography>
            </Box>
          );
        },
      },
      {
        id: 'companyName',
        header: 'Firma Adı',
        enableSorting: false,
        accessorKey: 'company.name',
      },
      {
        header: 'Pozisyon',
        enableSorting: false,
        id: 'positionName',
        accessorKey: 'position.name',
      },
      {
        header: 'Departman',
        accessorKey: 'department',
      },
      {
        header: 'Görev Tanımı',
        enableSorting: false,
        accessorKey: 'jobDescription',
      },
      {
        header: 'Ek Açıklama',
        enableSorting: false,
        accessorKey: 'description',
      },
      {
        header: 'Aranan Nitelikler',
        enableSorting: false,
        accessorKey: 'requiredQualifications',
      },
      {
        header: 'Personel Sayısı',
        accessorKey: 'workerReqCount',
        muiFilterTextFieldProps: {
          type: 'number',
        },
      },
      {
        header: 'Maaş',
        accessorKey: 'salary',
        muiFilterTextFieldProps: {
          type: 'number',
        },
        accessorFn(originalRow) {
          return tlCurrency(originalRow.salary);
        },
      },
      {
        header: 'Prim',
        accessorKey: 'prim',
        filterVariant: 'select',
        enableSorting: false,
        filterSelectOptions: [
          { value: 'true', label: 'Var' },
          { value: 'false', label: 'Yok' },
        ],
        accessorFn(originalRow) {
          return originalRow.prim ? 'Var' : 'Yok';
        },
      },
      {
        header: 'Çalışma Şekli',
        accessorKey: 'workType',
        enableSorting: false,
        filterVariant: 'multi-select',
        filterSelectOptions: enumToArray(WorkType).map((x) => ({ label: getWorkTypeText(x), value: x })),
        accessorFn(originalRow) {
          if (!originalRow.workType.length) return null;
          return originalRow.workType.map((x) => getWorkTypeText(x)).join(',');
        },
      },
      {
        header: 'Firma Çalışma Şekli',
        accessorKey: 'companyWorkType',
        filterVariant: 'select',
        enableSorting: false,
        filterSelectOptions: enumToArray(CompanyWorkType).map((x) => ({ label: getCompanyWorkTypeText(x), value: x })),
        accessorFn(originalRow) {
          if (!originalRow.companyWorkType) return null;
          return getCompanyWorkTypeText(originalRow.companyWorkType);
        },
      },
      {
        header: 'Çalışma Günleri',
        accessorKey: 'workDays',
        enableSorting: false,
        filterVariant: 'multi-select',
        filterSelectOptions: enumToArray(WorkDay).map((x) => ({ label: getWorkDayText(x), value: x })),
        accessorFn(originalRow) {
          if (!originalRow.workDays.length) return null;
          return originalRow.workDays.map((x) => getWorkDayText(x)).join(',');
        },
      },
      {
        header: 'İş Başlangıç Saati',
        enableSorting: false,
        accessorKey: 'workHourStart',
      },
      {
        header: 'İş Bitiş Saati',
        enableSorting: false,
        accessorKey: 'workHourEnd',
      },
      {
        header: 'Yetkili Ad Soyad',
        accessorKey: 'advisorName',
      },
      {
        header: 'Yetkili Telefon',
        enableSorting: false,
        accessorKey: 'advisorPhone',
      },
      {
        header: 'Yetkili Email',
        enableSorting: false,
        accessorKey: 'advisorEmail',
      },
      {
        header: 'Yetkili Ünvan',
        accessorKey: 'advisorTitle',
      },
      {
        header: 'Yan Haklar',
        enableSorting: false,
        filterVariant: 'multi-select',
        filterSelectOptions: enumToArray(SideRights).map((x) => ({ label: getSideRightsText(x), value: x })),
        accessorKey: 'sideRights',
        accessorFn(originalRow) {
          if (!originalRow.sideRights.length) return null;
          return originalRow.sideRights.map((x) => getSideRightsText(x)).join(',');
        },
      },
      {
        header: 'Cinsiyet',
        accessorKey: 'gender',
        enableSorting: false,
        filterVariant: 'select',
        filterSelectOptions: [
          ...enumToArray(Gender).map((x) => ({ label: getGenderText(x), value: x })),
          { value: 'null', label: 'Farketmez' },
        ],
        accessorFn(originalRow) {
          if (!originalRow.gender) return 'Farketmez';
          return getGenderText(originalRow.gender);
        },
      },
      {
        header: 'Askerlik',
        enableSorting: false,
        accessorKey: 'militaryService',
        filterVariant: 'select',
        filterSelectOptions: [
          ...enumToArray(MilitaryService).map((x) => ({ label: getMilitaryServiceText(x), value: x })),
          { value: 'null', label: 'Farketmez' },
        ],
        accessorFn(originalRow) {
          if (!originalRow.militaryService) return 'Farketmez';
          return getMilitaryServiceText(originalRow.militaryService);
        },
      },
      {
        header: 'Diller',
        id: 'languageName',
        enableSorting: false,
        enableColumnFilter: false,
        accessorFn(originalRow) {
          if (!originalRow.languages.length) return null;
          return originalRow.languages.map((lang, i) => (
            <Box key={i}>
              <Typography variant="inherit">{lang.name}</Typography>
              <Rating value={lang.rate} readOnly />
            </Box>
          ));
        },
      },
      {
        header: 'Talep Durumu',
        accessorKey: 'status',
        enableSorting: false,
        enableColumnFilter: false,
        accessorFn(originalRow) {
          return getRequestStatusText(originalRow.status);
        },
      },
      {
        enableColumnFilter: false,
        header: 'Kapanış Tarihi',
        accessorKey: 'closedAt',
        accessorFn(originalRow) {
          if (!originalRow.closedAt) return null;
          return fDatetime(originalRow.closedAt);
        },
      },

      {
        id: 'userName',
        enableSorting: false,
        header: 'Danışman',
        accessorKey: 'user.name',
      },
    ],
    []
  );

  return <LiveMRTTable columns={columns} {...props} />;
}
