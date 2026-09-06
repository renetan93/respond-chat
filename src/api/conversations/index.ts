import { User } from '@/types/user';
import axios from '../axios';
import { IPaginationParams, IPaginationResponse } from '../common';
import { toConversation } from './mapper';

export type GetUsersRequest = IPaginationParams;
export type GetUsersResponse = IPaginationResponse<User>;

export type GetUserByIdRequest = {
  id: number;
};
export type GetUserByIdResponse = User;

export const getConversations = async (params?: GetUsersRequest) => {
  return axios.get<GetUsersResponse>('/users', { params }).then((response) => {
    const data = response.data;
    return {
      ...data,
      results: data.results.map((user) => toConversation(user)),
    };
  });
};

export const getUserById = async (params: GetUserByIdRequest) => {
  return axios
    .get<GetUserByIdResponse>(`/users/${params.id}`)
    .then((response) => response.data);
};
