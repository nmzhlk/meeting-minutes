import { httpClient } from './httpClient';
import {
  mapActionItemFromDto,
  mapCreateActionItemToDto,
  mapUpdateActionItemToDto,
  type ActionItemDto,
} from './mappers';
import type {
  ActionItem,
  ActionItemStatus,
  CreateActionItemInput,
  UpdateActionItemInput,
} from '../types';

export interface GetActionItemsParams {
  meetingId?: string;
  assigneeId?: string;
  status?: ActionItemStatus;
  skip?: number;
  limit?: number;
}

export const actionItemsApi = {
  async getActionItems(params?: GetActionItemsParams): Promise<ActionItem[]> {
    const searchParams = new URLSearchParams();

    if (params?.meetingId) {
      searchParams.set('meeting_id', params.meetingId);
    }
    if (params?.assigneeId) {
      searchParams.set('assignee_id', params.assigneeId);
    }
    if (params?.status) {
      searchParams.set('status', params.status);
    }
    if (params?.skip !== undefined) {
      searchParams.set('skip', params.skip.toString());
    }
    if (params?.limit !== undefined) {
      searchParams.set('limit', params.limit.toString());
    }

    const query = searchParams.toString();
    const endpoint = query ? `/action-items?${query}` : '/action-items';
    const data = await httpClient.get<ActionItemDto[]>(endpoint);
    return data.map(mapActionItemFromDto);
  },

  async getActionItemById(id: string): Promise<ActionItem> {
    const data = await httpClient.get<ActionItemDto>(`/action-items/${id}`);
    return mapActionItemFromDto(data);
  },

  async createActionItem(input: CreateActionItemInput): Promise<ActionItem> {
    const payload = mapCreateActionItemToDto(input);
    const data = await httpClient.post<ActionItemDto>('/action-items', payload);
    return mapActionItemFromDto(data);
  },

  async updateActionItemStatus(
    id: string,
    status: ActionItemStatus
  ): Promise<ActionItem> {
    const data = await httpClient.patch<ActionItemDto>(
      `/action-items/${id}/status`,
      { status }
    );
    return mapActionItemFromDto(data);
  },

  async updateActionItem(
    id: string,
    input: UpdateActionItemInput
  ): Promise<ActionItem> {
    const payload = mapUpdateActionItemToDto(input);
    const data = await httpClient.put<ActionItemDto>(
      `/action-items/${id}`,
      payload
    );
    return mapActionItemFromDto(data);
  },

  async deleteActionItem(id: string): Promise<void> {
    await httpClient.delete<void>(`/action-items/${id}`);
  },
};
