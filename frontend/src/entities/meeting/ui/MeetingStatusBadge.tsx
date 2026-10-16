import { Chip, type ChipProps } from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import MicIcon from '@mui/icons-material/Mic';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import type { MeetingStatus } from '../model/types';

interface MeetingStatusBadgeProps {
  status: MeetingStatus;
  size?: 'small' | 'medium';
}

export const MeetingStatusBadge = ({ status, size = 'small' }: MeetingStatusBadgeProps) => {
  let label = 'Scheduled';
  let color: ChipProps['color'] = 'info';
  let icon = <ScheduleIcon sx={{ fontSize: 16 }} />;

  switch (status) {
    case 'SCHEDULED':
      label = 'Scheduled';
      color = 'primary';
      icon = <ScheduleIcon sx={{ fontSize: 16 }} />;
      break;
    case 'RECORDED':
      label = 'Recorded';
      color = 'warning';
      icon = <MicIcon sx={{ fontSize: 16 }} />;
      break;
    case 'PROCESSED':
      label = 'Processed';
      color = 'success';
      icon = <CheckCircleIcon sx={{ fontSize: 16 }} />;
      break;
    case 'COMPLETED':
      label = 'Completed';
      color = 'default';
      icon = <DoneAllIcon sx={{ fontSize: 16 }} />;
      break;
  }

  return (
    <Chip
      size={size}
      label={label}
      color={color}
      icon={icon}
      variant="outlined"
      sx={{
        fontWeight: 600,
        fontSize: '0.75rem',
        borderRadius: 1.5,
      }}
    />
  );
};
