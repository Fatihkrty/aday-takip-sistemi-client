import { Dispatch, useState, SetStateAction } from 'react';
import { MRT_SortingState, MRT_PaginationState, MRT_ColumnFiltersState } from 'material-react-table';

export interface ITableFilter {
  sorting: MRT_SortingState;
  setSorting: Dispatch<SetStateAction<MRT_SortingState>>;
  columnFilters: MRT_ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<MRT_ColumnFiltersState>>;
  pagination: MRT_PaginationState;
  setPagination: Dispatch<SetStateAction<MRT_PaginationState>>;
}

interface Props {
  defaultFilters?: MRT_ColumnFiltersState;
}

export function useTableFilter({ defaultFilters }: Props = {}): ITableFilter {
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(defaultFilters || []);

  return { sorting, setSorting, columnFilters, setColumnFilters, pagination, setPagination };
}
