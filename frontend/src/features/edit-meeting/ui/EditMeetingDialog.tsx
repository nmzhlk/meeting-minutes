import { useState, type SyntheticEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  IconButton,
  InputAdornment,
  Divider,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import type { Meeting, MeetingStatus, UpdateMeetingInput } from '../../../shared/types';
import {
  toInputDateTimeString,
  validateMeetingTitle,
  validateMeetingDuration,
  validateMeetingDate,
} from '../../../shared/lib';

interface EditMeetingDialogProps {
  open: boolean;
  meeting: Meeting;
  onClose: () => void;
  onSubmit: (input: UpdateMeetingInput) => Promise<void> | void;
  isSubmitting?: boolean;
}

interface EditMeetingFormContentProps {
  meeting: Meeting;
  onClose: () => void;
  onSubmit: (input: UpdateMeetingInput) => Promise<void> | void;
  isSubmitting?: boolean;
}

const EditMeetingFormContent = ({
  meeting,
  onClose,
  onSubmit,
  isSubmitting = false,
}: EditMeetingFormContentProps) => {
  const [title, setTitle] = useState(meeting.title);
  const [description, setDescription] = useState(meeting.description || '');
  const [date, setDate] = useState(() => {
    try {
      return toInputDateTimeString(new Date(meeting.date));
    } catch {
      return meeting.date;
    }
  });
  const [durationMinutes, setDurationMinutes] = useState(String(meeting.durationMinutes));
  const [status, setStatus] = useState<MeetingStatus>(meeting.status);
  const [agendaList, setAgendaList] = useState<string[]>(meeting.agenda || []);
  const [newAgendaPoint, setNewAgendaPoint] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleAddAgendaPoint = () => {
    const trimmed = newAgendaPoint.trim();
    if (!trimmed) return;
    setAgendaList((prev) => [...prev, trimmed]);
    setNewAgendaPoint('');
  };

  const handleRemoveAgendaPoint = (idx: number) => {
    setAgendaList((prev) => prev.filter((_, i) => i !== idx));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    const titleErr = validateMeetingTitle(title);
    if (titleErr) errs.title = titleErr;

    const durationErr = validateMeetingDuration(durationMinutes);
    if (durationErr) errs.duration = durationErr;

    const dateErr = validateMeetingDate(date);
    if (dateErr) errs.date = dateErr;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) return;

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        date: new Date(date).toISOString(),
        durationMinutes: Number(durationMinutes),
        status,
        agenda: agendaList,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update meeting';
      setGeneralError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 700 }}>
        <EditIcon color="primary" />
        Edit Meeting Details
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1.5 }}>
        {generalError && (
          <Alert severity="error" sx={{ borderRadius: 2 }} onClose={() => setGeneralError(null)}>
            {generalError}
          </Alert>
        )}

        <TextField
          label="Meeting Title"
          fullWidth
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
          }}
          error={Boolean(errors.title)}
          helperText={errors.title}
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          helperText="Optional context for attendees"
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr' }, gap: 2 }}>
          <TextField
            label="Date & Time"
            type="datetime-local"
            fullWidth
            required
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));
            }}
            error={Boolean(errors.date)}
            helperText={errors.date}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonthIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            label="Duration (min)"
            type="number"
            fullWidth
            required
            value={durationMinutes}
            onChange={(e) => {
              setDurationMinutes(e.target.value);
              if (errors.duration) setErrors((prev) => ({ ...prev, duration: '' }));
            }}
            error={Boolean(errors.duration)}
            helperText={errors.duration}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <AccessTimeIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <FormControl fullWidth>
            <InputLabel id="edit-meeting-status-label">Status</InputLabel>
            <Select
              labelId="edit-meeting-status-label"
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value as MeetingStatus)}
            >
              <MenuItem value="SCHEDULED">Scheduled</MenuItem>
              <MenuItem value="RECORDED">Recorded</MenuItem>
              <MenuItem value="PROCESSED">Processed</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            Agenda Topics
          </Typography>

          <List disablePadding sx={{ mb: 1.5 }}>
            {agendaList.map((point, idx) => (
              <ListItem
                key={idx}
                sx={{
                  px: 2,
                  py: 0.75,
                  mb: 0.75,
                  borderRadius: 2,
                  bgcolor: 'background.default',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
                secondaryAction={
                  <IconButton size="small" onClick={() => handleRemoveAgendaPoint(idx)} color="default">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
              >
                <FormatListBulletedIcon fontSize="small" sx={{ color: 'primary.main', mr: 1.5, fontSize: 18 }} />
                <ListItemText primary={<Typography variant="body2">{point}</Typography>} />
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              placeholder="Add agenda topic..."
              fullWidth
              value={newAgendaPoint}
              onChange={(e) => setNewAgendaPoint(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddAgendaPoint();
                }
              }}
            />
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddAgendaPoint}
              disabled={!newAgendaPoint.trim()}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Add Topic
            </Button>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </form>
  );
};

export const EditMeetingDialog = ({
  open,
  meeting,
  onClose,
  onSubmit,
  isSubmitting = false,
}: EditMeetingDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3, p: 1 },
        },
      }}
    >
      {open && (
        <EditMeetingFormContent
          meeting={meeting}
          onClose={onClose}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </Dialog>
  );
};
