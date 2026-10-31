import type {
  ActionItem,
  CreateActionItemInput,
  CreateMeetingInput,
  Meeting,
  UpdateActionItemInput,
  UpdateMeetingInput,
  User,
} from '../types';

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url?: string | null;
  is_active?: boolean;
  created_at?: string;
}

export interface AgendaItemDto {
  id: string;
  item: string;
  order_index: number;
}

export interface DecisionDto {
  id: string;
  decision: string;
  order_index: number;
}

export interface ActionItemDto {
  id: string;
  meeting_id: string;
  assignee_id?: string | null;
  title: string;
  due_date?: string | null;
  status: ActionItem['status'];
  priority: ActionItem['priority'];
  created_at?: string;
  assignee?: UserDto | null;
}

export interface MeetingDto {
  id: string;
  title: string;
  description?: string | null;
  meeting_date: string;
  duration_minutes: number;
  status: Meeting['status'];
  summary?: string | null;
  transcript?: string | null;
  audio_file_name?: string | null;
  owner_id?: string | null;
  created_at?: string;
  owner?: UserDto | null;
  participants?: UserDto[];
  agenda_items?: AgendaItemDto[];
  decisions?: DecisionDto[];
  action_items?: ActionItemDto[];
}

export interface MeetingCreateDto {
  title: string;
  description?: string | null;
  meeting_date: string;
  duration_minutes: number;
  status?: Meeting['status'];
  summary?: string | null;
  transcript?: string | null;
  audio_file_name?: string | null;
  participant_ids?: string[];
  agenda?: string[];
  decisions?: string[];
}

export interface MeetingUpdateDto {
  title?: string;
  description?: string | null;
  meeting_date?: string;
  duration_minutes?: number;
  status?: Meeting['status'];
  summary?: string | null;
  transcript?: string | null;
  audio_file_name?: string | null;
  participant_ids?: string[];
  agenda?: string[];
  decisions?: string[];
}

export interface ActionItemCreateDto {
  meeting_id: string;
  assignee_id?: string | null;
  title: string;
  due_date?: string | null;
  status?: ActionItem['status'];
  priority?: ActionItem['priority'];
}

export interface ActionItemUpdateDto {
  title?: string;
  due_date?: string | null;
  status?: ActionItem['status'];
  priority?: ActionItem['priority'];
  assignee_id?: string | null;
}

export const mapUserFromDto = (dto: UserDto): User => ({
  id: dto.id,
  name: dto.name,
  email: dto.email,
  role: dto.role,
  avatarUrl: dto.avatar_url ?? null,
  isActive: dto.is_active,
  createdAt: dto.created_at,
});

export const mapActionItemFromDto = (dto: ActionItemDto): ActionItem => ({
  id: dto.id,
  meetingId: dto.meeting_id,
  title: dto.title,
  assigneeId: dto.assignee_id ?? null,
  assignee: dto.assignee ? mapUserFromDto(dto.assignee) : null,
  dueDate: dto.due_date ?? null,
  status: dto.status,
  priority: dto.priority,
  createdAt: dto.created_at,
});

export const mapMeetingFromDto = (dto: MeetingDto): Meeting => {
  const agenda = (dto.agenda_items || [])
    .slice()
    .sort((a, b) => a.order_index - b.order_index)
    .map((item) => item.item);

  const keyDecisions = (dto.decisions || [])
    .slice()
    .sort((a, b) => a.order_index - b.order_index)
    .map((d) => d.decision);

  const participants = (dto.participants || []).map(mapUserFromDto);
  const actionItems = (dto.action_items || []).map(mapActionItemFromDto);

  return {
    id: dto.id,
    title: dto.title,
    description: dto.description ?? null,
    date: dto.meeting_date,
    durationMinutes: dto.duration_minutes,
    status: dto.status,
    summary: dto.summary ?? null,
    transcript: dto.transcript ?? null,
    audioFileName: dto.audio_file_name ?? null,
    ownerId: dto.owner_id ?? null,
    createdAt: dto.created_at,
    owner: dto.owner ? mapUserFromDto(dto.owner) : null,
    participants,
    agenda,
    keyDecisions,
    actionItems,
  };
};

export const mapCreateMeetingToDto = (input: CreateMeetingInput): MeetingCreateDto => {
  const participantIds =
    input.participantIds && input.participantIds.length > 0
      ? input.participantIds
      : (input.participants || []).map((p) => p.id);

  return {
    title: input.title.trim(),
    description: input.description?.trim() || null,
    meeting_date: new Date(input.date).toISOString(),
    duration_minutes: Number(input.durationMinutes),
    participant_ids: participantIds,
    agenda: input.agenda || [],
    decisions: input.decisions || [],
  };
};

export const mapUpdateMeetingToDto = (input: UpdateMeetingInput): MeetingUpdateDto => {
  const dto: MeetingUpdateDto = {};

  if (input.title !== undefined) dto.title = input.title.trim();
  if (input.description !== undefined) dto.description = input.description ? input.description.trim() : null;
  if (input.date !== undefined) dto.meeting_date = new Date(input.date).toISOString();
  if (input.durationMinutes !== undefined) dto.duration_minutes = Number(input.durationMinutes);
  if (input.status !== undefined) dto.status = input.status;
  if (input.summary !== undefined) dto.summary = input.summary;
  if (input.transcript !== undefined) dto.transcript = input.transcript;
  if (input.audioFileName !== undefined) dto.audio_file_name = input.audioFileName;
  if (input.participantIds !== undefined) dto.participant_ids = input.participantIds;
  if (input.agenda !== undefined) dto.agenda = input.agenda;
  const decisions = input.decisions ?? input.keyDecisions;
  if (decisions !== undefined) dto.decisions = decisions;

  return dto;
};

export const mapCreateActionItemToDto = (input: CreateActionItemInput): ActionItemCreateDto => ({
  meeting_id: input.meetingId || '',
  title: input.title.trim(),
  assignee_id: input.assigneeId ?? (input.assignee?.id || null),
  due_date: input.dueDate ? new Date(input.dueDate).toISOString() : null,
  status: input.status,
  priority: input.priority,
});

export const mapUpdateActionItemToDto = (input: UpdateActionItemInput): ActionItemUpdateDto => {
  const dto: ActionItemUpdateDto = {};

  if (input.title !== undefined) dto.title = input.title.trim();
  if (input.dueDate !== undefined) {
    dto.due_date = input.dueDate ? new Date(input.dueDate).toISOString() : null;
  }
  if (input.status !== undefined) dto.status = input.status;
  if (input.priority !== undefined) dto.priority = input.priority;
  if (input.assigneeId !== undefined) dto.assignee_id = input.assigneeId;

  return dto;
};
