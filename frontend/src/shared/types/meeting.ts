import type { Participant, User } from './user';

export type MeetingStatus = 'SCHEDULED' | 'RECORDED' | 'PROCESSED' | 'COMPLETED';

export type ActionItemStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export type { Participant };

export interface ActionItem {
  id: string;
  meetingId: string;
  title: string;
  assignee: Participant;
  dueDate: string;
  status: ActionItemStatus;
  priority: Priority;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  durationMinutes: number;
  status: MeetingStatus;
  ownerId?: string;
  owner?: User;
  participants: Participant[];
  agenda: string[];
  summary?: string;
  keyDecisions?: string[];
  actionItems?: ActionItem[];
  transcript?: string;
  audioFileName?: string;
}

export type CreateMeetingInput = {
  title: string;
  description: string;
  date: string;
  durationMinutes: number;
  participants: Participant[];
  agenda: string[];
};

export type CreateActionItemInput = {
  title: string;
  assignee: Participant;
  dueDate: string;
  priority: Priority;
};
