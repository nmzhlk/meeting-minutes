import { Box, Card, CardContent, Typography } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import type { Meeting } from '../model/types';

interface MeetingStatsCardProps {
  meetings: Meeting[];
}

export const MeetingStatsCard = ({ meetings }: MeetingStatsCardProps) => {
  const totalMeetings = meetings.length;
  const processedCount = meetings.filter((m) => m.status === 'PROCESSED').length;

  const allActionItems = meetings.flatMap((m) => m.actionItems || []);
  const totalTasks = allActionItems.length;
  const doneTasks = allActionItems.filter((i) => i.status === 'DONE').length;

  const stats = [
    {
      title: 'Total Meetings',
      value: totalMeetings,
      subtitle: `${meetings.filter((m) => m.status === 'SCHEDULED').length} scheduled upcoming`,
      icon: <CalendarMonthIcon sx={{ color: 'primary.main', fontSize: 28 }} />,
      bg: 'rgba(37, 99, 235, 0.08)',
    },
    {
      title: 'AI Protocols Generated',
      value: processedCount,
      subtitle: 'Summaries & key decisions',
      icon: <AutoAwesomeIcon sx={{ color: 'secondary.main', fontSize: 28 }} />,
      bg: 'rgba(13, 148, 136, 0.08)',
    },
    {
      title: 'Action Items Tracked',
      value: totalTasks,
      subtitle: `${doneTasks} completed (${totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0}%)`,
      icon: <TaskAltIcon sx={{ color: '#10b981', fontSize: 28 }} />,
      bg: 'rgba(16, 185, 129, 0.08)',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
        gap: 2.5,
        mb: 4,
      }}
    >
      {stats.map((stat) => (
        <Card
          key={stat.title}
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2.5,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.06)',
            },
          }}
        >
          <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 2,
                bgcolor: stat.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {stat.icon}
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {stat.title}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, my: 0.25 }}>
                {stat.value}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stat.subtitle}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};
