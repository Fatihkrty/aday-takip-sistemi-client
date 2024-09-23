'use client';

import { useState } from 'react';
import paths from '@/routes/paths';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useSnackbar } from 'notistack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import Edit from '@mui/icons-material/Edit';
import { IRequest } from '@/types/IRequest';
import { useRouter } from 'next/navigation';
import MenuItem from '@mui/material/MenuItem';
import Delete from '@mui/icons-material/Delete';
import { useBoolean } from '@/hooks/useBoolean';
import Typography from '@mui/material/Typography';
import TaskAlt from '@mui/icons-material/TaskAlt';
import RequestForm from './sections/request-form';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import RequestsTable from './sections/request-table';
import PersonAdd from '@mui/icons-material/PersonAdd';
import BaseModal from '@/components/modal/base-modal';
import HistoryEdu from '@mui/icons-material/HistoryEdu';
import { UserRoles } from '@/constants/user-roles.enum';
import { MRT_ActionMenuItem } from 'material-react-table';
import SearchCandidate from './sections/search-candidate';
import RequestFormCard from './sections/request-form-card';
import { RequestStatus } from '@/constants/request-status';
import ConfirmModal from '@/components/modal/confirm-modal';
import { useAuthContext } from '@/auth/hooks/useAuthContext';
import { exportRequestXlsx } from './sections/export-request';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { enumToArray, getRequestStatusText } from '@/utils/enum';
import DocumentScanner from '@mui/icons-material/DocumentScanner';
import ChangeRequestStatus from './sections/change-request-status';
import FiberManualRecord from '@mui/icons-material/FiberManualRecord';
import PublishedWithChanges from '@mui/icons-material/PublishedWithChanges';
import { useTableFilter } from '@/components/mrt-table/hooks/useTableFilter';
import { useLiveTableQuery } from '@/components/mrt-table/hooks/useLiveTableQuery';
import { getRequestsApi, useAllowRequestApi, ALL_REQUEST_QUERY_KEY } from '@/api/useRequestApi';

type ReqStatus = keyof typeof RequestStatus | 'all';
type ReqList = 'all' | 'my' | 'external';

export default function RequestsPage() {
  const { push } = useRouter();
  const reqModal = useBoolean();
  const searchModal = useBoolean();
  const { user } = useAuthContext();
  const allowReqModal = useBoolean();
  const tableFilter = useTableFilter();
  const changeStatusModal = useBoolean();
  const requestFormCardModal = useBoolean();
  const { enqueueSnackbar } = useSnackbar();
  const [reqList, setReqList] = useState<ReqList>('all');
  const [status, setStatus] = useState<ReqStatus>('all');
  const [selectedRequest, setSelectedRequest] = useState<IRequest>();
  const { mutateAsync: allowRequest, isPending: allowLoading } = useAllowRequestApi();
  const queryData = useLiveTableQuery({ tableFilter, queryFn: getRequestsApi, queryKey: ALL_REQUEST_QUERY_KEY });

  const changeStatus = (value: ReqStatus) => {
    setStatus(value);

    const filters = tableFilter.columnFilters.filter((x) => x.id !== 'status');

    if (value !== 'all') {
      tableFilter.setColumnFilters([...filters, { id: 'status', value }]);
    } else {
      tableFilter.setColumnFilters(filters);
    }
  };

  const changeReqList = (value: ReqList) => {
    setReqList(value);

    if (value === 'external') {
      tableFilter.setColumnFilters([{ id: 'isExternal', value: 'true' }]);
      setStatus('all');
      return;
    }

    const filters = tableFilter.columnFilters.filter((x) => x.id !== 'isExternal' && x.id !== 'userId');

    if (value === 'my') {
      tableFilter.setColumnFilters([...filters, { id: 'userId', value: user?.id }]);
    } else {
      tableFilter.setColumnFilters(filters);
    }
  };

  const checkOwner = (userId?: number) => {
    if (user?.role === UserRoles.admin) return true;
    return user?.id === userId;
  };

  const handleAllowReqModal = () => {
    if (selectedRequest) {
      allowRequest(selectedRequest.id, {
        onSuccess() {
          enqueueSnackbar('Talep Onaylandı');
          allowReqModal.setFalse();
        },
        onError(error) {
          enqueueSnackbar(error.message, { variant: 'error' });
        },
      });
    }
  };

  return (
    <>
      <RequestsTable
        enableCellActions
        queryData={queryData}
        tableFilter={tableFilter}
        renderBottomToolbarCustomActions={() => {
          return (
            <Stack>
              <Box display="flex" alignItems="center" gap={2}>
                <FiberManualRecord color="error" fontSize={'medium'} />
                <Typography variant="inherit">Dış Talep</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <FiberManualRecord color="success" fontSize={'medium'} />
                <Typography variant="inherit">Normal Talep</Typography>
              </Box>
            </Stack>
          );
        }}
        renderTopToolbarCustomActions={() => (
          <Box display="flex" gap={2} alignItems="center" py={0.5}>
            <Button
              variant="outlined"
              startIcon={<HistoryEdu />}
              sx={{ textTransform: 'none' }}
              onClick={() => {
                setSelectedRequest(undefined);
                reqModal.setTrue();
              }}
            >
              Yeni Talep Formu
            </Button>
            <Button
              onClick={() => {
                if (queryData.data) {
                  exportRequestXlsx(queryData.data.results);
                }
              }}
              variant="outlined"
              sx={{ textTransform: 'none' }}
              startIcon={<FileDownloadIcon />}
            >
              Tabloyu Dışarı Aktar
            </Button>

            <FormControl size="small" sx={{ minWidth: 240 }}>
              <InputLabel>Talep Durumu</InputLabel>
              <Select
                label="Talep Durumu"
                value={status}
                onChange={(e) => {
                  changeStatus(e.target.value as any);
                }}
              >
                <MenuItem value="all">Tümü</MenuItem>
                {enumToArray(RequestStatus).map((x) => (
                  <MenuItem key={x} value={x}>
                    {getRequestStatusText(x)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 240 }}>
              <InputLabel>Talep Listesi</InputLabel>
              <Select
                label="Talep Listesi"
                value={reqList}
                onChange={(e) => {
                  changeReqList(e.target.value as any);
                }}
              >
                <MenuItem value="all">Tümü</MenuItem>
                <MenuItem value="my">Benim Taleplerim</MenuItem>
                <MenuItem value="external">Dış Talepler (E-Posta)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
        muiTableBodyCellProps={({ row }) => ({
          align: 'center',
          sx: { borderLeft: '1px solid #CFDAE6' },
          onDoubleClick() {
            setSelectedRequest(row.original);
            requestFormCardModal.setTrue();
          },
        })}
        renderCellActionMenuItems={({ closeMenu, row, table }) => [
          <MRT_ActionMenuItem
            key={0}
            icon={<Edit />}
            label="Düzenle"
            table={table}
            disabled={!checkOwner(row.original.user?.id)}
            onClick={() => {
              closeMenu();
              reqModal.setTrue();
              setSelectedRequest(row.original);
            }}
          />,
          <MRT_ActionMenuItem
            onClick={() => {
              searchModal.setTrue();
              setSelectedRequest(row.original);
              closeMenu();
            }}
            disabled={!checkOwner(row.original.user?.id)}
            icon={<PersonAdd />}
            label="Aday Ekle"
            table={table}
            key={2}
          />,
          <MRT_ActionMenuItem
            onClick={() => {
              push(`${paths.request}/${row.original.id}`);
              closeMenu();
            }}
            icon={<DocumentScanner />}
            label="Detaylar"
            table={table}
            key={1}
          />,
          <MRT_ActionMenuItem
            onClick={() => {
              setSelectedRequest(row.original);
              requestFormCardModal.setTrue();
              closeMenu();
            }}
            icon={<HistoryEdu />}
            label="Talep Kartı Görüntüle"
            table={table}
            key={3}
          />,
          <MRT_ActionMenuItem
            onClick={() => {
              changeStatusModal.setTrue();
              setSelectedRequest(row.original);
              closeMenu();
            }}
            key={4}
            disabled={!checkOwner(row.original.user?.id)}
            table={table}
            label="Talep Durumu Değiştir"
            icon={<PublishedWithChanges />}
          />,
          <MRT_ActionMenuItem
            onClick={() => {
              setSelectedRequest(row.original);
              allowReqModal.setTrue();
              closeMenu();
            }}
            key={7}
            table={table}
            icon={<TaskAlt />}
            label="Dış Talebi Onayla"
            disabled={user?.role !== UserRoles.admin || !row.original.isExternal}
          />,
          <Divider key={6} />,
          <MRT_ActionMenuItem
            onClick={() => {
              closeMenu();
            }}
            disabled={!checkOwner(row.original.user?.id)}
            icon={<Delete color="error" />}
            label="Sil"
            table={table}
            key={5}
            sx={{ color: 'error.main' }}
          />,
        ]}
      />

      <BaseModal open={reqModal.value} onClose={reqModal.setFalse} title="Talep Formu">
        <RequestForm request={selectedRequest} onSuccess={reqModal.setFalse} />
      </BaseModal>

      <BaseModal
        title="Aday Ara"
        maxWidth="sm"
        PaperProps={{
          sx: { height: '70vh' },
        }}
        open={searchModal.value}
        onClose={searchModal.setFalse}
      >
        <SearchCandidate requestId={selectedRequest?.id} />
      </BaseModal>

      <BaseModal open={requestFormCardModal.value} onClose={requestFormCardModal.setFalse} title="Talep Kartı">
        {selectedRequest && <RequestFormCard data={selectedRequest} printable />}
      </BaseModal>

      <BaseModal
        maxWidth="sm"
        open={changeStatusModal.value}
        title="Talep Durumu Değiştir"
        onClose={changeStatusModal.setFalse}
      >
        <ChangeRequestStatus request={selectedRequest} onSuccess={changeStatusModal.setFalse} />
      </BaseModal>

      <ConfirmModal
        cancelLabel="İptal"
        acceptLabel="Onayla"
        title="Talebi Onayla"
        loading={allowLoading}
        open={allowReqModal.value}
        onAccept={handleAllowReqModal}
        onCancel={allowReqModal.setFalse}
      >
        Bu talep e-posta ile oluşturulmuş dış taleptir.
        <br />
        Talebi onaylamak istiyor musunuz ?
      </ConfirmModal>
    </>
  );
}
