import { Post } from '@/types/post';
import axios from '../axios';
import { IPaginationParams, IPaginationResponse } from '../common';

export type GetPostByUserIdRequest = {
  userId: number;
} & IPaginationParams;
export type GetPostByUserIdResponse = IPaginationResponse<Post>;

export const getPostByUserId = async (params?: GetPostByUserIdRequest) => {
  return axios
    .get<GetPostByUserIdResponse>('/posts', {
      params: {
        userId: params?.userId,
        limit: params?.limit,
        offset: params?.offset,
      },
    })
    .then((response) => response.data);
};

type PostMessageRequest = Omit<Post, 'id'>;
type PostMessageResponse = Post;

export const createPost = async (data: PostMessageRequest) => {
  return axios
    .post<PostMessageResponse>('/posts', data)
    .then((response) => response.data);
};
