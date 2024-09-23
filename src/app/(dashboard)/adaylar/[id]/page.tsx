'use client';

import Alert from '@mui/material/Alert';
import { useParams } from 'next/navigation';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useGetCandidateApi } from '@/api/useCandidateApi';
import LoadingScreen from '@/components/loading/loading-screen';
import CandidateFormCard from '../_sections/canidate-form-card';
import ReferralTable from '../../(common)/referral/referral-table';

export default function OneCandidatePage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, isSuccess, error, refetch } = useGetCandidateApi(params.id);

  if (isLoading) {
    return <LoadingScreen sx={{ mt: 10 }} />;
  }

  if (error) {
    return (
      <Alert sx={{ p: 8, justifyContent: 'center', fontSize: 16 }} severity="warning">
        Veriler yüklenirken bir hata oluştu
      </Alert>
    );
  }

  return (
    isSuccess && (
      <Container maxWidth={false}>
        <CandidateFormCard data={data} printable showBackPage />

        <Typography variant="h5" fontSize="bold" pl={1} pb={1} pt={3}>
          Talep Geçmişi
        </Typography>

        <ReferralTable
          showRequestColumn
          onSuccessUpdate={refetch}
          onSuccessDelete={refetch}
          referrals={data.referrals}
          enableActions={false}
        />
      </Container>
    )
  );
}
