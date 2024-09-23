import { IQuery } from '@/types/IQuery';
import { IPaginate } from '@/types/IPaginate';
import { ITableFilter } from './useTableFilter';
import { MRT_RowData } from 'material-react-table';
import { QueryKey, useQuery, UseQueryOptions, keepPreviousData } from '@tanstack/react-query';

interface ILiveTableUseQuery<TData extends MRT_RowData> {
  queryKey: QueryKey;
  tableFilter: ITableFilter;
  queryFn: (params: IQuery) => Promise<IPaginate<TData>>;
  queryOptions?: Omit<UseQueryOptions<IPaginate<TData>>, 'queryKey' | 'queryFn' | 'placeholderData'>;
}

export function useLiveTableQuery<TData extends MRT_RowData>({
  queryFn,
  queryKey,
  tableFilter,
  queryOptions,
}: ILiveTableUseQuery<TData>) {
  const { columnFilters, pagination, sorting } = tableFilter;

  return useQuery<IPaginate<TData>>({
    queryKey: [...queryKey, sorting, columnFilters, pagination.pageIndex, pagination.pageSize],
    placeholderData: keepPreviousData,
    queryFn: () => {
      const filters: Record<string, unknown> = {};
      for (let i = 0; i < columnFilters.length; i++) {
        const el = columnFilters[i];
        filters[el.id] = el.value;
      }

      return queryFn({
        filters,
        page: pagination.pageIndex,
        limit: pagination.pageSize,
        sorting: sorting.length ? sorting[0] : undefined,
      });
    },
    ...queryOptions,
  });
}
