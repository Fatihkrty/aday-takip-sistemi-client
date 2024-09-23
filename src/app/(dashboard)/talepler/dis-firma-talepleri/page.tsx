'use client';

import { useMemo } from 'react';
import Chip from '@mui/material/Chip';
import { fDatetime } from '@/utils/format-time';
import Typography from '@mui/material/Typography';
import LiveMRTTable from '@/components/mrt-table';
import { MRT_ColumnDef } from 'material-react-table';
import ContentCopy from '@mui/icons-material/ContentCopy';
import { IExternalRequest } from '@/types/IExternalRequest';
import { useTableFilter } from '@/components/mrt-table/hooks/useTableFilter';
import { useLiveTableQuery } from '@/components/mrt-table/hooks/useLiveTableQuery';
import { getExternalRequestsApi, EXTERNAL_REQUEST_QUERY_KEY } from '@/api/useExternalRequestApi';

export default function ExternalRequestPage() {
  const tableFilter = useTableFilter();
  const queryData = useLiveTableQuery({
    tableFilter,
    queryFn: getExternalRequestsApi,
    queryKey: EXTERNAL_REQUEST_QUERY_KEY,
  });

  const columns = useMemo<Array<MRT_ColumnDef<IExternalRequest>>>(
    () => [
      {
        id: 'name',
        header: 'Firma Adı',
        accessorKey: 'company.name',
      },
      {
        id: 'email',
        header: 'Yetkili Email',
        accessorKey: 'company.email',
      },
      {
        id: 'sector',
        header: 'Sektör',
        accessorKey: 'company.sector',
      },
      {
        header: 'Link',
        accessorKey: 'code',
        enableClickToCopy: true,
        enableColumnFilter: false,
        muiCopyButtonProps: {
          fullWidth: true,
          startIcon: <ContentCopy color="success" />,
        },
        accessorFn(originalRow) {
          return `${process.env.NEXT_PUBLIC_FRONTEND_URL}/forms/${originalRow.code}`;
        },
        Cell() {
          return (
            <Typography variant="inherit" sx={{ color: 'success.main' }}>
              Linki kopyala
            </Typography>
          );
        },
      },
      {
        header: 'Form Durumu',
        accessorKey: 'isActive',
        filterVariant: 'select',
        filterSelectOptions: [
          { value: 'false', label: 'Form Doldurulmuş' },
          { value: 'true', label: 'Form Doldurulmamış' },
        ],
        accessorFn(originalRow) {
          return originalRow.isActive ? (
            <Chip variant="outlined" label="Form Doldurulmamış" size="small" color="error" />
          ) : (
            <Chip variant="outlined" label="Form Doldurulmuş" color="success" size="small" />
          );
        },
      },
      {
        header: 'Gönderim Tarihi',
        accessorKey: 'createdAt',
        enableColumnFilter: false,
        accessorFn(originalRow) {
          return fDatetime(originalRow.createdAt);
        },
      },
    ],
    []
  );

  return <LiveMRTTable enableSorting={false} columns={columns} queryData={queryData} tableFilter={tableFilter} />;
}
