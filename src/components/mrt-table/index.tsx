import { useTheme } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { IPaginate } from '@/types/IPaginate';
import ScrollableCell from './scrollable-cell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ITableFilter } from './hooks/useTableFilter';
import { UseQueryResult } from '@tanstack/react-query';
import { MRT_Localization_TR } from 'material-react-table/locales/tr';
import {
  type MRT_RowData,
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_TableOptions,
  MRT_ToggleFiltersButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleDensePaddingButton,
} from 'material-react-table';

interface Props<TData extends MRT_RowData> extends Omit<MRT_TableOptions<TData>, 'data'> {
  tableFilter: ITableFilter;
  queryData: UseQueryResult<IPaginate<TData>, Error>;
}

export default function LiveMRTTable<TData extends MRT_RowData>({
  columns,
  queryData,
  tableFilter,
  state,
  ...props
}: Props<TData>) {
  const theme = useTheme();
  const { columnFilters, pagination, setColumnFilters, setPagination, setSorting, sorting } = tableFilter;
  const { data: { results = [], totalResults = 0 } = {}, isError, isRefetching, isLoading, refetch } = queryData;

  const table = useMaterialReactTable({
    manualSorting: true,
    enablePinning: true,
    manualFiltering: true,
    manualPagination: true,
    layoutMode: 'semantic',
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableGlobalFilter: false,
    enableColumnResizing: true,
    positionActionsColumn: 'last',
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getRowId: (row) => row.id,
    defaultColumn: {
      Cell({ renderedCellValue }) {
        if (renderedCellValue === null || renderedCellValue === undefined)
          return (
            <Typography variant="inherit" color="error.main">
              Bilgi Yok
            </Typography>
          );
        return <ScrollableCell>{renderedCellValue}</ScrollableCell>;
      },
    },
    renderToolbarInternalActions({ table }) {
      return (
        <>
          <Tooltip title="Verileri Güncelle" arrow placement="bottom">
            <IconButton onClick={() => refetch()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <MRT_ToggleFiltersButton table={table} />
          <MRT_ShowHideColumnsButton table={table} />
          <MRT_ToggleDensePaddingButton table={table} />
          <MRT_ToggleFullScreenButton table={table} />
        </>
      );
    },
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: 'Veriler yüklenirken bir hata oluştu',
        }
      : undefined,
    muiTablePaperProps: {
      elevation: 0,
      variant: 'outlined',
      style: {
        zIndex: theme.zIndex.drawer + 2,
      },
      sx: {
        px: 2,
      },
    },
    muiTableBodyCellProps: {
      align: 'center',
      sx: {
        borderLeft: '1px solid #CFDAE6',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 230px)',
        borderLeft: '1px solid #CFDAE6',
        borderRight: '1px solid #CFDAE6',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        boxShadow: 1,
        backgroundColor: '#F2F6FA',
      },
    },
    muiFilterTextFieldProps: {
      inputProps: {
        autocomplete: 'new-password',
        form: {
          autocomplete: 'off',
        },
      },
    },
    state: {
      sorting,
      isLoading,
      pagination,
      columnFilters,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      ...state,
    },
    localization: MRT_Localization_TR,
    rowCount: totalResults,
    ...props,
    columns,
    data: results,
  });

  return <MaterialReactTable table={table} />;
}
