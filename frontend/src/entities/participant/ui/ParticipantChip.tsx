import { Chip } from '@mui/material';
import type { Participant } from '../model/types';
import { ParticipantAvatar } from './ParticipantAvatar';

interface ParticipantChipProps {
  participant: Participant;
  onDelete?: () => void;
}

export const ParticipantChip = ({ participant, onDelete }: ParticipantChipProps) => {
  return (
    <Chip
      avatar={<ParticipantAvatar participant={participant} size={24} />}
      label={`${participant.name} (${participant.role || 'Member'})`}
      variant="outlined"
      onDelete={onDelete}
      sx={{
        borderRadius: 2,
        fontWeight: 500,
        fontSize: '0.8125rem',
      }}
    />
  );
};
