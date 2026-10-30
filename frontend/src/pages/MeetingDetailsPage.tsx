import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Fade,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import type { Meeting, ActionItemStatus, CreateActionItemInput, UpdateMeetingInput } from '../shared/types';
import { meetingStorage, meetingsApi } from '../shared/api';
import { formatDateTime } from '../shared/lib';
import { EmptyState, MeetingDetailsSkeleton, useFeedback } from '../shared/ui';
import { MeetingStatusBadge } from '../entities/meeting';
import { ActionItemRow } from '../entities/action-item';
import { ParticipantAvatar } from '../entities/participant';
import { ActionItemDialog } from '../features/manage-action-items';
import { AIProcessDialog } from '../features/process-meeting-ai';
import { DeleteMeetingButton } from '../features/delete-meeting';
import { EditMeetingDialog } from '../features/edit-meeting';
import { useAuth } from '../features/auth';

export const MeetingDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const feedback = useFeedback();
  const { user } = useAuth();

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    meetingStorage.getMeetingById(id).then((data) => {
      if (isMounted) {
        setMeeting(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <MeetingDetailsSkeleton />;
  }

  if (!meeting) {
    return (
      <EmptyState
        title="Meeting Not Found"
        description="The requested meeting session could not be found or may have been deleted."
        actionLabel="Back to Dashboard"
        onAction={() => navigate('/')}
        actionIcon={<ArrowBackIcon />}
      />
    );
  }

  const actionItems = meeting.actionItems || [];
  const totalTasks = actionItems.length;
  const doneTasks = actionItems.filter((i) => i.status === 'DONE').length;
  const progressPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const handleCopySummary = () => {
    if (!meeting.summary) return;
    navigator.clipboard.writeText(meeting.summary);
    feedback.showSuccess('Meeting summary copied to clipboard!');
  };

  const handleActionStatusChange = async (actionId: string, status: ActionItemStatus) => {
    if (!meeting) return;
    try {
      await meetingStorage.updateActionItemStatus(meeting.id, actionId, status);
      setMeeting((prev) => {
        if (!prev || !prev.actionItems) return prev;
        return {
          ...prev,
          actionItems: prev.actionItems.map((item) =>
            item.id === actionId ? { ...item, status } : item
          ),
        };
      });
      feedback.showInfo(`Task status updated to ${status}`);
    } catch {
      feedback.showError('Failed to update task status');
    }
  };

  const handleDeleteActionItem = async (actionId: string) => {
    if (!meeting) return;
    try {
      await meetingStorage.deleteActionItem(meeting.id, actionId);
      setMeeting((prev) => {
        if (!prev || !prev.actionItems) return prev;
        return {
          ...prev,
          actionItems: prev.actionItems.filter((item) => item.id !== actionId),
        };
      });
      feedback.showSuccess('Action item removed');
    } catch {
      feedback.showError('Failed to delete action item');
    }
  };

  const handleAddActionItem = async (input: CreateActionItemInput) => {
    if (!meeting) return;
    try {
      const newItem = await meetingStorage.addActionItem(meeting.id, input);
      setMeeting((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          actionItems: [...(prev.actionItems || []), newItem],
        };
      });
      setIsTaskDialogOpen(false);
      feedback.showSuccess('New action item created!');
    } catch {
      feedback.showError('Failed to create action item');
    }
  };

  const handleCompleteAIProcess = async () => {
    if (!meeting) return;
    try {
      const updated = await meetingStorage.processMeetingWithAI(meeting.id);
      setMeeting(updated);
      feedback.showSuccess('AI protocol, summary, and action items generated!');
    } catch {
      feedback.showError('Failed to generate AI protocol');
    }
  };

  const handleDeleteMeeting = async () => {
    if (!meeting) return;
    try {
      await meetingStorage.deleteMeeting(meeting.id);
      feedback.showSuccess('Meeting permanently deleted');
      navigate('/');
    } catch {
      feedback.showError('Failed to delete meeting');
    }
  };

  const isOwner = Boolean(user && meeting && (!meeting.ownerId || meeting.ownerId === user.id));

  const handleUpdateMeeting = async (input: UpdateMeetingInput) => {
    if (!meeting) return;
    try {
      const updated = await meetingsApi.updateMeeting(meeting.id, input);
      setMeeting((prev) => (prev ? { ...prev, ...updated } : updated));
      feedback.showSuccess('Meeting details updated successfully!');
      setIsEditDialogOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update meeting';
      feedback.showError(msg);
      throw err;
    }
  };

  return (
    <Fade in={true} timeout={300}>
      <Box sx={{ maxWidth: 1040, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{ color: 'text.secondary', textTransform: 'none' }}
        >
          Back to Dashboard
        </Button>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          {isOwner && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setIsEditDialogOpen(true)}
              sx={{ borderRadius: 2 }}
            >
              Edit Meeting
            </Button>
          )}

          {meeting.status !== 'PROCESSED' && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AutoAwesomeIcon />}
              onClick={() => setIsAiDialogOpen(true)}
              sx={{ borderRadius: 2 }}
            >
              Generate AI Minutes
            </Button>
          )}

          {isOwner && (
            <DeleteMeetingButton
              meetingTitle={meeting.title}
              onDelete={handleDeleteMeeting}
            />
          )}
        </Box>
      </Box>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, mb: 3 }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1.5, mb: 1.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', sm: '1.85rem' } }}>
              {meeting.title}
            </Typography>
            <MeetingStatusBadge status={meeting.status} size="medium" />
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 2.5 }}>
            {meeting.description || 'No description provided for this session.'}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <CalendarMonthIcon fontSize="small" sx={{ color: 'primary.main' }} />
              <Typography variant="body2">{formatDateTime(meeting.date)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <AccessTimeIcon fontSize="small" sx={{ color: 'primary.main' }} />
              <Typography variant="body2">{meeting.durationMinutes} minutes</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <PeopleIcon fontSize="small" sx={{ color: 'primary.main' }} />
              <Typography variant="body2">{meeting.participants?.length || 0} attendees</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AutoAwesomeIcon sx={{ color: 'secondary.main', fontSize: 22 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                    AI Executive Summary
                  </Typography>
                </Box>
                {meeting.summary && (
                  <Tooltip title="Copy summary text">
                    <Button
                      size="small"
                      startIcon={<ContentCopyIcon fontSize="small" />}
                      onClick={handleCopySummary}
                      sx={{ textTransform: 'none' }}
                    >
                      Copy
                    </Button>
                  </Tooltip>
                )}
              </Box>

              {meeting.summary ? (
                <>
                  <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'text.secondary', mb: 2.5 }}>
                    {meeting.summary}
                  </Typography>

                  {meeting.keyDecisions && meeting.keyDecisions.length > 0 && (
                    <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                        Key Decisions Made:
                      </Typography>
                      <List disablePadding>
                        {meeting.keyDecisions.map((decision, idx) => (
                          <ListItem key={idx} disableGutters sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 28 }}>
                              <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2" color="text.secondary">
                                  {decision}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </>
              ) : (
                <EmptyState
                  icon={<AutoAwesomeIcon sx={{ fontSize: 32 }} />}
                  title="No AI Protocol Generated Yet"
                  description="Upload a recording or run AI analysis to extract summary and decisions."
                  actionLabel="Generate with AI"
                  onAction={() => setIsAiDialogOpen(true)}
                />
              )}
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                    Action Items ({doneTasks}/{totalTasks} Done)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Follow-up tasks, assignees, and target completion deadlines
                  </Typography>
                </Box>

                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setIsTaskDialogOpen(true)}
                  sx={{ borderRadius: 2 }}
                >
                  Add Task
                </Button>
              </Box>

              {totalTasks > 0 && (
                <Box sx={{ mb: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      Progress
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {progressPercent}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={progressPercent}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      '& .MuiLinearProgress-bar': {
                        transition: 'transform 0.4s ease-in-out',
                      },
                    }}
                  />
                </Box>
              )}

              {totalTasks === 0 ? (
                <EmptyState
                  title="No Action Items Assigned"
                  description="Add tasks manually or generate them automatically using the AI minutes feature."
                  actionLabel="Create Action Item"
                  onAction={() => setIsTaskDialogOpen(true)}
                  actionIcon={<AddIcon />}
                />
              ) : (
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: 'background.default' }}>
                      <TableRow>
                        <TableCell sx={{ width: 44 }}>Done</TableCell>
                        <TableCell>Task</TableCell>
                        <TableCell>Assignee</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell sx={{ width: 44 }} />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {actionItems.map((item) => (
                        <ActionItemRow
                          key={item.id}
                          item={item}
                          onStatusChange={handleActionStatusChange}
                          onDelete={handleDeleteActionItem}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, fontSize: '1rem' }}>
                Agenda Points
              </Typography>
              {meeting.agenda && meeting.agenda.length > 0 ? (
                <List disablePadding>
                  {meeting.agenda.map((point, idx) => (
                    <ListItem key={idx} disableGutters sx={{ py: 0.75 }}>
                      <ListItemIcon sx={{ minWidth: 26 }}>
                        <FormatListBulletedIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                            {point}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No agenda specified.
                </Typography>
              )}
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, fontSize: '1rem' }}>
                Attendees ({meeting.participants?.length || 0})
              </Typography>
              <List disablePadding>
                {meeting.participants?.map((participant) => (
                  <ListItem key={participant.id} disableGutters sx={{ py: 1, gap: 1.5 }}>
                    <ParticipantAvatar participant={participant} size={34} />
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {participant.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {participant.role || participant.email}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <ActionItemDialog
        open={isTaskDialogOpen}
        participants={meeting.participants || []}
        onClose={() => setIsTaskDialogOpen(false)}
        onSubmit={handleAddActionItem}
      />

      <AIProcessDialog
        open={isAiDialogOpen}
        meetingTitle={meeting.title}
        onClose={() => setIsAiDialogOpen(false)}
        onComplete={handleCompleteAIProcess}
      />

      <EditMeetingDialog
        open={isEditDialogOpen}
        meeting={meeting}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleUpdateMeeting}
      />
      </Box>
    </Fade>
  );
};
