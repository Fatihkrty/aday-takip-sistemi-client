'use client';

import paths from '@/routes/paths';
import Box from '@mui/material/Box';
import { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import Edit from '@mui/icons-material/Edit';
import { useRouter } from 'next/navigation';
import tlCurrency from '@/utils/tl-currency';
import { ICandidate } from '@/types/ICandidate';
import { useBoolean } from '@/hooks/useBoolean';
import { Gender } from '@/constants/gender.enum';
import LiveMRTTable from '@/components/mrt-table';
import Typography from '@mui/material/Typography';
import BaseModal from '@/components/modal/base-modal';
import CandidateForm from './_sections/candidate-form';
import { Compatibility } from '@/constants/compatibility';
import CandidateCvForm from './_sections/candidate-cv-form';
import { createCandidateXlsx } from './_sections/export-xlsx';
import SwitchAccount from '@mui/icons-material/SwitchAccount';
import { MilitaryService } from '@/constants/military-service';
import CandidateFormCard from './_sections/canidate-form-card';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DocumentScanner from '@mui/icons-material/DocumentScanner';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { MRT_ColumnDef, MRT_ActionMenuItem } from 'material-react-table';
import { useTableFilter } from '@/components/mrt-table/hooks/useTableFilter';
import PersonOutlineOutlined from '@mui/icons-material/PersonOutlineOutlined';
import { getCandidatesApi, CANDIDATE_QUERY_KEY } from '@/api/useCandidateApi';
import { useLiveTableQuery } from '@/components/mrt-table/hooks/useLiveTableQuery';
import { enumToArray, getGenderText, getCompatibilityText, getMilitaryServiceText } from '@/utils/enum';

export default function CandidateTablePage() {
  const { push } = useRouter();
  const candidateCvModal = useBoolean();
  const candidateFormModal = useBoolean();
  const candidateFormCardModal = useBoolean();
  const [selectedCandidate, setSelectedCandidate] = useState<ICandidate>();

  const tableFilter = useTableFilter();
  const queryData = useLiveTableQuery({
    queryFn: getCandidatesApi,
    queryKey: CANDIDATE_QUERY_KEY,
    tableFilter,
  });

  const columns = useMemo<MRT_ColumnDef<ICandidate>[]>(
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
      },
      {
        header: 'Cinsiyet',
        accessorKey: 'gender',
        filterVariant: 'select',
        filterSelectOptions: enumToArray(Gender).map((x) => ({ label: getGenderText(x), value: x })),
        accessorFn(originalRow) {
          return originalRow.gender === Gender.male ? 'Erkek' : 'Kadın';
        },
      },
      {
        id: 'positionName',
        header: 'Pozisyon',
        accessorFn(originalRow) {
          if (!originalRow.positions.length) return null;
          return originalRow.positions.map((x) => x.position.name).join(', ');
        },
      },
      {
        header: 'Notlar',
        accessorKey: 'note',
        enableColumnFilter: false,
        enableColumnOrdering: false,
      },
      {
        header: 'Lokasyon',
        accessorKey: 'location',
      },
      {
        size: 120,
        header: 'Maaş',
        accessorKey: 'salary',
        filterVariant: 'range',
        muiFilterTextFieldProps: {
          type: 'number',
        },
        accessorFn(originalRow) {
          return tlCurrency(originalRow.salary!);
        },
      },
      {
        header: 'Askerlik',
        filterVariant: 'multi-select',
        accessorKey: 'militaryService',
        filterSelectOptions: enumToArray(MilitaryService).map((x) => ({ label: getMilitaryServiceText(x), value: x })),
        accessorFn(originalRow) {
          return getMilitaryServiceText(originalRow.militaryService);
        },
      },
      {
        header: 'Uyum',
        accessorKey: 'compatibility',
        filterVariant: 'multi-select',
        filterSelectOptions: enumToArray(Compatibility).map((x) => ({ label: getCompatibilityText(x), value: x })),
        accessorFn(originalRow) {
          if (originalRow.compatibility) return getCompatibilityText(originalRow.compatibility);
        },
      },
      {
        header: 'Değerli Cv',
        accessorKey: 'rate',
        accessorFn(originalRow) {
          return <Rating readOnly value={originalRow.rate} />;
        },
      },
      {
        id: 'referenceName',
        header: 'Referanslar',
        accessorFn(originalRow) {
          const { references } = originalRow;
          if (!references.length) return null;
          return references.map((ref, i) => (
            <Box key={i}>
              <Typography variant="inherit">{ref.name}</Typography>
              <Typography variant="inherit">{ref.phone || 'Bilinmiyor'}</Typography>
              <Divider />
            </Box>
          ));
        },
      },
      {
        header: 'Diller',
        id: 'languageName',
        accessorKey: 'languages',
        accessorFn(originalRow) {
          if (!originalRow.languages.length) return null;
          return originalRow.languages.map((lang, i) => (
            <Box key={i}>
              <Typography variant="inherit">{lang.name}</Typography>
              <Rating value={lang.rate} readOnly />
            </Box>
          ));
        },
      },
    ],
    []
  );

  const onSuccessCvForm = (data: ICandidate) => {
    setSelectedCandidate(data);
  };

  return (
    <>
      <LiveMRTTable
        enableCellActions
        renderTopToolbarCustomActions={() => (
          <Box display="flex" gap={1}>
            <Button
              onClick={() => {
                setSelectedCandidate(undefined);
                candidateFormModal.setTrue();
              }}
              variant="outlined"
              sx={{ textTransform: 'none' }}
              startIcon={<PersonOutlineOutlined />}
            >
              Aday Ekle
            </Button>
            <Button
              onClick={() => {
                if (queryData.data) {
                  createCandidateXlsx(queryData.data.results);
                }
              }}
              variant="outlined"
              sx={{ textTransform: 'none' }}
              startIcon={<FileDownloadIcon />}
            >
              Tabloyu Dışarı Aktar
            </Button>
          </Box>
        )}
        muiTableBodyCellProps={({ row }) => ({
          align: 'center',
          sx: {
            borderLeft: '1px solid #CFDAE6',
            cursor: 'pointer',
          },
          onDoubleClick() {
            candidateFormCardModal.setTrue();
            setSelectedCandidate(row.original);
          },
        })}
        state={{
          columnPinning: { right: ['mrt-row-actions'] },
        }}
        renderCellActionMenuItems={({ closeMenu, row, table }) => {
          return [
            <MRT_ActionMenuItem
              key={0}
              table={table}
              icon={<Edit />}
              label="Düzenle"
              onClick={() => {
                setSelectedCandidate(row.original);
                candidateFormModal.setTrue();
                closeMenu();
              }}
            />,
            <MRT_ActionMenuItem
              key={5}
              table={table}
              icon={<AssignmentIndIcon />}
              label="Cv Bilgileri"
              onClick={() => {
                setSelectedCandidate(row.original);
                candidateCvModal.setTrue();
                closeMenu();
              }}
            />,
            <MRT_ActionMenuItem
              key={1}
              table={table}
              label="Detaylar"
              icon={<DocumentScanner />}
              onClick={() => {
                closeMenu();
                push(`${paths.candidate}/${row.original.id}`);
              }}
            />,
            <MRT_ActionMenuItem
              key={3}
              table={table}
              label="Aday Kartı Görüntüle"
              icon={<SwitchAccount />}
              onClick={() => {
                candidateFormCardModal.setTrue();
                setSelectedCandidate(row.original);
                closeMenu();
              }}
            />,
          ];
        }}
        columns={columns}
        queryData={queryData}
        tableFilter={tableFilter}
      />

      <BaseModal open={candidateFormModal.value} title="Aday Hakkında" onClose={candidateFormModal.setFalse}>
        <CandidateForm candidate={selectedCandidate} />
      </BaseModal>

      <BaseModal open={candidateFormCardModal.value} onClose={candidateFormCardModal.setFalse} title="Aday Kartı">
        {selectedCandidate && <CandidateFormCard data={selectedCandidate} printable />}
      </BaseModal>

      <BaseModal open={candidateCvModal.value} onClose={candidateCvModal.setFalse} title="Aday Cv Bilgileri">
        <CandidateCvForm
          candidate={selectedCandidate}
          onCreateSuccess={onSuccessCvForm}
          onRemoveSuccess={onSuccessCvForm}
        />
      </BaseModal>
    </>
  );
}
