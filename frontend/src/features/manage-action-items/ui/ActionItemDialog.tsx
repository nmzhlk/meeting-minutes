import { useState, useEffect, type SyntheticEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import type { CreateActionItemInput, Participant, Priority } from '../../../shared/types';
import { validateActionItemTitle } from '../../../shared/lib';

interface ActionItemDialogProps {
  open: boolean;
  participants: Participant[];
  onClose: () => void;
  onSubmit: (input: CreateActionItemInput) => Promise<void> | void;
  isSubmitting?: boolean;
}

export const ActionItemDialog = ({
  open,
  participants,
  onClose,
  onSubmit,
  isSubmitting = false,
}: ActionItemDialogProps) => {
  const [title, setTitle] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().slice(0, 10);
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTitle('');
      setError(null);
      if (participants.length > 0) {
        setAssigneeId(participants[0].id);
      }
      const d = new Date();
      d.setDate(d.getDate() + 3);
      setDueDate(d.toISOString().slice(0, 10));
    }
  }, [open, participants]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const titleErr = validateActionItemTitle(title);
    if (titleErr) {
      setError(titleErr);
      return;
    }

    const selectedAssignee =
      participants.find((p) => p.id === assigneeId) ||
      participants[0] || {
        id: 'p1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Participant',
      };

    await onSubmit({
      title: title.trim(),
      assignee: selectedAssignee,
      dueDate: new Date(dueDate).toISOString(),
      priority,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3, p: 1 },
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Add New Action Item</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            Assign a follow-up task with a clear owner, priority, and deadline.
          </Typography>

          <TextField
            label="Action Item Description"
            placeholder="e.g., Prepare slide deck for stakeholder review"
            fullWidth
            required
            autoFocus
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError(null);
            }}
            error={Boolean(error)}
            helperText={error || 'Clear description of deliverables'}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="assignee-select-label">Assignee</InputLabel>
              <Select
                labelId="assignee-select-label"
                value={assigneeId}
                label="Assignee"
                onChange={(e) => setAssigneeId(e.target.value)}
              >
                {participants.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name} ({p.role || 'Member'})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel id="priority-select-label">Priority</InputLabel>
              <Select
                labelId="priority-select-label"
                value={priority}
                label="Priority"
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High Priority</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField
            label="Due Date"
            type="date"
            fullWidth
            size="small"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
          <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
