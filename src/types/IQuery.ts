import type { MRT_SortingState } from 'material-react-table';

export interface IQuery {
  page: number;
  limit: number;
  sorting?: MRT_SortingState[number];
  filters?: Record<string, unknown>;
}
