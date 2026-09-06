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

export const useCreatePost = (userId: number) => {
  const queryClient = useQueryClient();

  const queryKey = ['posts', { userId }];

  return useMutation({
    mutationFn: createPost,
    onMutate: async (newMessage) => {
      const previousMessages = queryClient.getQueryData(queryKey);

      const tempId = Crypto.randomUUID();

      const optimisticMessage: Post = {
        tempId,
        ...newMessage,
        id: generateUniqueNegativeNumber(),
      };

      queryClient.setQueryData<InfiniteData<IPaginationResponse<Post>>>(
        queryKey,
        (old) => {
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
        },
      );

      return { previousMessages };
    },
    onSuccess: () => {
      console.log('Message sent successfully');
      // optimistically update the messages cache
    },
    onError: (error) => {
      console.error('Failed to send message:', error);
    },
  });
};
