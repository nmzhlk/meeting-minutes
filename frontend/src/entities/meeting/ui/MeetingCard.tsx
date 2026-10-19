import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { Meeting } from '../model/types';
import { MeetingStatusBadge } from './MeetingStatusBadge';
import { ParticipantAvatarGroup } from '../../participant';
import { formatDate } from '../../../shared/lib';

interface MeetingCardProps {
  meeting: Meeting;
}

export const MeetingCard = ({ meeting }: MeetingCardProps) => {
  const actionItems = meeting.actionItems || [];
  const totalTasks = actionItems.length;
  const doneTasks = actionItems.filter((i) => i.status === 'DONE').length;

  return (
    <Card
      component={Link}
      to={`/meetings/${meeting.id}`}
      elevation={0}
      sx={{
        textDecoration: 'none',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2.5,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'background.paper',
        color: 'inherit',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          borderColor: 'primary.light',
          '& .arrow-icon': {
            transform: 'translateX(3px)',
            color: 'primary.main',
          },
        },
      }}
    >
      <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '1.05rem',
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
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
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            flexGrow: 1,
            lineHeight: 1.5,
          }}
        >
          {meeting.description || 'No description provided.'}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip
            size="small"
            icon={<CalendarMonthIcon sx={{ fontSize: '0.9rem !important' }} />}
            label={formatDate(meeting.date)}
            sx={{ borderRadius: 1.5, bgcolor: 'background.default', fontSize: '0.75rem' }}
          />
          <Chip
            size="small"
            icon={<AccessTimeIcon sx={{ fontSize: '0.9rem !important' }} />}
            label={`${meeting.durationMinutes} min`}
            sx={{ borderRadius: 1.5, bgcolor: 'background.default', fontSize: '0.75rem' }}
          />
          {totalTasks > 0 && (
            <Chip
              size="small"
              icon={<AssignmentTurnedInIcon sx={{ fontSize: '0.9rem !important' }} />}
              label={`${doneTasks}/${totalTasks} done`}
              color={doneTasks === totalTasks ? 'success' : 'default'}
              variant={doneTasks === totalTasks ? 'filled' : 'outlined'}
              sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
            />
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            mt: 'auto',
          }}
        >
          <ParticipantAvatarGroup participants={meeting.participants || []} max={4} size={28} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              View Protocol
            </Typography>
            <ArrowForwardIcon
              className="arrow-icon"
              sx={{ fontSize: 16, transition: 'transform 0.2s, color 0.2s' }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
