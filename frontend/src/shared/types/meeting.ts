import type { Participant, User } from './user';

export type MeetingStatus = 'SCHEDULED' | 'RECORDED' | 'PROCESSED' | 'COMPLETED';

export type ActionItemStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export type { Participant };

export interface ActionItem {
  id: string;
  meetingId: string;
  title: string;
  assigneeId?: string | null;
  assignee?: Participant | null;
  dueDate?: string | null;
  status: ActionItemStatus;
  priority: Priority;
  createdAt?: string;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string | null;
  date: string;
  durationMinutes: number;
  status: MeetingStatus;
  ownerId?: string | null;
  owner?: User | null;
  participants: Participant[];
  agenda: string[];
  summary?: string | null;
  keyDecisions?: string[];
  actionItems?: ActionItem[];
  transcript?: string | null;
  audioFileName?: string | null;
  createdAt?: string;
}

export type CreateMeetingInput = {
  title: string;
  description?: string | null;
  date: string;
  durationMinutes: number;
  participants: Participant[];
  agenda: string[];
  decisions?: string[];
  participantIds?: string[];
};

export type UpdateMeetingInput = {
  title?: string;
  description?: string | null;
  date?: string;
  durationMinutes?: number;
  status?: MeetingStatus;
  summary?: string | null;
  transcript?: string | null;
  audioFileName?: string | null;
  participantIds?: string[];
  agenda?: string[];
  decisions?: string[];
  keyDecisions?: string[];
};

export type CreateActionItemInput = {
  title: string;
  meetingId?: string;
  assigneeId?: string | null;
  assignee?: Participant | null;
  dueDate?: string | null;
  status?: ActionItemStatus;
  priority?: Priority;
};

export type UpdateActionItemInput = {
  title?: string;
  dueDate?: string | null;
  status?: ActionItemStatus;
  priority?: Priority;
  assigneeId?: string | null;
};
