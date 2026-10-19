import {
  TableRow,
  TableCell,
  Checkbox,
  Typography,
  Box,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ActionItem, ActionItemStatus } from '../model/types';
import { PriorityBadge } from './PriorityBadge';
import { ParticipantAvatar } from '../../participant';
import { formatDate } from '../../../shared/lib';

interface ActionItemRowProps {
  item: ActionItem;
  onStatusChange?: (itemId: string, newStatus: ActionItemStatus) => void;
  onDelete?: (itemId: string) => void;
}

export const ActionItemRow = ({ item, onStatusChange, onDelete }: ActionItemRowProps) => {
  const isDone = item.status === 'DONE';

  const handleToggle = () => {
    if (!onStatusChange) return;
    const nextStatus: ActionItemStatus = isDone ? 'TODO' : 'DONE';
    onStatusChange(item.id, nextStatus);
  };

  return (
    <TableRow
      hover
      sx={{
        bgcolor: isDone ? 'rgba(0, 0, 0, 0.015)' : 'inherit',
        transition: 'background-color 0.2s',
        '&:last-child td, &:last-child th': { border: 0 },
      }}
    >
      <TableCell sx={{ width: 48, p: 1 }}>
        <Checkbox
          checked={isDone}
          onChange={handleToggle}
          color="success"
          size="small"
          aria-label={`Mark task as ${isDone ? 'incomplete' : 'complete'}`}
        />
      </TableCell>

      <TableCell>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            textDecoration: isDone ? 'line-through' : 'none',
            color: isDone ? 'text.secondary' : 'text.primary',
            opacity: isDone ? 0.65 : 1,
            transition: 'color 0.25s ease, opacity 0.25s ease',
          }}
        >
          {item.title}
        </Typography>
      </TableCell>

      <TableCell sx={{ width: 160 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ParticipantAvatar participant={item.assignee} size={28} />
          <Typography variant="body2" sx={{ fontSize: '0.85rem' }} noWrap>
            {item.assignee.name}
          </Typography>
        </Box>
      </TableCell>

      <TableCell sx={{ width: 120 }}>
        <PriorityBadge priority={item.priority} />
      </TableCell>

      <TableCell sx={{ width: 120 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
          {formatDate(item.dueDate)}
        </Typography>
      </TableCell>

      <TableCell sx={{ width: 140 }}>
        {onStatusChange ? (
          <Select
            size="small"
            value={item.status}
            onChange={(e) => onStatusChange(item.id, e.target.value as ActionItemStatus)}
            sx={{
              fontSize: '0.8rem',
              height: 32,
              borderRadius: 1.5,
              bgcolor:
                item.status === 'DONE'
                  ? 'success.light'
                  : item.status === 'IN_PROGRESS'
                    ? 'primary.light'
                    : 'grey.100',
              color:
                item.status === 'DONE'
                  ? 'success.contrastText'
                  : item.status === 'IN_PROGRESS'
                    ? 'primary.contrastText'
                    : 'text.primary',
              '& .MuiSelect-select': {
                py: 0.5,
                px: 1.5,
              },
            }}
          >
            <MenuItem value="TODO">To Do</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="DONE">Done</MenuItem>
          </Select>
        ) : (
          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
            {item.status}
          </Typography>
        )}
      </TableCell>

      {onDelete && (
        <TableCell sx={{ width: 48, p: 1, textAlign: 'right' }}>
          <Tooltip title="Delete task">
            <IconButton size="small" onClick={() => onDelete(item.id)} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </TableCell>
      )}
    </TableRow>
  );
};
