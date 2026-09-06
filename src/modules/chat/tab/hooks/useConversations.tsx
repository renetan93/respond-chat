import { getConversations } from '@/api/conversations';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

const PAGE_SIZE = 20;

export function useConversations() {
  const query = useInfiniteQuery({
    queryKey: ['users', { limit: PAGE_SIZE }] as const,
    queryFn: ({ pageParam }) =>
      getConversations({ limit: PAGE_SIZE, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.limit;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = query;

  const conversations = useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data],
  );

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  return {
    ...query,
    conversations,
    loadMore,
  };
}
