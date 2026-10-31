import { Avatar, Tooltip } from '@mui/material';
import type { Participant } from '../model/types';

interface ParticipantAvatarProps {
  participant: Participant;
  size?: number;
}

export const ParticipantAvatar = ({ participant, size = 32 }: ParticipantAvatarProps) => {
  const name = participant?.name || 'User';
  const initials = name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  return (
    <Tooltip title={`${name} (${participant?.role || 'Participant'})`}>
      <Avatar
        src={participant?.avatarUrl || undefined}
        sx={{
          width: size,
          height: size,
          fontSize: size * 0.4,
          fontWeight: 600,
          bgcolor: 'secondary.main',
          color: 'secondary.contrastText',
          cursor: 'pointer',
          border: '2px solid #fff',
        }}
      >
        {initials}
      </Avatar>
    </Tooltip>
  );
};
