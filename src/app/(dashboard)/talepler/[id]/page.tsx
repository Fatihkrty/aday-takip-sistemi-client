'use client';

import Alert from '@mui/material/Alert';
import { useParams } from 'next/navigation';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useGetRequestApi } from '@/api/useRequestApi';
import { UserRoles } from '@/constants/user-roles.enum';
import RequestFormCard from '../sections/request-form-card';
import { useAuthContext } from '@/auth/hooks/useAuthContext';
import LoadingScreen from '@/components/loading/loading-screen';
import ReferralTable from '../../(common)/referral/referral-table';

export default function OneRequestPage() {
  const { user } = useAuthContext();
  const params = useParams<{ id: string }>();
  const { data, isLoading, isSuccess, error, refetch } = useGetRequestApi(params.id);

  if (isLoading) {
    return <LoadingScreen sx={{ mt: 20 }} />;
  }

  if (error) {
    return (
      <Alert sx={{ p: 8, justifyContent: 'center', fontSize: 16 }} severity="warning">
        Veriler yüklenirken bir hata oluştu
      </Alert>
    );
  }

  const isEnableAction = user?.role === UserRoles.admin || user?.id === data?.user?.id;

  return (
    isSuccess && (
      <Container maxWidth={false}>
        <RequestFormCard data={data} printable showBackPage />

        <Typography variant="h5" fontSize="bold" pl={1} pb={1} pt={3}>
          Aday Geçmişi
        </Typography>

        <ReferralTable
          showCandidateColumn
          referrals={data.referrals}
          onSuccessUpdate={refetch}
          onSuccessDelete={refetch}
          enableActions={isEnableAction}
        />
      </Container>
    )
  );
}
