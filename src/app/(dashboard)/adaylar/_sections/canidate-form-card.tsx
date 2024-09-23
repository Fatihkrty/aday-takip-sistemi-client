'use client';

import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { useRef, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import tlCurrency from '@/utils/tl-currency';
import Print from '@mui/icons-material/Print';
import { ICandidate } from '@/types/ICandidate';
import { useReactToPrint } from 'react-to-print';
import IconButton from '@mui/material/IconButton';
import Box, { BoxProps } from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { getGenderText, getCompatibilityText, getMilitaryServiceText } from '@/utils/enum';

interface Props {
  data: ICandidate;
  printable?: boolean;
  showBackPage?: boolean;
}

export default function CandidateFormCard({ data, printable, showBackPage }: Props) {
  const printRef = useRef(null);
  const { back } = useRouter();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: data.name,
  });

  return (
    <Card>
      <div ref={printRef}>
        <CardHeader
          title={
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={1}>
                {showBackPage && (
                  <IconButton onClick={back}>
                    <ArrowBack />
                  </IconButton>
                )}
                <Typography variant="inherit">{`${data.name} (#${data.id})`}</Typography>
              </Box>
              {printable && (
                <Button onClick={handlePrint} variant="outlined" size="small" startIcon={<Print />}>
                  Yazdır
                </Button>
              )}
            </Stack>
          }
        />

        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <InfoLabel label="Ad Soyad:">{data.name}</InfoLabel>
              <InfoLabel label="Email:">{data.email}</InfoLabel>
              <InfoLabel label="Telefon:">{data.phone}</InfoLabel>
              <InfoLabel label="Cinsiyet:">{getGenderText(data.gender)}</InfoLabel>
              <InfoLabel label="Pozisyon:">{data.positions.map((x) => x.position.name).join(', ')}</InfoLabel>

              <InfoLabel label="Diller:">
                {!data.languages.length ? (
                  <Typography variant="body1" fontSize={17} color="error.main">
                    Dil bilgisi yok
                  </Typography>
                ) : (
                  data.languages.map((x, i) => (
                    <Box key={i} display="flex" alignItems="center" gap={1}>
                      <Typography>{x.name}:</Typography>
                      <Rating readOnly value={x.rate} />
                    </Box>
                  ))
                )}
              </InfoLabel>
            </Grid>

            <Grid item xs={6}>
              <InfoLabel label="Lokasyon:">{data.location}</InfoLabel>
              <InfoLabel label="Maaş:">{data.salary !== null && tlCurrency(data.salary)}</InfoLabel>
              <InfoLabel label="Askerlik:">{getMilitaryServiceText(data.militaryService)}</InfoLabel>
              <InfoLabel label="Uyum:">
                {data.compatibility !== null && getCompatibilityText(data.compatibility)}
              </InfoLabel>
              <InfoLabel label="Değerli Cv:">
                <Rating readOnly value={data.rate} />
              </InfoLabel>

              <InfoLabel label="Referanslar:">
                {!data.references.length ? (
                  <Typography variant="body1" fontSize={17} color="error.main">
                    Referans bilgisi yok
                  </Typography>
                ) : (
                  data.references.map((x, i) => (
                    <Typography key={i}>{`${x.name} (${x.phone || 'Telefon yok'})`}</Typography>
                  ))
                )}
              </InfoLabel>

              <InfoLabel label="Cv'ler:">
                {!data.cvs.length ? (
                  <Typography variant="body1" fontSize={17} color="error.main">
                    CV bilgisi yok
                  </Typography>
                ) : (
                  data.cvs.map((x, i) => (
                    <Box key={i}>
                      <Link href={x.uri} target="_blank">{`CV ${i + 1}`}</Link>
                    </Box>
                  ))
                )}
              </InfoLabel>
            </Grid>

            <Grid item xs={12}>
              <InfoLabel label="Notlar:">{data.note}</InfoLabel>
            </Grid>
          </Grid>
        </CardContent>
      </div>
    </Card>
  );
}

type InfoLabelProps = BoxProps & {
  label: string;
  children?: ReactNode;
};

const InfoLabel = ({ label, children, sx, ...other }: InfoLabelProps) => (
  <Box display="flex" gap={1} sx={{ border: '1px dashed lightgrey', p: 1, ...sx }} {...other}>
    <Typography variant="body1" fontSize={16}>
      {label}
    </Typography>
    {children ? (
      <Typography fontSize={16} variant="body1">
        {children}
      </Typography>
    ) : (
      <Typography variant="body1" fontSize={16} color="error.main">
        Bilinmiyor
      </Typography>
    )}
  </Box>
);
