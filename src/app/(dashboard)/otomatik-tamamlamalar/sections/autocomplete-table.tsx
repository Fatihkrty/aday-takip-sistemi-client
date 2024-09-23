import { useMemo } from 'react';
import API_ENDPOINTS from '@/api/API_ENDPOINTS';
import { QueryKey } from '@tanstack/react-query';
import LiveMRTTable from '@/components/mrt-table';
import { MRT_ColumnDef } from 'material-react-table';
import { IAutocomplete } from '@/types/IAutocomplete';
import { getAutocompleteDatasApi } from '@/api/useAutocomplete';
import { useTableFilter } from '@/components/mrt-table/hooks/useTableFilter';
import { useLiveTableQuery } from '@/components/mrt-table/hooks/useLiveTableQuery';

interface Props {
  url: keyof typeof API_ENDPOINTS.autocomplete;
  queryKey: QueryKey;
}

export default function AutocompleteTable({ url, queryKey }: Props) {
  const tableFilter = useTableFilter();

  const queryData = useLiveTableQuery({
    queryKey,
    tableFilter,
    queryFn: (params) => getAutocompleteDatasApi(url, params),
  });

  const columns = useMemo<Array<MRT_ColumnDef<IAutocomplete>>>(
    () => [
      {
        header: 'Id',
        maxSize: 20,
        accessorKey: 'id',
        muiFilterTextFieldProps: { type: 'number' },
        accessorFn(originalRow) {
          return `#${originalRow.id}`;
        },
      },
      {
        header: 'Değer',
        accessorKey: 'name',
      },
    ],
    []
  );

  return (
    <LiveMRTTable
      enableColumnResizing={false}
      layoutMode="grid"
      columns={columns}
      queryData={queryData}
      tableFilter={tableFilter}
    />
  );
}
