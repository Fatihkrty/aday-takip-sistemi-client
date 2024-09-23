'use client';

import Box from '@mui/material/Box';
import { useSnackbar } from 'notistack';
import Button from '@mui/material/Button';
import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Delete from '@mui/icons-material/Delete';
import { fDatetime } from '@/utils/format-time';
import { useBoolean } from '@/hooks/useBoolean';
import GetRequestInfo from './get-request-info';
import PostAdd from '@mui/icons-material/PostAdd';
import Typography from '@mui/material/Typography';
import GetCandidateInfo from './get-candidate-info';
import Autorenew from '@mui/icons-material/Autorenew';
import BaseModal from '@/components/modal/base-modal';
import { getCandidateStatusText } from '@/utils/enum';
import PersonAddAlt from '@mui/icons-material/PersonAddAlt';
import ConfirmModal from '@/components/modal/confirm-modal';
import { useDeleteReferralApi } from '@/api/useReferralApi';
import { IReferral, IReferralForm } from '@/types/IReferral';
import UpdateCandidateStatus from './update-candidate-status';
import OfflineMRTTable from '@/components/mrt-table/OfflineMRTTable';
import { MRT_ColumnDef, MRT_ActionMenuItem } from 'material-react-table';

interface Props {
  referrals: IReferral[];
  onSuccessDelete?: () => void;
  onSuccessUpdate?: () => void;
  showRequestColumn?: boolean;
  showCandidateColumn?: boolean;
  enableActions?: boolean;
}

export default function ReferralTable({
  referrals,
  onSuccessDelete,
  onSuccessUpdate,
  showRequestColumn,
  showCandidateColumn,
  enableActions,
}: Props) {
  const deleteModal = useBoolean();
  const changeStatusModal = useBoolean();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams<{ id: string }>();
  const { mutateAsync: deleteReferral, isPending: deleteLoading } = useDeleteReferralApi();

  const [selectedReferral, setSelectedReferral] = useState<IReferralForm>();
  const [selectedReqId, setSelectedReqId] = useState<number | null>(null);
  const [selectedCanidateId, setSelectedCandidateId] = useState<number | null>(null);

  const columns = useMemo<Array<MRT_ColumnDef<IReferral>>>(() => {
    const arr: Array<MRT_ColumnDef<IReferral>> = [
      {
        header: 'Yönlendirme No',
        accessorKey: 'id',
        accessorFn(originalRow) {
          return `#${originalRow.id}`;
        },
      },
      {
        header: 'Durumu',
        accessorKey: 'status',
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
        accessorKey: 'createdAt',
        accessorFn(originalRow) {
          return fDatetime(originalRow.createdAt);
        },
      },
    ];

    if (showCandidateColumn) {
      arr.push({
        header: 'Aday No',
        accessorKey: 'candidateId',
        accessorFn(originalRow) {
          return (
            <Button
              size="small"
              color="success"
              variant="outlined"
              sx={{ textTransform: 'none' }}
              onClick={() => setSelectedCandidateId(originalRow.candidateId)}
            >
              #{originalRow.candidateId} (Görüntüle)
            </Button>
          );
        },
      });
    }

    if (showRequestColumn) {
      arr.push({
        header: 'Talep No',
        accessorKey: 'requestId',
        accessorFn(originalRow) {
          return (
            <Button
              size="small"
              color="success"
              variant="outlined"
              sx={{ textTransform: 'none' }}
              onClick={() => setSelectedReqId(originalRow.requestId)}
            >
              #{originalRow.requestId} (Görüntüle)
            </Button>
          );
        },
      });
    }

    return arr;
  }, [showCandidateColumn, showRequestColumn]);

  const handleUpdateReferral = () => {
    onSuccessUpdate?.();
    changeStatusModal.setFalse();
  };

  const handleDeleteReferral = async () => {
    if (selectedReferral?.id) {
      deleteReferral(selectedReferral.id, {
        onSuccess() {
          enqueueSnackbar('Yönlendirme silindi');
          onSuccessDelete?.();
          deleteModal.setFalse();
        },
        onError(error) {
          enqueueSnackbar(error.message, { variant: 'error' });
        },
      });
    }
  };

  return (
    <Box sx={{ paddingBottom: 5 }}>
      <OfflineMRTTable
        columns={columns}
        data={referrals}
        enableColumnFilters={false}
        enableCellActions={enableActions}
        renderTopToolbarCustomActions={() => (
          <Box display="flex" gap={2} py={1}>
            {showCandidateColumn && enableActions && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setSelectedReferral({
                    requestId: parseInt(params.id),
                  });
                  changeStatusModal.setTrue();
                }}
                startIcon={<PersonAddAlt />}
                sx={{ textTransform: 'none' }}
              >
                Yeni Aday Ekle
              </Button>
            )}
            {showRequestColumn && enableActions && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<PostAdd />}
                onClick={() => {
                  setSelectedReferral({ candidateId: parseInt(params.id) });
                  changeStatusModal.setTrue();
                }}
                sx={{ textTransform: 'none' }}
              >
                Yeni Talep Ekle
              </Button>
            )}
          </Box>
        )}
        renderCellActionMenuItems={({ row, table, closeMenu }) => [
          <MRT_ActionMenuItem
            key={0}
            icon={<Autorenew />}
            label="Durum Değiştir"
            onClick={() => {
              closeMenu();
              changeStatusModal.setTrue();
              setSelectedReferral(row.original);
            }}
            table={table}
          />,
          <MRT_ActionMenuItem
            key={1}
            label="Sil"
            table={table}
            onClick={() => {
              closeMenu();
              deleteModal.setTrue();
              setSelectedReferral(row.original);
            }}
            sx={{ color: 'error.main' }}
            icon={<Delete color="error" />}
          />,
        ]}
      />

      {showRequestColumn && (
        <BaseModal open={!!selectedReqId} onClose={() => setSelectedReqId(null)} title="Talep Kartı">
          {selectedReqId && (
            <Box>
              <GetRequestInfo id={selectedReqId} />
            </Box>
          )}
        </BaseModal>
      )}

      {showCandidateColumn && (
        <BaseModal open={!!selectedCanidateId} onClose={() => setSelectedCandidateId(null)} title="Aday Kartı">
          {selectedCanidateId && (
            <Box>
              <GetCandidateInfo id={selectedCanidateId} />
            </Box>
          )}
        </BaseModal>
      )}

      <BaseModal
        maxWidth="sm"
        title="Yönlendirmeler"
        open={changeStatusModal.value}
        onClose={changeStatusModal.setFalse}
      >
        <UpdateCandidateStatus referral={selectedReferral} onSuccessUpdate={handleUpdateReferral} />
      </BaseModal>

      <ConfirmModal
        reverseColor
        title="Durumu Sil"
        acceptLabel="Sil"
        cancelLabel="İptal"
        loading={deleteLoading}
        open={deleteModal.value}
        onCancel={deleteModal.setFalse}
        onAccept={handleDeleteReferral}
      >
        <Typography>Yönlendirmeyi silmek istiyor musunuz ?</Typography>
      </ConfirmModal>
    </Box>
  );
}
