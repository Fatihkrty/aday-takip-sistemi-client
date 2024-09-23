'use client';

import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Edit from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import Delete from '@mui/icons-material/Delete';
import { fDatetime } from '@/utils/format-time';
import { useBoolean } from '@/hooks/useBoolean';
import LiveMRTTable from '@/components/mrt-table';
import { getCandidateStatusText } from '@/utils/enum';
import BaseModal from '@/components/modal/base-modal';
import ConfirmModal from '@/components/modal/confirm-modal';
import { IReferral, IReferralForm } from '@/types/IReferral';
import GetRequestInfo from '../../(common)/referral/get-request-info';
import { MRT_ColumnDef, MRT_ActionMenuItem } from 'material-react-table';
import GetCandidateInfo from '../../(common)/referral/get-candidate-info';
import { useTableFilter } from '@/components/mrt-table/hooks/useTableFilter';
import { useLiveTableQuery } from '@/components/mrt-table/hooks/useLiveTableQuery';
import UpdateCandidateStatus from '../../(common)/referral/update-candidate-status';
import { getReferralsApi, REFERRAL_QUERY_KEY, useDeleteReferralApi } from '@/api/useReferralApi';

export default function ReferralsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const deleteModal = useBoolean();
  const tableFilter = useTableFilter();
  const [requestId, setRequestId] = useState<number>();
  const [referralId, setReferralId] = useState<number>();
  const [candidateId, setCandidateId] = useState<number>();
  const [selectedReferral, setSelecetedReferral] = useState<IReferralForm>();
  const { mutateAsync: deleteReferral, isPending: deleteLoading } = useDeleteReferralApi();
  const queryData = useLiveTableQuery({ tableFilter, queryFn: getReferralsApi, queryKey: REFERRAL_QUERY_KEY });

  const columns = useMemo<Array<MRT_ColumnDef<IReferral>>>(
    () => [
      {
        header: 'Aday Bilgileri',
        columns: [
          {
            header: 'Aday No',
            accessorKey: 'candidate.id',
            accessorFn(originalRow) {
              return `#${originalRow.candidate.id}`;
            },
            Cell({ renderedCellValue, row }) {
              return (
                <Button
                  onClick={() => setCandidateId(row.original.candidate.id)}
                  variant="outlined"
                  sx={{ textTransform: 'none' }}
                  size="small"
                  color="success"
                >
                  {renderedCellValue}
                </Button>
              );
            },
          },
          {
            header: 'Ad Soyad',
            accessorKey: 'candidate.name',
          },
          {
            header: 'Email',
            accessorKey: 'candidate.email',
          },
          {
            header: 'Telefon',
            accessorKey: 'candidate.phone',
          },
          {
            header: 'Pozisyonlar',
            accessorKey: 'positions',
            accessorFn(originalRow) {
              if (!originalRow.candidate.positions.length) return null;
              return originalRow.candidate.positions.map((x) => x.position.name).join(', ');
            },
          },
        ],
      },
      {
        header: 'Talep Bilgileri',
        columns: [
          {
            header: 'Talep No',
            accessorKey: 'request.id',
            accessorFn(originalRow) {
              return `#${originalRow.request.id}`;
            },
            Cell({ renderedCellValue, row }) {
              return (
                <Button
                  onClick={() => setRequestId(row.original.request.id)}
                  variant="outlined"
                  sx={{ textTransform: 'none' }}
                  size="small"
                  color="success"
                >
                  {renderedCellValue}
                </Button>
              );
            },
          },
          {
            header: 'Firma Adı',
            accessorKey: 'request.company.name',
          },
          {
            header: 'Firma Lokasyon',
            accessorKey: 'request.company.location',
          },
          {
            header: 'Talep Edilen Pers.',
            accessorKey: 'request.workerReqCount',
          },
          {
            header: 'Talep Kapanış',
            accessorKey: 'request.closedAt',
          },
        ],
      },
      {
        header: 'Yönlendirme Bilgileri',
        columns: [
          {
            header: 'Yönlendirme No',
            accessorKey: 'id',
            accessorFn(originalRow) {
              return `#${originalRow.id}`;
            },
          },

          {
            header: 'Durum',
            accessorFn(originalRow) {
              return getCandidateStatusText(originalRow.status);
            },
          },
          {
            header: 'Açıklama',
            accessorKey: 'description',
          },
          {
            header: 'Yönlendirme Tarihi',
            accessorFn(originalRow) {
              return fDatetime(originalRow.createdAt);
            },
          },
        ],
      },
    ],
    []
  );

  const handleDeleteReferral = () => {
    if (referralId) {
      deleteReferral(referralId, {
        onSuccess() {
          enqueueSnackbar('Yönlendirme silindi');
          queryData.refetch();
          deleteModal.setFalse();
        },
        onError(error) {
          enqueueSnackbar(error.message, { variant: 'error' });
        },
      });
    }
  };

  return (
    <>
      <LiveMRTTable
        enableCellActions
        enableSorting={false}
        enableColumnFilters={false}
        renderCellActionMenuItems={({ table, row, closeMenu }) => [
          <MRT_ActionMenuItem
            onClick={() => {
              setSelecetedReferral({
                candidateId: row.original.candidateId,
                requestId: row.original.requestId,
                description: row.original.description,
                status: row.original.status,
                id: row.original.id,
              });
              closeMenu();
            }}
            key={2}
            icon={<Edit />}
            label="Düzenle"
            table={table}
          />,
          <Divider key={1} />,
          <MRT_ActionMenuItem
            key={0}
            label="Sil"
            table={table}
            onClick={() => {
              setReferralId(row.original.id);
              closeMenu();
              deleteModal.setTrue();
            }}
            sx={{ color: 'error.main' }}
            icon={<Delete color="error" />}
          />,
        ]}
        columns={columns}
        queryData={queryData}
        tableFilter={tableFilter}
      />

      <BaseModal open={!!candidateId} onClose={() => setCandidateId(undefined)} title="Aday Kartı">
        {candidateId && <GetCandidateInfo id={candidateId} />}
      </BaseModal>

      <BaseModal open={!!requestId} onClose={() => setRequestId(undefined)} title="Aday Kartı">
        {requestId && <GetRequestInfo id={requestId} />}
      </BaseModal>

      <BaseModal open={!!selectedReferral} onClose={() => setSelecetedReferral(undefined)} title="Yönlendirme">
        <UpdateCandidateStatus
          referral={selectedReferral}
          onSuccessUpdate={() => {
            queryData.refetch();
            setSelecetedReferral(undefined);
          }}
        />
      </BaseModal>

      <ConfirmModal
        open={deleteModal.value}
        title="Yönlendirmeyi sil"
        acceptLabel="Sil"
        cancelLabel="İptal"
        onAccept={handleDeleteReferral}
        onCancel={deleteModal.setFalse}
        loading={deleteLoading}
        reverseColor
      >
        Yönlendirme silinecek. Devam edilsin mi ?
      </ConfirmModal>
    </>
  );
}
