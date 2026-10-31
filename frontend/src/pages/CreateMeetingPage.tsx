import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { CreateMeetingInput } from '../shared/types';
import { meetingsApi } from '../shared/api';
import { useDocumentTitle } from '../shared/lib';
import { useFeedback } from '../shared/ui';
import { CreateMeetingForm } from '../features/create-meeting';

export const CreateMeetingPage = () => {
  const navigate = useNavigate();
  const feedback = useFeedback();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useDocumentTitle('New Meeting');

  const handleCreateMeeting = async (input: CreateMeetingInput) => {
    setIsSubmitting(true);
    try {
      const created = await meetingsApi.createMeeting(input);
      feedback.showSuccess('Meeting scheduled successfully');
      navigate(`/meetings/${created.id}`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Failed to schedule meeting, please try again';
      feedback.showError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 840, mx: 'auto' }}>
      <Button
        component={Link}
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2, color: 'text.secondary', textTransform: 'none' }}
      >
        Back to Dashboard
      </Button>

      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
        Schedule a New Meeting
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3.5 }}>
        Define agenda topics, attendees, and scheduling details for your upcoming discussion
      </Typography>

      <CreateMeetingForm
        onSubmit={handleCreateMeeting}
        onCancel={() => navigate('/')}
        isSubmitting={isSubmitting}
      />
    </Box>
  );
};
