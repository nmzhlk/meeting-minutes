import { useState, type SyntheticEvent } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
  Collapse,
  Alert,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { CreateMeetingInput, Participant } from '../../../shared/types';
import { ParticipantChip } from '../../../entities/participant';
import {
  getDefaultMeetingDate,
  validateMeetingTitle,
  validateMeetingDuration,
  validateMeetingDate,
} from '../../../shared/lib';

interface CreateMeetingFormProps {
  onSubmit: (input: CreateMeetingInput) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const CreateMeetingForm = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CreateMeetingFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(getDefaultMeetingDate);
  const [durationMinutes, setDurationMinutes] = useState('45');

  const [participants, setParticipants] = useState<Participant[]>([
    { id: 'p1', name: 'John Doe', email: 'john@example.com', role: 'Organizer' },
  ]);
  const [participantInput, setParticipantInput] = useState('');
  const [participantRole, setParticipantRole] = useState('Developer');

  const [agendaList, setAgendaList] = useState<string[]>([
    'Review agenda & open topics',
    'Discuss architectural decisions',
  ]);
  const [newAgendaPoint, setNewAgendaPoint] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleAddParticipant = () => {
    const trimmed = participantInput.trim();
    if (!trimmed) return;

    const email = `${trimmed.toLowerCase().replace(/\s+/g, '.')}@example.com`;
    const newParticipant: Participant = {
      id: `p-${Date.now()}`,
      name: trimmed,
      email,
      role: participantRole.trim() || 'Participant',
    };

    setParticipants((prev) => [...prev, newParticipant]);
    setParticipantInput('');
  };

  const handleRemoveParticipant = (id: string) => {
    if (participants.length <= 1) {
      setGeneralError('A meeting must have at least one participant / organizer.');
      return;
    }
    setGeneralError(null);
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddAgendaPoint = () => {
    const trimmed = newAgendaPoint.trim();
    if (!trimmed) return;
    setAgendaList((prev) => [...prev, trimmed]);
    setNewAgendaPoint('');
  };

  const handleRemoveAgendaPoint = (indexToRemove: number) => {
    setAgendaList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const titleErr = validateMeetingTitle(title);
    if (titleErr) newErrors.title = titleErr;

    const durationErr = validateMeetingDuration(durationMinutes);
    if (durationErr) newErrors.duration = durationErr;

    const dateErr = validateMeetingDate(date);
    if (dateErr) newErrors.date = dateErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) {
      return;
    }

    const payload: CreateMeetingInput = {
      title: title.trim(),
      description: description.trim(),
      date: new Date(date).toISOString(),
      durationMinutes: Number(durationMinutes),
      participants,
      agenda: agendaList,
    };

    try {
      await onSubmit(payload);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to schedule meeting';
      setGeneralError(msg);
    }
  };

  return (
    <Card
      elevation={0}
      component="form"
      onSubmit={handleSubmit}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        bgcolor: 'background.paper',
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
        {generalError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setGeneralError(null)}>
            {generalError}
          </Alert>
        )}

        <Stack spacing={3.5}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.1rem' }}>
              1. Meeting Information
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              Specify the subject, agenda goal, and description of your session.
            </Typography>

            <Stack spacing={2.5}>
              <TextField
                label="Meeting Title"
                placeholder="e.g., Sprint Retrospective & Architecture Alignment"
                fullWidth
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                }}
                error={Boolean(errors.title)}
                helperText={errors.title || 'Minimum 3 characters'}
              />

              <TextField
                label="Description"
                placeholder="Briefly describe the context, expected outputs, or background notes..."
                fullWidth
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                helperText="Optional context for attendees"
              />
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.1rem' }}>
              2. Scheduling & Duration
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              Set when the session starts and its planned duration.
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr' }, gap: 2.5 }}>
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
                label="Duration (minutes)"
                type="number"
                fullWidth
                required
                value={durationMinutes}
                onChange={(e) => {
                  setDurationMinutes(e.target.value);
                  if (errors.duration) setErrors((prev) => ({ ...prev, duration: '' }));
                }}
                error={Boolean(errors.duration)}
                helperText={errors.duration || 'Between 5 and 480 min'}
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
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.1rem' }}>
              3. Attendees & Stakeholders
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Add team members who will participate or receive the minutes.
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {participants.map((p) => (
                <ParticipantChip
                  key={p.id}
                  participant={p}
                  onDelete={participants.length > 1 ? () => handleRemoveParticipant(p.id) : undefined}
                />
              ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Attendee name (e.g., Alice Smith)"
                value={participantInput}
                onChange={(e) => setParticipantInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddParticipant();
                  }
                }}
                sx={{ flex: 2, minWidth: 200 }}
              />
              <TextField
                size="small"
                placeholder="Role (e.g. Developer, Designer)"
                value={participantRole}
                onChange={(e) => setParticipantRole(e.target.value)}
                sx={{ flex: 1, minWidth: 140 }}
              />
              <Button
                variant="outlined"
                color="primary"
                startIcon={<PersonAddIcon />}
                onClick={handleAddParticipant}
                disabled={!participantInput.trim()}
              >
                Add
              </Button>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.1rem' }}>
              4. Meeting Agenda Points
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Define talking points to guide discussion alignment.
            </Typography>

            <List disablePadding sx={{ mb: 2 }}>
              {agendaList.map((point, index) => (
                <Collapse key={index} in={true}>
                  <ListItem
                    sx={{
                      px: 2,
                      py: 1,
                      mb: 1,
                      borderRadius: 2,
                      bgcolor: 'background.default',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => handleRemoveAgendaPoint(index)}
                        color="default"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <FormatListBulletedIcon
                      fontSize="small"
                      sx={{ color: 'primary.main', mr: 1.5, fontSize: 18 }}
                    />
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {point}
                        </Typography>
                      }
                    />
                  </ListItem>
                </Collapse>
              ))}
            </List>

            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <TextField
                size="small"
                placeholder="Add agenda point (e.g., Review Q3 KPIs)"
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
                Add Point
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Button variant="outlined" color="inherit" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{ px: 3.5 }}
            >
              {isSubmitting ? 'Scheduling...' : 'Schedule Meeting'}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
