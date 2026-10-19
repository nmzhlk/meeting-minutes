import { Chip, type ChipProps } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import type { ActionItemStatus } from '../model/types';

interface ActionItemStatusBadgeProps {
  status: ActionItemStatus;
  size?: 'small' | 'medium';
}

export const ActionItemStatusBadge = ({
  status,
  size = 'small',
}: ActionItemStatusBadgeProps) => {
  let label = 'To Do';
  let color: ChipProps['color'] = 'default';
  let icon = <RadioButtonUncheckedIcon sx={{ fontSize: 14 }} />;

  switch (status) {
    case 'TODO':
      label = 'To Do';
      color = 'default';
      icon = <RadioButtonUncheckedIcon sx={{ fontSize: 14 }} />;
      break;
    case 'IN_PROGRESS':
      label = 'In Progress';
      color = 'primary';
      icon = <AutorenewIcon sx={{ fontSize: 14 }} />;
      break;
    case 'DONE':
      label = 'Done';
      color = 'success';
      icon = <CheckCircleIcon sx={{ fontSize: 14 }} />;
      break;
  }

  return (
    <Chip
      size={size}
      label={label}
      color={color}
      icon={icon}
      variant={status === 'DONE' ? 'filled' : 'outlined'}
      sx={{
        fontWeight: 600,
        fontSize: '0.75rem',
        borderRadius: 1.5,
      }}
    />
  );
};
