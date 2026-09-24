export type MeetingStatus = 'SCHEDULED' | 'RECORDED' | 'PROCESSED' | 'COMPLETED';

export type ActionItemStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Participant {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface ActionItem {
  id: string;
  meetingId: string;
  title: string;
  assignee: Participant;
  dueDate: Date;
  status: ActionItemStatus;
  priority: Priority;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  date: Date;
  durationMinutes: number;
  status: MeetingStatus;
  participants: Participant[];
  agenda: string[];
  summary?: string;
  keyDecisions?: string[];
  actionItems?: ActionItem[];
  transcript?: string;
  audioFileName?: string;
}

export type CreateMeetingInput = Omit<Meeting, 'id' | 'status' | 'summary' | 'keyDecisions' | 'actionItems' | 'transcript'>;
