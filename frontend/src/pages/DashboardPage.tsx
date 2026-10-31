import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Fade, Alert, AlertTitle } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { Meeting, MeetingStatus } from '../shared/types';
import { meetingsApi } from '../shared/api';
import { EmptyState, DashboardGridSkeleton } from '../shared/ui';
import { MeetingCard, MeetingStatsCard } from '../entities/meeting';
import { MeetingFilters } from '../features/filter-meetings';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadMeetings = useCallback(async () => {
    setError(null);
    try {
      const data = await meetingsApi.getMeetings();
      setMeetings(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Failed to load meetings from server. Please check your connection.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    meetingsApi
      .getMeetings()
      .then((data) => {
        if (isMounted) {
          setMeetings(data);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const msg =
            err instanceof Error
              ? err.message
              : 'Failed to load meetings from server. Please check your connection.';
          setError(msg);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRetry = () => {
    setLoading(true);
    loadMeetings();
  };

  const filteredMeetings = meetings.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      (m.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' || m.status === (statusFilter as MeetingStatus);
    return matchesSearch && matchesStatus;
  });

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Meetings Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage upcoming sessions, AI protocols, and assigned action items
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/meetings/create"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ px: 2.5 }}
        >
          Schedule a Meeting
        </Button>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={handleRetry}
            >
              Retry
            </Button>
          }
        >
          <AlertTitle sx={{ fontWeight: 700 }}>Unable to Load Meetings</AlertTitle>
          {error}
        </Alert>
      )}

      <MeetingStatsCard meetings={meetings} />

      <MeetingFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        totalCount={meetings.length}
        filteredCount={filteredMeetings.length}
      />

      {loading ? (
        <DashboardGridSkeleton count={3} />
      ) : meetings.length === 0 ? (
        <EmptyState
          title="No Meetings Scheduled"
          description="You don't have any meeting sessions recorded yet, start by scheduling a new meeting"
          actionLabel="Schedule First Meeting"
          onAction={() => navigate('/meetings/create')}
          actionIcon={<AddIcon />}
        />
      ) : filteredMeetings.length === 0 ? (
        <EmptyState
          title="No Matching Meetings"
          description={`No sessions matched "${search || statusFilter}", try clearing your filters`}
          actionLabel="Reset Filters"
          onAction={() => {
            setSearch('');
            setStatusFilter('ALL');
          }}
        />
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {filteredMeetings.map((meeting, idx) => (
            <Fade in={true} timeout={300 + Math.min(idx * 90, 500)} key={meeting.id}>
              <Box sx={{ height: '100%' }}>
                <MeetingCard meeting={meeting} />
              </Box>
            </Fade>
          ))}
        </Box>
      )}
    </Box>
  );
};
