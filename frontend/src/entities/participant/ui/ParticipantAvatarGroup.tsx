import { AvatarGroup } from '@mui/material';
import type { Participant } from '../model/types';
import { ParticipantAvatar } from './ParticipantAvatar';

interface ParticipantAvatarGroupProps {
  participants: Participant[];
  max?: number;
  size?: number;
}

export const ParticipantAvatarGroup = ({
  participants,
  max = 4,
  size = 28,
}: ParticipantAvatarGroupProps) => {
  return (
    <AvatarGroup
      max={max}
      sx={{
        '& .MuiAvatar-root': {
          width: size,
          height: size,
          fontSize: '0.75rem',
        },
      }}
    >
      {participants.map((p) => (
        <ParticipantAvatar key={p.id} participant={p} size={size} />
      ))}
    </AvatarGroup>
  );
};
