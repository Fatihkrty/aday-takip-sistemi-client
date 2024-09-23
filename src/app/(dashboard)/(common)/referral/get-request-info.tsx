import Alert from '@mui/material/Alert';
import { useQuery } from '@tanstack/react-query';
import { useGetRequestApi } from '@/api/useRequestApi';
import LoadingScreen from '@/components/loading/loading-screen';
import RequestFormCard from '../../talepler/sections/request-form-card';

interface Props {
  id: number;
}

export default function GetRequestInfo({ id }: Props) {
  const {} = useQuery({ queryKey: ['GET_REQUEST_INFO', id] });
  const { data, isLoading, error, isSuccess } = useGetRequestApi(id);

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

  return isSuccess && <RequestFormCard data={data} printable />;
}
