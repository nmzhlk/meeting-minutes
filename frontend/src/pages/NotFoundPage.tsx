import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';
import { EmptyState } from '../shared/ui';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 6 }}>
      <EmptyState
        icon={<FindInPageOutlinedIcon sx={{ fontSize: 40 }} />}
        title="404 — Page Not Found"
        description="The screen or session you requested does not exist or may have been relocated."
        actionLabel="Back to Dashboard"
        onAction={() => navigate('/')}
        actionIcon={<ArrowBackIcon />}
      />
    </Box>
  );
};
