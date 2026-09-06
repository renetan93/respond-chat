import { User } from '@/types/user';
import axios from '../axios';

export type GetUserByIdRequest = {
  id: number;
};
export type GetUserByIdResponse = User;

export const getUserById = async (params?: GetUserByIdRequest) => {
  return axios
    .get<GetUserByIdResponse>('/users', { params })
    .then((response) => response.data);
};
