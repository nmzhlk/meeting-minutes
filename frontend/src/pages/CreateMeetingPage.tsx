import { useState, type SyntheticEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { CreateMeetingInput, Participant } from '../types/meeting';

interface CreateMeetingPageProps {
  onCreate: (input: CreateMeetingInput) => void;
}

export const CreateMeetingPage = ({ onCreate }: CreateMeetingPageProps) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    return tomorrow.toISOString().slice(0, 16);
  });
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [participantsText, setParticipantsText] = useState('');
  const [agendaList, setAgendaList] = useState<string[]>([]);
  const [newAgendaPoint, setNewAgendaPoint] = useState('');
  const [error, setError] = useState('');

  const handleAddAgendaPoint = () => {
    if (!newAgendaPoint.trim()) return;
    setAgendaList([...agendaList, newAgendaPoint.trim()]);
    setNewAgendaPoint('');
  };

  const handleRemoveAgendaPoint = (indexToRemove: number) => {
    setAgendaList(agendaList.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please provide a meeting title.');
      return;
    }

    const participants: Participant[] = participantsText
      .split(',')
      .map((name, i) => ({
        id: `p-${Date.now()}-${i}`,
        name: name.trim(),
        email: `${name.trim().toLowerCase().replace(/\s+/g, '.')}@example.com`,
        role: 'Participant',
      }))
      .filter((p) => p.name.length > 0);

    const input: CreateMeetingInput = {
      title: title.trim(),
      description: description.trim(),
      date: new Date(date),
      durationMinutes: Math.max(5, Number(durationMinutes) || 30),
      participants:
        participants.length > 0
          ? participants
          : [{ id: 'p-1', name: 'John Doe', email: 'john@example.com', role: 'Organizer' }],
      agenda: agendaList,
    };

    onCreate(input);
    navigate('/');
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Button
        component={Link}
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2, color: 'text.secondary', textTransform: 'none' }}
      >
        Back to Dashboard
      </Button>

      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Schedule a New Meeting
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Define your meeting agenda, schedule, and invite participants to prepare for protocol generation
      </Typography>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              <TextField
                required
                label="Meeting Title"
                placeholder="e.g. Sprint Planning"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError('');
                }}
                error={Boolean(error)}
                helperText={error || undefined}
                fullWidth
              />

              <TextField
                label="Description"
                placeholder="Brief summary of the meeting context and goals..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={2}
                fullWidth
              />

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr' },
                  gap: 2,
                }}
              >
                <TextField
                  label="Date & Time"
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Duration (minutes)"
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  slotProps={{ htmlInput: { min: 5, max: 480, step: 5 } }}
                  fullWidth
                />
              </Box>

              <TextField
                label="Participants (comma-separated)"
                placeholder="e.g. John Doe, Alice Smith"
                value={participantsText}
                onChange={(e) => setParticipantsText(e.target.value)}
                helperText="Enter full names separated by commas (optional, defaults to organizer)"
                fullWidth
              />

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Meeting Agenda
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                  <TextField
                    size="small"
                    placeholder="Add an agenda topic..."
                    value={newAgendaPoint}
                    onChange={(e) => setNewAgendaPoint(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAgendaPoint();
                      }
                    }}
                    fullWidth
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddAgendaPoint}
                    startIcon={<AddIcon />}
                    sx={{ textTransform: 'none', px: 2 }}
                  >
                    Add
                  </Button>
                </Box>

                {agendaList.length > 0 ? (
                  <List dense sx={{ bgcolor: 'background.default', borderRadius: 1.5, p: 0.5 }}>
                    {agendaList.map((item, idx) => (
                      <ListItem
                        key={idx}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => handleRemoveAgendaPoint(idx)}
                            aria-label="remove agenda point"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={<Typography variant="body2">{`${idx + 1}. ${item}`}</Typography>}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 1, fontStyle: 'italic' }}>
                    No agenda topics added yet
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 1 }}>
                <Button
                  component={Link}
                  to="/"
                  variant="text"
                  sx={{ textTransform: 'none', color: 'text.secondary' }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ px: 3, textTransform: 'none' }}
                >
                  Schedule Meeting
                </Button>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
