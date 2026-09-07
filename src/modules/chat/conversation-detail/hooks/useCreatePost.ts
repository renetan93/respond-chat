import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import * as Crypto from 'expo-crypto';

import { IPaginationResponse } from '@/api/common';
import { createPost } from '@/api/posts';
import { Post } from '@/types/post';
import { generateUniqueNegativeNumber } from '@/utils';

type PostsCache = InfiniteData<IPaginationResponse<Post>>;

export const useCreatePost = (userId: number) => {
  const queryClient = useQueryClient();

  const queryKey = ['posts', { userId }];

  return useMutation({
    mutationFn: createPost,
    onMutate: async (newMessage) => {
      // Cancel in-flight page fetches first, otherwise a response that is
      // already on the wire lands after the optimistic write and drops it.
      await queryClient.cancelQueries({ queryKey });

      const previousMessages = queryClient.getQueryData<PostsCache>(queryKey);

      const tempId = Crypto.randomUUID();

      const optimisticMessage: Post = {
        tempId,
        ...newMessage,
        id: generateUniqueNegativeNumber(),
      };

      queryClient.setQueryData<PostsCache>(queryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page, index) => {
            if (index !== 0) return page;

            return {
              ...page,
              results: [optimisticMessage, ...page.results],
            };
          }),
        };
      });

      return { previousMessages, tempId };
    },
    onSuccess: (createdPost, _newMessage, { tempId }) => {
      queryClient.setQueryData<PostsCache>(queryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            results: page.results.map((post) =>
              post.tempId === tempId
                ? { ...post, ...createdPost, tempId: undefined }
                : post,
            ),
          })),
        };
      });
    },
    onError: (error, _newMessage, onMutateResult) => {
      if (onMutateResult) {
        queryClient.setQueryData(queryKey, onMutateResult.previousMessages);
      }

      console.error('Failed to send message:', error);
    },
  });
};
