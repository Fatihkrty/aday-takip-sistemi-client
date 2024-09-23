import { useTheme } from '@mui/material';
import ScrollableCell from './scrollable-cell';
import Typography from '@mui/material/Typography';
import { MRT_Localization_TR } from 'material-react-table/locales/tr';
import {
  type MRT_RowData,
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_TableOptions,
} from 'material-react-table';

interface Props<TData extends MRT_RowData> extends MRT_TableOptions<TData> {}

export default function OfflineMRTTable<TData extends MRT_RowData>(props: Props<TData>) {
  const theme = useTheme();

  const table = useMaterialReactTable({
    enablePinning: true,
    layoutMode: 'semantic',
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableGlobalFilter: false,
    enableColumnResizing: true,
    positionActionsColumn: 'last',
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
    localization: MRT_Localization_TR,
    ...props,
  });

  return <MaterialReactTable table={table} />;
}
