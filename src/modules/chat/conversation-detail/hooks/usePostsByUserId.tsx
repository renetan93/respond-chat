import { getPostByUserId } from '@/api/posts';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

const PAGE_SIZE = 20;

export function usePostsByUserId(userId: number) {
  const query = useInfiniteQuery({
    queryKey: ['posts', { userId }] as const,
    queryFn: ({ pageParam }) =>
      getPostByUserId({
        userId,
        limit: PAGE_SIZE,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.limit;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
  });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = query;

  const posts = useMemo(
    () =>
      data?.pages
        .flatMap((page) => page.results)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ) ?? [],
    [data],
  );

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    ...query,
    posts,
    loadMore,
  };
}
