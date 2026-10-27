export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  isActive?: boolean;
  createdAt?: string;
}

export type Participant = User;
