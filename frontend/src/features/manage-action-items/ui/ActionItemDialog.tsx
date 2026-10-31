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
  Alert,
} from '@mui/material';
import type { CreateActionItemInput, Participant, Priority } from '../../../shared/types';
import { validateActionItemTitle } from '../../../shared/lib';
import { usersApi } from '../../../shared/api';

interface ActionItemDialogProps {
  open: boolean;
  participants: Participant[];
  onClose: () => void;
  onSubmit: (input: CreateActionItemInput) => Promise<void> | void;
  isSubmitting?: boolean;
}

interface ActionItemFormContentProps {
  participants: Participant[];
  onClose: () => void;
  onSubmit: (input: CreateActionItemInput) => Promise<void> | void;
  isSubmitting?: boolean;
}

const ActionItemFormContent = ({
  participants,
  onClose,
  onSubmit,
  isSubmitting: externalSubmitting = false,
}: ActionItemFormContentProps) => {
  const [title, setTitle] = useState('');
  const [assigneeId, setAssigneeId] = useState(() => participants[0]?.id || '');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().slice(0, 10);
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fetchedUsers, setFetchedUsers] = useState<Participant[]>([]);

  useEffect(() => {
    if (participants.length > 0) return;
    let isMounted = true;
    usersApi
      .getUsers()
      .then((users) => {
        if (isMounted) {
          setFetchedUsers(users);
          if (users.length > 0) {
            setAssigneeId((prev) => prev || users[0].id);
          }
        }
      })
      .catch(() => {
        // Keep existing list on error
      });
    return () => {
      isMounted = false;
    };
  }, [participants.length]);

  const userList = participants.length > 0 ? participants : fetchedUsers;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const titleErr = validateActionItemTitle(title);
    if (titleErr) {
      setError(titleErr);
      return;
    }

    const selectedAssignee = assigneeId
      ? userList.find((p) => p.id === assigneeId) || null
      : null;

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        assigneeId: selectedAssignee ? selectedAssignee.id : null,
        assignee: selectedAssignee,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        priority,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create action item';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const isBusy = submitting || externalSubmitting;

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Add New Action Item</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1.5 }}>
        <Typography variant="body2" color="text.secondary">
          Assign a follow-up task with a clear owner, priority, and deadline
        </Typography>

        {error && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}

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
          disabled={isBusy}
          error={Boolean(error)}
          helperText="Clear description of deliverables"
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="assignee-select-label">Assignee</InputLabel>
            <Select
              labelId="assignee-select-label"
              value={assigneeId}
              label="Assignee"
              onChange={(e) => setAssigneeId(e.target.value)}
              disabled={isBusy}
            >
              <MenuItem value="">
                <em>Unassigned</em>
              </MenuItem>
              {userList.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name} ({p.role || p.email})
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
              disabled={isBusy}
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
          disabled={isBusy}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button onClick={onClose} color="inherit" disabled={isBusy}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary" disabled={isBusy}>
          {isBusy ? 'Adding...' : 'Add Task'}
        </Button>
      </DialogActions>
    </form>
  );
};

export const ActionItemDialog = ({
  open,
  participants,
  onClose,
  onSubmit,
  isSubmitting = false,
}: ActionItemDialogProps) => {
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
      {open && (
        <ActionItemFormContent
          participants={participants}
          onClose={onClose}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </Dialog>
  );
};
