import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  LinearProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import type { Meeting, ActionItemStatus } from '../types/meeting';
import { MeetingStatusBadge } from '../components/StatusBadge';
import { ActionItemsList } from '../components/ActionItemsList';

interface MeetingDetailsPageProps {
  meetings: Meeting[];
  onActionStatusChange: (meetingId: string, actionId: string, status: ActionItemStatus) => void;
}

export const MeetingDetailsPage: React.FC<MeetingDetailsPageProps> = ({
  meetings,
  onActionStatusChange,
}) => {
  const { id } = useParams<{ id: string }>();
  const meeting = meetings.find((m) => m.id === id);

  const [copied, setCopied] = useState(false);

  if (!meeting) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          Meeting Not Found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          The requested meeting session could not be found or may have been removed.
        </Typography>
        <Button component={Link} to="/" variant="contained">
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  const handleActionStatusChange = (actionId: string, newStatus: ActionItemStatus) => {
    onActionStatusChange(meeting.id, actionId, newStatus);
  };

  const handleCopySummary = () => {
    if (!meeting.summary) return;
    navigator.clipboard.writeText(meeting.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalTasks = meeting.actionItems ? meeting.actionItems.length : 0;
  const doneTasks = meeting.actionItems
    ? meeting.actionItems.filter((i) => i.status === 'DONE').length
    : 0;
  const progressPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto' }}>
      <Button
        component={Link}
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2, color: 'text.secondary', textTransform: 'none' }}
      >
        Back to Dashboard
      </Button>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, mb: 3 }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1.5, mb: 1.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', sm: '1.85rem' } }}>
              {meeting.title}
            </Typography>
            <MeetingStatusBadge status={meeting.status} size="medium" />
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 2.5 }}>
            {meeting.description}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <CalendarMonthIcon fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {new Date(meeting.date).toLocaleString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <AccessTimeIcon fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {meeting.durationMinutes} minutes
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 2.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Participants ({meeting.participants.length})
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 1 }}>
              {meeting.participants.map((p) => (
                <Box
                  key={p.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    bgcolor: 'background.default',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'secondary.main' }}>
                    {p.name.charAt(0)}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                    {p.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    • {p.role}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {meeting.agenda && meeting.agenda.length > 0 && (
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                Meeting Agenda
              </Typography>
              <List dense disablePadding>
                {meeting.agenda.map((item, idx) => (
                  <ListItem key={idx} disableGutters sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 28, color: 'primary.main', fontWeight: 600, fontSize: '0.85rem' }}>
                      {idx + 1}.
                    </ListItemIcon>
                    <ListItemText primary={<Typography variant="body2">{item}</Typography>} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                AI Summary
              </Typography>
              {meeting.summary && (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={copied ? <CheckIcon color="success" sx={{ fontSize: 16 }} /> : <ContentCopyIcon sx={{ fontSize: 16 }} />}
                  onClick={handleCopySummary}
                  sx={{ textTransform: 'none', fontSize: '0.8rem', py: 0.2, px: 1.2 }}
                >
                  {copied ? 'Copied!' : 'Copy Summary'}
                </Button>
              )}
            </Box>

            {meeting.summary ? (
              <Box>
                <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'text.primary', mb: 2.5 }}>
                  {meeting.summary}
                </Typography>

                {meeting.keyDecisions && meeting.keyDecisions.length > 0 && (
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}>
                      Key Decisions
                    </Typography>
                    <List dense disablePadding>
                      {meeting.keyDecisions.map((decision, idx) => (
                        <ListItem key={idx} disableGutters sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <CheckCircleIcon color="success" sx={{ fontSize: 18 }} />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">{decision}</Typography>} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            ) : (
              <Alert severity="info" variant="outlined" sx={{ borderRadius: 2 }}>
                Protocol summarization will be generated once discussion notes or audio files are submitted.
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Action Items & Tasks
              </Typography>
              {totalTasks > 0 && (
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.85rem' }}>
                  Completed: {doneTasks} of {totalTasks} ({progressPercent}%)
                </Typography>
              )}
            </Box>

            {totalTasks > 0 && (
              <LinearProgress
                variant="determinate"
                value={progressPercent}
                sx={{ height: 6, borderRadius: 3, mb: 2.5 }}
              />
            )}

            <ActionItemsList
              items={meeting.actionItems || []}
              onStatusChange={handleActionStatusChange}
            />
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Meeting Audio & Recording
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Audio file or transcript used for protocol generation and analysis.
            </Typography>

            {meeting.audioFileName ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 2,
                  bgcolor: 'background.default',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <GraphicEqIcon color="primary" />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {meeting.audioFileName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Audio recording attached • Status: Processed
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: 'background.default',
                  borderRadius: 2,
                  border: '1px dashed',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  No audio recording attached to this session.
                </Typography>
                <Button size="small" variant="outlined" sx={{ textTransform: 'none' }}>
                  Upload Audio File
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
