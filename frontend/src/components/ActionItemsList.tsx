import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Avatar,
  Tooltip,
  Select,
  MenuItem,
  Checkbox,
} from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import type { ActionItem, ActionItemStatus } from '../types/meeting';
import { PriorityBadge } from './StatusBadge';

interface ActionItemsListProps {
  items: ActionItem[];
  onStatusChange?: (itemId: string, newStatus: ActionItemStatus) => void;
}

export const ActionItemsList: React.FC<ActionItemsListProps> = ({ items, onStatusChange }) => {
  if (!items || items.length === 0) {
    return (
      <Box
        sx={{
          py: 6,
          px: 2,
          textAlign: 'center',
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '1px dashed',
          borderColor: 'divider',
        }}
      >
        <AssignmentTurnedInIcon sx={{ fontSize: 42, color: 'text.secondary', mb: 1, opacity: 0.6 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          No action items yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Action items identified during the meeting will be listed here.
        </Typography>
      </Box>
    );
  }

  const handleCheckboxToggle = (item: ActionItem) => {
    if (!onStatusChange) return;
    const nextStatus: ActionItemStatus = item.status === 'DONE' ? 'TODO' : 'DONE';
    onStatusChange(item.id, nextStatus);
  };

  const handleSelectChange = (itemId: string, newStatus: ActionItemStatus) => {
    if (!onStatusChange) return;
    onStatusChange(itemId, newStatus);
  };

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: 'background.default' }}>
            <TableCell sx={{ width: 50 }}>Status</TableCell>
            <TableCell>Action Item</TableCell>
            <TableCell sx={{ width: 140 }}>Assignee</TableCell>
            <TableCell sx={{ width: 130 }}>Priority</TableCell>
            <TableCell sx={{ width: 130 }}>Due Date</TableCell>
            <TableCell sx={{ width: 150 }}>Progress</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => {
            const isDone = item.status === 'DONE';
            const initials = item.assignee.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase();

            return (
              <TableRow
                key={item.id}
                hover
                sx={{
                  bgcolor: isDone ? 'rgba(0, 0, 0, 0.015)' : 'inherit',
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                {/* Checkbox */}
                <TableCell>
                  <Checkbox
                    checked={isDone}
                    onChange={() => handleCheckboxToggle(item)}
                    color="success"
                    size="small"
                  />
                </TableCell>

                {/* Title */}
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      textDecoration: isDone ? 'line-through' : 'none',
                      color: isDone ? 'text.secondary' : 'text.primary',
                    }}
                  >
                    {item.title}
                  </Typography>
                </TableCell>

                {/* Assignee */}
                <TableCell>
                  <Tooltip title={`${item.assignee.name} (${item.assignee.role})`}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          fontSize: '0.75rem',
                          bgcolor: 'secondary.main',
                        }}
                      >
                        {initials}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontSize: '0.85rem' }} noWrap>
                        {item.assignee.name}
                      </Typography>
                    </Box>
                  </Tooltip>
                </TableCell>

                {/* Priority */}
                <TableCell>
                  <PriorityBadge priority={item.priority} />
                </TableCell>

                {/* Due Date */}
                <TableCell>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                    {new Date(item.dueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Typography>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Select
                    size="small"
                    value={item.status}
                    onChange={(e) => handleSelectChange(item.id, e.target.value as ActionItemStatus)}
                    sx={{
                      fontSize: '0.8rem',
                      height: 32,
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
