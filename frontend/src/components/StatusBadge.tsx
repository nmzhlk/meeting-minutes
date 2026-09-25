import React from 'react';
import { Chip, type ChipProps } from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import MicIcon from '@mui/icons-material/Mic';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import type { MeetingStatus, Priority, ActionItemStatus } from '../types/meeting';

interface MeetingStatusBadgeProps {
  status: MeetingStatus;
  size?: 'small' | 'medium';
}

export const MeetingStatusBadge: React.FC<MeetingStatusBadgeProps> = ({ status, size = 'small' }) => {
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
      }}
    />
  );
};

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'small' | 'medium';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'small' }) => {
  let label = 'Medium';
  let color: ChipProps['color'] = 'warning';

  switch (priority) {
    case 'HIGH':
      label = 'High Priority';
      color = 'error';
      break;
    case 'MEDIUM':
      label = 'Medium';
      color = 'warning';
      break;
    case 'LOW':
      label = 'Low';
      color = 'default';
      break;
  }

  return (
    <Chip
      size={size}
      label={label}
      color={color}
      sx={{
        fontWeight: 600,
        fontSize: '0.7rem',
        height: 22,
      }}
    />
  );
};

interface ActionStatusBadgeProps {
  status: ActionItemStatus;
  size?: 'small' | 'medium';
}

export const ActionStatusBadge: React.FC<ActionStatusBadgeProps> = ({ status, size = 'small' }) => {
  let label = 'To Do';
  let color: ChipProps['color'] = 'default';

  switch (status) {
    case 'TODO':
      label = 'To Do';
      color = 'default';
      break;
    case 'IN_PROGRESS':
      label = 'In Progress';
      color = 'primary';
      break;
    case 'DONE':
      label = 'Done';
      color = 'success';
      break;
  }

  return (
    <Chip
      size={size}
      label={label}
      color={color}
      variant={status === 'DONE' ? 'filled' : 'outlined'}
      sx={{
        fontWeight: 600,
        fontSize: '0.75rem',
      }}
    />
  );
};
