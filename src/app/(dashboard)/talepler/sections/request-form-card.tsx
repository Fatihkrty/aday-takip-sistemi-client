import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { useRef, ReactNode } from 'react';
import { IRequest } from '@/types/IRequest';
import { useRouter } from 'next/navigation';
import tlCurrency from '@/utils/tl-currency';
import Print from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import IconButton from '@mui/material/IconButton';
import Box, { BoxProps } from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Typography, { TypographyProps } from '@mui/material/Typography';
import {
  getGenderText,
  getWorkDayText,
  getWorkTypeText,
  getSideRightsText,
  getMilitaryServiceText,
  getCompanyWorkTypeText,
} from '@/utils/enum';

interface Props {
  data: IRequest;
  printable?: boolean;
  showBackPage?: boolean;
}

export default function RequestFormCard({ data, printable, showBackPage }: Props) {
  const printRef = useRef(null);
  const { back } = useRouter();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: data.company.name,
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
                <Typography variant="inherit">Talep Numarası #{data.id}</Typography>
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
            <Grid container item xs={6}>
              <Grid item xs={12}>
                <TitleLabel textAlign="center" label="Firma Bilgileri" />
                <InfoLabel label="Firma Adı:">{data.company.name}</InfoLabel>
                <InfoLabel label="Firma Yetkilisi:">{data.advisorName}</InfoLabel>
                <InfoLabel label="Firma Yetkili Telefon:">{data.advisorPhone}</InfoLabel>
                <InfoLabel label="Firma Yetkili Email:">{data.advisorEmail}</InfoLabel>
                <InfoLabel label="Firma Yetkili Ünvan:">{data.advisorTitle}</InfoLabel>
              </Grid>

              <Grid item xs={12}>
                <TitleLabel textAlign="center" label="Çalışma Bilgileri" />
                <InfoLabel label="Çalışma Şekli:">{data.workType.map((x) => getWorkTypeText(x)).join(', ')}</InfoLabel>

                <InfoLabel label="Çalışma Günleri:">{data.workDays.map((x) => getWorkDayText(x)).join(', ')}</InfoLabel>
                <InfoLabel label="Yan Haklar:">{data.sideRights.map((x) => getSideRightsText(x)).join(', ')}</InfoLabel>
                <InfoLabel label="Firma Çalışma Şekli:">{getCompanyWorkTypeText(data.companyWorkType)}</InfoLabel>
                <InfoLabel label="Danışman:">{data.user?.name}</InfoLabel>
              </Grid>
            </Grid>

            <Grid container item xs={6}>
              <Grid item xs={12}>
                <TitleLabel textAlign="center" label="İlan ve Talep Bilgileri" />
                <InfoLabel label="Pozisyon:">{data.position?.name}</InfoLabel>
                <InfoLabel label="Departman:">{data.department}</InfoLabel>
                <InfoLabel label="Maaş ve Prim:">
                  {tlCurrency(data.salary)} / {data.prim ? 'Var' : 'Yok'}
                </InfoLabel>

                <InfoLabel label="Talep Edilen Personel Sayısı:">
                  <Typography variant="body1" fontSize={18}>
                    {data.workerReqCount}
                  </Typography>
                </InfoLabel>

                <InfoLabel label="İş Başlangıç Saati:">{data.workHourStart}</InfoLabel>
                <InfoLabel label="İş Bitiş Saati:">{data.workHourEnd}</InfoLabel>
                <InfoLabel label="Cinsiyet:">{getGenderText(data.gender)}</InfoLabel>
                <InfoLabel label="Askerlik:">{getMilitaryServiceText(data.militaryService)}</InfoLabel>
              </Grid>

              <Grid item xs={12} mt={2}>
                <TitleLabel textAlign="center" label="Yabancı Diller" />
                <Box sx={{ border: '1px dashed lightgrey', p: 1 }}>
                  {data.languages.length ? (
                    data.languages.map((x, i) => (
                      <Box key={i} display="flex" gap={1} alignItems="center">
                        <Typography variant="body1" fontSize={18}>
                          {x.name}:
                        </Typography>
                        <Rating readOnly value={x.rate} />
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body1" fontSize={18} color="warning.main">
                      <em>Yabancı dil yok..</em>
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <TitleLabel sx={{ textAlign: 'center' }} label="Açıklamalar" />
            </Grid>

            <Grid item xs={6}>
              <InfoLabel label="Aranan Nitelikler:">{data.requiredQualifications}</InfoLabel>
            </Grid>

            <Grid item xs={6}>
              <InfoLabel sx={{ height: 1 }} label="Görev Tanımı:">
                {data.jobDescription}
              </InfoLabel>
            </Grid>

            <Grid item xs={12}>
              <InfoLabel label="Ek Açıklamalar:">{data.description}</InfoLabel>
            </Grid>
          </Grid>
        </CardContent>
      </div>
    </Card>
  );
}

type TitleLabelProps = TypographyProps & {
  label: string;
};

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

const TitleLabel = ({ label, ...other }: TitleLabelProps) => (
  <Typography variant="h6" fontWeight="bold" {...other}>
    {label}
  </Typography>
);
