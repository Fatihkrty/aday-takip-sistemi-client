'use client';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import LoadingScreen from '@/components/loading/loading-screen';
import ExternalRequestForm from '../_sections/external-request-form';
import { getExternalRequestWithCode } from '@/api/useExternalRequestApi';

export default function ExternalRequestFormPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const params = useParams<{ code: string }>();

  const getExternalRequest = useCallback(async () => {
    setError(undefined);
    setLoading(true);
    try {
      await getExternalRequestWithCode(params.code);
    } catch (error) {
      setError((error as any).message);
    } finally {
      setLoading(false);
    }
  }, [params.code]);

  useEffect(() => {
    getExternalRequest();
  }, [getExternalRequest]);

  if (loading) {
    return <LoadingScreen sx={{ minHeight: 'calc(100vh - 80px)' }} />;
  }

  if (error) {
    return (
      <Box sx={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Alert severity="error" sx={{ p: 10, fontSize: 18, justifyContent: 'center' }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return <ExternalRequestForm code={params.code} />;
}
