import type { ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string | ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            p: 1,
            maxWidth: 440,
            width: '100%',
          },
        },
      }}
    >
      <DialogTitle id="confirm-dialog-title" sx={{ fontWeight: 700, pb: 1 }}>
        {title}
      </DialogTitle>
      <DialogContent>
        {typeof description === 'string' ? (
          <DialogContentText id="confirm-dialog-description" color="text.secondary">
            {description}
          </DialogContentText>
        ) : (
          description
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 1, gap: 1 }}>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          color={isDestructive ? 'error' : 'primary'}
          variant="contained"
          disabled={loading}
          autoFocus
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
