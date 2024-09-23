'use client';

import { IUser } from '@/types/IUser';
import { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Edit from '@mui/icons-material/Edit';
import UserForm from './sections/user-form';
import { enqueueSnackbar } from 'notistack';
import Delete from '@mui/icons-material/Delete';
import { fDatetime } from '@/utils/format-time';
import { useBoolean } from '@/hooks/useBoolean';
import Typography from '@mui/material/Typography';
import LiveMRTTable from '@/components/mrt-table';
import { MRT_ColumnDef } from 'material-react-table';
import BaseModal from '@/components/modal/base-modal';
import { UserRoles } from '@/constants/user-roles.enum';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ConfirmModal from '@/components/modal/confirm-modal';
import { enumToArray, getUserRoleText } from '@/utils/enum';
import { useAuthContext } from '@/auth/hooks/useAuthContext';
import { RowActionItem } from '@/components/mrt-table/row-action-item';
import { useTableFilter } from '@/components/mrt-table/hooks/useTableFilter';
import { getUsersAPI, USER_QUERY_KEY, useDeleteUserAPI } from '@/api/useUserApi';
import { useLiveTableQuery } from '@/components/mrt-table/hooks/useLiveTableQuery';

export default function UserTable() {
  const userModal = useBoolean();
  const deleteModal = useBoolean();
  const { user } = useAuthContext();
  const [userData, setUserData] = useState<IUser>();
  const { mutateAsync: deleteUser, isPending: deleteLoading } = useDeleteUserAPI();

  const tableFilter = useTableFilter();
  const queryData = useLiveTableQuery({ queryFn: getUsersAPI, queryKey: USER_QUERY_KEY, tableFilter });

  const columns = useMemo<Array<MRT_ColumnDef<IUser>>>(
    () => [
      {
        size: 120,
        header: '#No',
        accessorKey: 'id',
        muiTableHeadCellFilterTextFieldProps: {
          type: 'number',
        },
        accessorFn(originalRow) {
          return `#${originalRow.id}`;
        },
      },
      {
        header: 'Ad Soyad',
        accessorKey: 'name',
      },
      {
        header: 'Email',
        accessorKey: 'email',
      },
      {
        header: 'Telefon',
        accessorKey: 'phone',
        enableSorting: false,
      },
      {
        header: 'Rol',
        accessorKey: 'role',
        filterVariant: 'select',
        accessorFn(originalRow) {
          return getUserRoleText(originalRow.role);
        },
        filterSelectOptions: enumToArray(UserRoles).map((x) => ({ value: x, label: getUserRoleText(x) })),
      },
      {
        header: 'Erişim',
        accessorKey: 'isActive',
        filterVariant: 'select',
        filterSelectOptions: [
          { value: 'true', label: 'Var' },
          { value: 'false', label: 'Yok' },
        ],
        accessorFn(originalRow) {
          return originalRow.isActive ? 'Var' : 'Yok';
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
      {
        header: 'Son Giriş',
        accessorKey: 'lastLogin',
        enableColumnFilter: false,
        accessorFn(originalRow) {
          return fDatetime(originalRow.createdAt);
        },
      },
    ],
    []
  );

  const handleDeleteUser = () => {
    if (userData) {
      deleteUser(userData.id, {
        onSuccess() {
          enqueueSnackbar('Kullanıcı silindi');
          deleteModal.setFalse();
        },
        onError(error) {
          enqueueSnackbar(error.message, { variant: 'error' });
          deleteModal.setFalse();
        },
      });
    }
  };

  return (
    <>
      <LiveMRTTable
        enableColumnResizing={false}
        enableCellActions={user?.role === UserRoles.admin}
        renderTopToolbarCustomActions={() => {
          if (user?.role !== UserRoles.admin) return null;

          return (
            <Button
              variant="outlined"
              sx={{ textTransform: 'none' }}
              startIcon={<PersonAddIcon />}
              onClick={() => {
                setUserData(undefined);
                userModal.setTrue();
              }}
            >
              Kullanıcı Ekle
            </Button>
          );
        }}
        renderCellActionMenuItems={({ row, closeMenu }) => [
          <RowActionItem
            key={0}
            label="Düzenle"
            icon={<Edit />}
            onClick={() => {
              setUserData(row.original);
              userModal.setTrue();
              closeMenu();
            }}
          />,
          <Divider key={3} />,
          <RowActionItem
            key={1}
            label="Sil"
            icon={<Delete />}
            color="error.main"
            onClick={() => {
              setUserData(row.original);
              deleteModal.setTrue();
              closeMenu();
            }}
          />,
        ]}
        columns={columns}
        queryData={queryData}
        tableFilter={tableFilter}
      />

      {user?.role === UserRoles.admin && (
        <>
          <BaseModal onClose={userModal.setFalse} open={userModal.value} title="Kullanıcı">
            <UserForm user={userData} onSuccess={userModal.setFalse} />
          </BaseModal>

          <ConfirmModal
            reverseColor
            acceptLabel="Sil"
            cancelLabel="İptal"
            title="Kullanıcıyı Sil"
            loading={deleteLoading}
            open={deleteModal.value}
            onAccept={handleDeleteUser}
            onCancel={deleteModal.setFalse}
          >
            <Typography variant="inherit">
              Bu kullanıcıyı gerçekten silmek istiyor musunuz ? <br />
              <strong>İşleme devam ederseniz kullanıcının yaptığı işlemler sistemde görüntülenemeyecek.</strong>
              <br />
              Devam edilsin mi ?
            </Typography>
          </ConfirmModal>
        </>
      )}
    </>
  );
}
