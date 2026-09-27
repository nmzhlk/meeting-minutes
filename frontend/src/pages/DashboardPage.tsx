import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  AvatarGroup,
  Tooltip,
  InputAdornment,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import type { Meeting, MeetingStatus } from '../types/meeting';
import { MeetingStatusBadge } from '../components/StatusBadge';

interface DashboardPageProps {
  meetings: Meeting[];
}

export const DashboardPage = ({ meetings }: DashboardPageProps) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(search.toLowerCase()) ||
      meeting.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' || meeting.status === (statusFilter as MeetingStatus);

    return matchesSearch && matchesStatus;
  });

  const totalMeetings = meetings.length;
  const processedCount = meetings.filter((m) => m.status === 'PROCESSED').length;
  const totalActionItems = meetings.reduce(
    (acc, m) => acc + (m.actionItems ? m.actionItems.length : 0),
    0
  );

  const hasActiveFilters = search.trim() !== '' || statusFilter !== 'ALL';

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
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
              Manage your upcoming sessions, AI protocols, and assigned action items
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

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 2,
          }}
        >
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="body2" color="text.secondary">
                Total Meetings
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
                {totalMeetings}
              </Typography>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="body2" color="text.secondary">
                Processed Protocols
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5, color: 'success.main' }}>
                {processedCount}
              </Typography>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="body2" color="text.secondary">
                Total Action Items
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5, color: 'primary.main' }}>
                {totalActionItems}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 3,
        }}
      >
        <TextField
          size="small"
          placeholder="Search by title or topic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1, bgcolor: 'background.paper' }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearch('')}
                    edge="end"
                    aria-label="clear search"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />
        <FormControl size="small" sx={{ minWidth: 160, bgcolor: 'background.paper' }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            <MenuItem value="SCHEDULED">Scheduled</MenuItem>
            <MenuItem value="RECORDED">Recorded</MenuItem>
            <MenuItem value="PROCESSED">Processed</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {hasActiveFilters && filteredMeetings.length > 0 && (
        <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Showing <strong>{filteredMeetings.length}</strong> of <strong>{meetings.length}</strong> meetings
          </Typography>
          <Button
            size="small"
            variant="text"
            onClick={handleResetFilters}
            startIcon={<RestartAltIcon fontSize="small" />}
            sx={{ textTransform: 'none', py: 0.2, fontSize: '0.8rem' }}
          >
            Clear filters
          </Button>
        </Box>
      )}

      {filteredMeetings.length === 0 ? (
        <Card elevation={0} sx={{ p: 5, textAlign: 'center', border: '1px dashed', borderColor: 'divider' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            {hasActiveFilters ? 'No meetings found' : 'No meetings scheduled yet'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {hasActiveFilters
              ? 'Try adjusting your search query or reset the filters'
              : 'Get started by scheduling your first meeting session'}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5 }}>
            {hasActiveFilters && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleResetFilters}
                startIcon={<RestartAltIcon />}
                sx={{ textTransform: 'none' }}
              >
                Reset Filters
              </Button>
            )}
            <Button
              component={Link}
              to="/meetings/create"
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              sx={{ textTransform: 'none' }}
            >
              Schedule a Meeting
            </Button>
          </Box>
        </Card>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 2.5,
          }}
        >
          {filteredMeetings.map((meeting) => (
            <Card
              key={meeting.id}
              elevation={0}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2.5,
                bgcolor: 'background.paper',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 6px 20px rgba(37, 99, 235, 0.08)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, gap: 1 }}>
                  <Typography
                    component={Link}
                    to={`/meetings/${meeting.id}`}
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      fontSize: '1.05rem',
                      lineHeight: 1.3,
                      textDecoration: 'none',
                      color: 'text.primary',
                      transition: 'color 0.15s ease',
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    {meeting.title}
                  </Typography>
                  <MeetingStatusBadge status={meeting.status} />
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {meeting.description}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, color: 'text.secondary', fontSize: '0.85rem' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarMonthIcon sx={{ fontSize: 16 }} />
                    <span>
                      {new Date(meeting.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 16 }} />
                    <span>{meeting.durationMinutes} min</span>
                  </Box>
                  {meeting.actionItems && meeting.actionItems.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main', fontWeight: 500 }}>
                      <TaskAltIcon sx={{ fontSize: 16 }} />
                      <span>{meeting.actionItems.length} action items</span>
                    </Box>
                  )}
                </Box>
              </CardContent>

              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  bgcolor: 'background.default',
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.75rem' } }}>
                  {meeting.participants.map((p) => (
                    <Tooltip key={p.id} title={`${p.name} (${p.role})`}>
                      <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        {p.name.charAt(0)}
                      </Avatar>
                    </Tooltip>
                  ))}
                </AvatarGroup>

                <Button
                  component={Link}
                  to={`/meetings/${meeting.id}`}
                  size="small"
                  variant="outlined"
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  View Details
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};
