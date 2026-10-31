import { httpClient } from './httpClient';
import {
  mapCreateMeetingToDto,
  mapMeetingFromDto,
  mapUpdateMeetingToDto,
  type MeetingDto,
} from './mappers';
import type {
  CreateMeetingInput,
  Meeting,
  MeetingStatus,
  UpdateMeetingInput,
} from '../types';

export interface GetMeetingsParams {
  status?: MeetingStatus | 'ALL';
  search?: string;
  skip?: number;
  limit?: number;
}

export const meetingsApi = {
  async getMeetings(params?: GetMeetingsParams): Promise<Meeting[]> {
    const searchParams = new URLSearchParams();

    if (params?.status && params.status !== 'ALL') {
      searchParams.set('status', params.status);
    }
    if (params?.search && params.search.trim()) {
      searchParams.set('search', params.search.trim());
    }
    if (params?.skip !== undefined) {
      searchParams.set('skip', params.skip.toString());
    }
    if (params?.limit !== undefined) {
      searchParams.set('limit', params.limit.toString());
    }

    const query = searchParams.toString();
    const endpoint = query ? `/meetings?${query}` : '/meetings';
    const data = await httpClient.get<MeetingDto[]>(endpoint);
    return data.map(mapMeetingFromDto);
  },

  async getMeetingById(id: string): Promise<Meeting> {
    const data = await httpClient.get<MeetingDto>(`/meetings/${id}`);
    return mapMeetingFromDto(data);
  },

  async createMeeting(input: CreateMeetingInput): Promise<Meeting> {
    const payload = mapCreateMeetingToDto(input);
    const data = await httpClient.post<MeetingDto>('/meetings', payload);
    return mapMeetingFromDto(data);
  },

  async updateMeeting(id: string, input: UpdateMeetingInput): Promise<Meeting> {
    const payload = mapUpdateMeetingToDto(input);
    const data = await httpClient.put<MeetingDto>(`/meetings/${id}`, payload);
    return mapMeetingFromDto(data);
  },

  async deleteMeeting(id: string): Promise<void> {
    await httpClient.delete<void>(`/meetings/${id}`);
  },

  async processMeetingAI(id: string): Promise<Meeting> {
    const data = await httpClient.post<MeetingDto>(`/meetings/${id}/process-ai`);
    return mapMeetingFromDto(data);
  },
};
