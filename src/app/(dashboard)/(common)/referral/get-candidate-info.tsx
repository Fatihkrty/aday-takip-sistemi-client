import Alert from '@mui/material/Alert';
import { useGetCandidateApi } from '@/api/useCandidateApi';
import LoadingScreen from '@/components/loading/loading-screen';
import CandidateFormCard from '../../adaylar/_sections/canidate-form-card';

export default function GetCandidateInfo({ id }: { id: number }) {
  const { data, isLoading, error, isSuccess } = useGetCandidateApi(id);

  if (isLoading) {
    return <LoadingScreen sx={{ my: 5 }} />;
  }

  if (error) {
    return (
      <Alert sx={{ p: 8, m: 4, justifyContent: 'center' }} severity="warning">
        Veriler yüklenirken bir hata oluştu
      </Alert>
    );
  }

  return isSuccess && <CandidateFormCard data={data} printable />;
}
