'use client';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useMemo, useState } from 'react';
import { ICompany } from '@/types/ICompany';
import Edit from '@mui/icons-material/Edit';
import { enqueueSnackbar } from 'notistack';
import { useBoolean } from '@/hooks/useBoolean';
import CompanyForm from './_forms/company-form';
import { fDatetime } from '@/utils/format-time';
import Typography from '@mui/material/Typography';
import LiveMRTTable from '@/components/mrt-table';
import BaseModal from '@/components/modal/base-modal';
import { UserRoles } from '@/constants/user-roles.enum';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ConfirmModal from '@/components/modal/confirm-modal';
import { useAuthContext } from '@/auth/hooks/useAuthContext';
import CompanyContractForm from './_forms/company-contract-form';
import SendTimeExtension from '@mui/icons-material/SendTimeExtension';
import { RowActionItem } from '@/components/mrt-table/row-action-item';
import WorkOutlineOutlined from '@mui/icons-material/WorkOutlineOutlined';
import { MRT_ColumnDef, MRT_RowSelectionState } from 'material-react-table';
import { useTableFilter } from '@/components/mrt-table/hooks/useTableFilter';
import { useLiveTableQuery } from '@/components/mrt-table/hooks/useLiveTableQuery';
import { getCompaniesApi, COMPANY_QUERY_KEY, sendRequestFormApi } from '@/api/useCompanyApi';

// TODO: Silme işlemleri gerçekleştirilecek
export default function CompanyTable() {
  // Boolean
  const companyModal = useBoolean();
  const contractModal = useBoolean();
  const sendMailModal = useBoolean();

  const { user } = useAuthContext();
  const tableFilter = useTableFilter();
  const isAdminUser = user?.role === UserRoles.admin;
  const [company, setCompany] = useState<ICompany>();
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const queryData = useLiveTableQuery({ tableFilter, queryFn: getCompaniesApi, queryKey: COMPANY_QUERY_KEY });

  const columns = useMemo<MRT_ColumnDef<ICompany>[]>(
    () => [
      {
        size: 120,
        header: '#No',
        accessorKey: 'id',
        enableResizing: false,
        muiFilterTextFieldProps: {
          type: 'number',
        },
        accessorFn(originalRow) {
          return `#${originalRow.id}`;
        },
      },
      {
        accessorKey: 'name',
        header: 'Firma Adı',
      },
      {
        accessorKey: 'sector',
        header: 'Sektör',
      },
      {
        accessorKey: 'email',
        header: 'Yetkili E-Posta',
        filterVariant: 'autocomplete',
        filterSelectOptions: [{ value: 'null', label: 'Bilgi yok' }],
      },
      {
        header: 'Konum',
        accessorKey: 'location',
        filterVariant: 'autocomplete',
        filterSelectOptions: [{ value: 'null', label: 'Bilgi yok' }],
      },
      {
        header: 'Açık Adres',
        accessorKey: 'address',
        filterVariant: 'autocomplete',
        filterSelectOptions: [{ value: 'null', label: 'Bilgi yok' }],
      },
      {
        header: 'Açıklama',
        enableSorting: false,
        accessorKey: 'description',
        filterVariant: 'autocomplete',
        filterSelectOptions: [{ value: 'null', label: 'Bilgi yok' }],
      },
      {
        header: 'Sözleşmeler',
        Cell({ row }) {
          const len = row.original.contracts.length;
          if (!len) {
            return (
              <Typography variant="inherit" color="warning.main">
                Sözleşme yok
              </Typography>
            );
          }
          return (
            <Typography variant="inherit" color="success.main">
              {len} adet sözleşme
            </Typography>
          );
        },
      },
      {
        header: 'Kayıt Tarihi',
        accessorKey: 'createdAt',
        enableColumnFilter: false,
        accessorFn(originalRow) {
          return fDatetime(originalRow.createdAt);
        },
      },
    ],
    []
  );

  const handleSuccessForm = (value: ICompany) => {
    setCompany(value);
    companyModal.setFalse();
  };

  const handleSendEmailForm = async () => {
    try {
      const ids = Object.keys(rowSelection);
      await sendRequestFormApi(ids);
      enqueueSnackbar('Formlar gönderildi');
      sendMailModal.setFalse();
    } catch (error) {
      const err = error as Error;
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  };

  return (
    <>
      <LiveMRTTable
        enableCellActions={isAdminUser}
        onRowSelectionChange={setRowSelection}
        enableRowSelection={(row) => Boolean(row.original.email)}
        renderTopToolbarCustomActions={() => {
          return (
            <Stack gap={2} flexDirection="row">
              {isAdminUser && (
                <Button
                  variant="outlined"
                  sx={{ textTransform: 'none' }}
                  startIcon={<WorkOutlineOutlined />}
                  onClick={() => {
                    setCompany(undefined);
                    companyModal.setTrue();
                  }}
                >
                  Firma Ekle
                </Button>
              )}
              <Button
                variant="outlined"
                sx={{ textTransform: 'none' }}
                startIcon={<SendTimeExtension />}
                onClick={() => {
                  sendMailModal.setTrue();
                }}
                disabled={!Object.keys(rowSelection).length}
              >
                Talep Formu Gönder
              </Button>
            </Stack>
          );
        }}
        renderCellActionMenuItems={({ closeMenu, row }) => [
          <RowActionItem
            key={0}
            label="Düzenle"
            icon={<Edit />}
            onClick={() => {
              setCompany(row.original);
              companyModal.setTrue();
              closeMenu();
            }}
          />,
          <RowActionItem
            key={1}
            label="Sözleşmeler"
            icon={<AssignmentIcon />}
            onClick={() => {
              setCompany(row.original);
              contractModal.setTrue();
              closeMenu();
            }}
          />,
        ]}
        state={{
          rowSelection,
        }}
        columns={columns}
        queryData={queryData}
        tableFilter={tableFilter}
        positionToolbarAlertBanner="bottom"
      />

      {isAdminUser && (
        <BaseModal open={companyModal.value} title="Firma Hakkında" onClose={companyModal.setFalse}>
          <CompanyForm company={company} onSuccessForm={handleSuccessForm} />
        </BaseModal>
      )}

      <BaseModal open={contractModal.value} title="Sözleşmeler" onClose={contractModal.setFalse}>
        <CompanyContractForm company={company} onSuccessForm={handleSuccessForm} />
      </BaseModal>

      <ConfirmModal
        open={sendMailModal.value}
        acceptLabel="Gönder"
        cancelLabel="İptal"
        onAccept={handleSendEmailForm}
        onCancel={sendMailModal.setFalse}
        title="Talep formu gönder"
      >
        <Typography>
          Seçilen firmaların tümüne talep formu gönderilecek
          <br />
          Onaylıyor musunuz ?
        </Typography>
      </ConfirmModal>
    </>
  );
}
