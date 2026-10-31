import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Stack,
  Alert,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface AIProcessDialogProps {
  open: boolean;
  meetingTitle: string;
  onClose: () => void;
  onComplete: () => Promise<void> | void;
}

const STEPS = [
  { label: 'Audio Ingestion & Quality Analysis', description: 'Normalizing audio sample and checking signal clarity...' },
  { label: 'Speech-to-Text Transcription', description: 'Transcribing speech and assigning speaker diarization...' },
  { label: 'Protocol & Decision Extraction', description: 'Summarizing key topics, decisions, and generating action items...' },
];

export const AIProcessDialog = ({
  open,
  meetingTitle,
  onClose,
  onComplete,
}: AIProcessDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const handleClose = () => {
    if (isProcessing) return;
    setIsProcessing(false);
    setCurrentStepIndex(0);
    setProgress(0);
    onClose();
  };

  const handleStartProcessing = () => {
    setIsProcessing(true);
    setProgress(15);
    setCurrentStepIndex(0);

    setTimeout(() => {
      setProgress(50);
      setCurrentStepIndex(1);
    }, 700);

    setTimeout(() => {
      setProgress(85);
      setCurrentStepIndex(2);
    }, 1400);

    setTimeout(async () => {
      setProgress(100);
      try {
        await onComplete();
        setIsProcessing(false);
        setCurrentStepIndex(0);
        setProgress(0);
        onClose();
      } catch {
        setIsProcessing(false);
      }
    }, 2100);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3, p: 1 },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 700 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: 'rgba(13, 148, 136, 0.1)',
            color: 'secondary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AutoAwesomeIcon fontSize="small" />
        </Box>
        AI Protocol Generation
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Run AI transcription and summarization for <strong>"{meetingTitle}"</strong>
        </Typography>

        {!isProcessing ? (
          <Box>
            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2.5,
                p: 3,
                textAlign: 'center',
                bgcolor: 'background.default',
                mb: 2.5,
              }}
            >
              <GraphicEqIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Demo Audio Source Ready
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                meeting_recording_session.wav (18.4 MB • 45 min)
              </Typography>
            </Box>

            <Alert severity="info" sx={{ borderRadius: 2 }}>
              The AI model will extract an executive summary, catalog agreed key decisions, and populate
              the action items list with owners and deadlines
            </Alert>
          </Box>
        ) : (
          <Stack spacing={2.5} sx={{ py: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {STEPS[currentStepIndex].label}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {progress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                color="secondary"
                sx={{
                  height: 8,
                  borderRadius: 4,
                  '& .MuiLinearProgress-bar': {
                    transition: 'transform 0.4s ease-out',
                  },
                }}
              />
            </Box>

            <Typography variant="body2" color="text.secondary">
              {STEPS[currentStepIndex].description}
            </Typography>

            <Stack spacing={1.5} sx={{ pt: 1 }}>
              {STEPS.map((step, idx) => {
                const isDone = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <Box
                    key={step.label}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.25,
                      borderRadius: 1.5,
                      bgcolor: isCurrent ? 'rgba(13, 148, 136, 0.06)' : 'transparent',
                      transition: 'background-color 0.3s ease',
                    }}
                  >
                    {isDone ? (
                      <CheckCircleIcon sx={{ fontSize: 20, color: 'success.main' }} />
                    ) : (
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          border: '2px solid',
                          borderColor: isCurrent ? 'secondary.main' : 'divider',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: isCurrent ? 'secondary.main' : 'text.disabled',
                          bgcolor: isCurrent ? 'rgba(13, 148, 136, 0.1)' : 'transparent',
                          animation: isCurrent ? 'pulse-step 1.5s infinite' : 'none',
                          '@keyframes pulse-step': {
                            '0%': { boxShadow: '0 0 0 0 rgba(13, 148, 136, 0.5)' },
                            '70%': { boxShadow: '0 0 0 6px rgba(13, 148, 136, 0)' },
                            '100%': { boxShadow: '0 0 0 0 rgba(13, 148, 136, 0)' },
                          },
                        }}
                      >
                        {idx + 1}
                      </Box>
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isCurrent ? 600 : 400,
                        color: isCurrent ? 'text.primary' : 'text.secondary',
                      }}
                    >
                      {step.label}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button onClick={handleClose} color="inherit" disabled={isProcessing}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<CloudUploadIcon />}
          onClick={handleStartProcessing}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing AI...' : 'Start AI Generation'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
