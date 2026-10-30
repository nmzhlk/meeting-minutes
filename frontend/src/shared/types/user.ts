export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
  isActive?: boolean;
  createdAt?: string;
}

export type Participant = User;
