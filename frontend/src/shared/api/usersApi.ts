import { httpClient } from './httpClient';
import { mapUserFromDto, type UserDto } from './mappers';
import type { User } from '../types';

export interface GetUsersParams {
  skip?: number;
  limit?: number;
}

export const usersApi = {
  async getUsers(params?: GetUsersParams): Promise<User[]> {
    const searchParams = new URLSearchParams();

    if (params?.skip !== undefined) {
      searchParams.set('skip', params.skip.toString());
    }
    if (params?.limit !== undefined) {
      searchParams.set('limit', params.limit.toString());
    }

    const query = searchParams.toString();
    const endpoint = query ? `/users?${query}` : '/users';
    const data = await httpClient.get<UserDto[]>(endpoint);
    return data.map(mapUserFromDto);
  },

  async getUserById(id: string): Promise<User> {
    const data = await httpClient.get<UserDto>(`/users/${id}`);
    return mapUserFromDto(data);
  },
};
