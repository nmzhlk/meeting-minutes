import { useState } from 'react';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ConfirmDialog } from '../../../shared/ui';

interface DeleteMeetingButtonProps {
  meetingTitle: string;
  onDelete: () => Promise<void> | void;
  isDeleting?: boolean;
}

export const DeleteMeetingButton = ({
  meetingTitle,
  onDelete,
  isDeleting = false,
}: DeleteMeetingButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    setOpen(false);
    await onDelete();
  };

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        size="small"
        startIcon={<DeleteIcon />}
        onClick={() => setOpen(true)}
        disabled={isDeleting}
        sx={{ borderRadius: 2 }}
      >
        {isDeleting ? 'Deleting...' : 'Delete Meeting'}
      </Button>

      <ConfirmDialog
        open={open}
        title="Delete Meeting Protocol?"
        description={`Are you sure you want to permanently delete "${meetingTitle}" and all its assigned action items? This action cannot be undone`}
        confirmLabel="Delete Meeting"
        cancelLabel="Keep Meeting"
        isDestructive={true}
        loading={isDeleting}
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  );
};
