'use client';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import React, { ReactNode } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import LoadingScreen from '@/components/loading/loading-screen';
import { useDashboardInfoApi, useGetCompanyStatusApi } from '@/api/useDashboardApi';

interface Props {
  label: string;
  count: number | string;
  icon?: ReactNode;
}

export default function Home() {
  const { data, isLoading, error, isSuccess } = useDashboardInfoApi();
  const { data: companyStatus } = useGetCompanyStatusApi();

  if (isLoading) {
    return <LoadingScreen sx={{ minHeight: '80vh' }} />;
  }

  if (error) {
    return (
      <Alert severity="warning" sx={{ p: 8, fontSize: 16, justifyContent: 'center' }}>
        Veriler yüklenirken bir hata oluştu
      </Alert>
    );
  }

  return (
    isSuccess && (
      <Container maxWidth={false}>
        <Typography mb={1} variant="h4" color="text.secondary" fontWeight="bold">
          Tüm Firma Talepleri
        </Typography>

        <Box display="flex" justifyContent="space-between" gap={2}>
          <AnalysticWidget
            count={data.total.cancelled + data.total.open + data.total.closed}
            label="Tüm Firma Talepleri"
          />
          <AnalysticWidget count={data.total.open} label="Açık Talepler" />
          <AnalysticWidget count={data.total.closed} label="Kapalı Talepler" />
          <AnalysticWidget count={data.total.cancelled} label="İptal Edilen Talepler" />
        </Box>

        <Typography mt={4} mb={1} variant="h4" color="text.secondary" fontWeight="bold">
          Benim Taleplerim
        </Typography>

        <Box display="flex" justifyContent="space-between" gap={2}>
          <AnalysticWidget count={data.my.cancelled + data.my.open + data.my.closed} label="Tüm Taleplerim" />
          <AnalysticWidget count={data.my.open} label="Açık Taleplerim" />
          <AnalysticWidget count={data.my.closed} label="Kapalı Taleplerim" />
          <AnalysticWidget count={data.my.cancelled} label="İptal Edilen Taleplerim" />
        </Box>

        <Typography mt={4} mb={1} variant="h4" color="text.secondary" fontWeight="bold">
          En Fazla Talep Veren Firmalar
        </Typography>

        <Box display="flex" alignItems="center" flexWrap="wrap" justifyContent="space-between">
          {companyStatus?.map((x) => (
            <Gauge
              key={x.id}
              value={x.requestCount}
              width={300}
              height={200}
              valueMax={data.total.open + data.total.closed + data.total.cancelled}
              cornerRadius={20}
              startAngle={-110}
              endAngle={110}
              sx={{
                [`& .${gaugeClasses.valueText}`]: {
                  fontSize: 22,
                },
              }}
              text={({ value, valueMax }) => `${x.name}\n${value} / ${valueMax}`}
            />
          ))}
        </Box>
      </Container>
    )
  );
}

function AnalysticWidget({ label, count, icon }: Props) {
  return (
    <Stack
      sx={{
        py: 5,
        width: 1,
        minWidth: 180,
        color: 'white',
        borderRadius: 2,
        textAlign: 'center',
        background: '#293450',
      }}
    >
      {icon && <Box sx={{ width: 64, height: 64, alignSelf: 'center', mb: 1 }}>{icon}</Box>}

      <Typography variant="h3">{count}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.64 }}>
        {label}
      </Typography>
    </Stack>
  );
}
