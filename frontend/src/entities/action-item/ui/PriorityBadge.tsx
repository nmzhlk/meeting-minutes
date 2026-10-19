import { Chip, type ChipProps } from '@mui/material';
import type { Priority } from '../model/types';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'small' | 'medium';
}

export const PriorityBadge = ({ priority, size = 'small' }: PriorityBadgeProps) => {
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
        borderRadius: 1.5,
      }}
    />
  );
};
