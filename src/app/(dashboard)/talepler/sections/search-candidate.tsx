import NextLink from 'next/link';
import paths from '@/routes/paths';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import Link from '@mui/material/Link';
import { debounce } from '@mui/material';
import Add from '@mui/icons-material/Add';
import { useMemo, useState } from 'react';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Search from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { IReferralForm } from '@/types/IReferral';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import { getCandidateStatusText } from '@/utils/enum';
import BaseModal from '@/components/modal/base-modal';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import { searchCandidateApi } from '@/api/useCandidateApi';
import { ISearchCandidateResponse } from '@/types/ICandidate';
import UpdateCandidateStatus from '../../(common)/referral/update-candidate-status';

interface Props {
  requestId?: number;
}

let searchInputBackup = '';

export default function SearchCandidate({ requestId }: Props) {
  const [selectedReferral, setSelectedReferral] = useState<IReferralForm>();
  const [candidates, setCandidates] = useState<ISearchCandidateResponse[]>([]);

  const fetchData = async (searchInput: string) => {
    try {
      const resp = await searchCandidateApi(searchInput);
      setCandidates(resp);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataLazy = useMemo(
    () =>
      debounce(async (input: string) => {
        const searchInput = input.trim();
        searchInputBackup = searchInput;
        if (searchInput === '') return;
        fetchData(searchInput);
      }, 400),
    []
  );

  const refetch = () => {
    fetchData(searchInputBackup);
    setSelectedReferral(undefined);
  };

  return (
    <>
      <DialogTitle>
        <TextField
          fullWidth
          autoFocus
          placeholder="Aday Ara .."
          onChange={(e) => {
            fetchDataLazy(e.target.value);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </DialogTitle>

      <DialogContent>
        <List>
          {candidates.map((x) => (
            <div key={x.id}>
              <ListItem
                secondaryAction={
                  <LoadingButton
                    onClick={() => {
                      const filter = x.referrals.find((x) => x.requestId === requestId);
                      setSelectedReferral(filter ?? { candidateId: x.id, requestId });
                    }}
                    variant="outlined"
                    startIcon={<Add />}
                    size="small"
                  >
                    Ekle
                  </LoadingButton>
                }
              >
                <ListItemText
                  secondary={
                    <>
                      <Typography variant="inherit" component="span">
                        Pozisyonlar: {x.positions.map((x) => x.position.name).join(', ')}
                      </Typography>
                      {getStatusText(x.referrals, requestId)}
                    </>
                  }
                >
                  <Link href={`${paths.candidate}/${x.id}`} component={NextLink}>
                    {x.name} (#{x.id})
                  </Link>
                </ListItemText>
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </DialogContent>

      <BaseModal
        maxWidth="sm"
        open={!!selectedReferral}
        onClose={() => setSelectedReferral(undefined)}
        title="Aday Yönlendir"
      >
        <UpdateCandidateStatus referral={selectedReferral} onSuccessUpdate={refetch} />
      </BaseModal>
    </>
  );
}

const getStatusText = (referrals: ISearchCandidateResponse['referrals'], requestId?: number) => {
  if (!referrals.length) return null;

  const count: any = {};
  let isAddedReqStatus;

  for (let i = 0; i < referrals.length; i++) {
    const stat = referrals[i];
    if (count[stat.status] !== undefined) {
      count[stat.status] += 1;
    } else {
      count[stat.status] = 1;
    }

    if (stat.requestId === requestId && !isAddedReqStatus) {
      isAddedReqStatus = stat.status;
    }
  }

  return (
    <>
      <Box display="flex" gap={1} my={1} component="span">
        {Object.keys(count).map((y, i) => (
          <Chip
            key={i}
            size="small"
            component="span"
            color="success"
            variant="outlined"
            label={
              <Typography variant="inherit" component="span">
                <strong>{count[y]}</strong> {getCandidateStatusText(y as any).toLowerCase()}
              </Typography>
            }
          />
        ))}
      </Box>

      {isAddedReqStatus && (
        <Typography variant="caption" sx={{ color: 'error.main' }}>
          Aday bu talep için daha önce yönlendirilmiş ({getCandidateStatusText(isAddedReqStatus)})
        </Typography>
      )}
    </>
  );
};
