import { getPostByUserId } from '@/api/posts';
import { makeTestQueryClient, renderHookWithProviders } from '@/test-utils';
import { Post } from '@/types/post';
import { waitFor } from '@testing-library/react-native';
import { usePostsByUserId } from '../usePostsByUserId';

jest.mock('@/api/posts');

const mockedGetPostByUserId = jest.mocked(getPostByUserId);

const post = (id: number, createdAt: string): Post => ({
  id,
  userId: 7,
  title: `post ${id}`,
  body: '',
  tags: [],
  category: 'general',
  createdAt,
});

describe('usePostsByUserId', () => {
  it('requests the user-scoped first page', async () => {
    mockedGetPostByUserId.mockResolvedValue({
      total: 1,
      limit: 20,
      offset: 0,
      results: [post(1, '2026-03-15T10:00:00.000Z')],
    });

    const { result } = await renderHookWithProviders(() => usePostsByUserId(7));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedGetPostByUserId).toHaveBeenCalledWith({
      userId: 7,
      limit: 20,
      offset: 0,
    });
  });

  it('sorts newest-first within a page', async () => {
    mockedGetPostByUserId.mockResolvedValue({
      total: 3,
      limit: 20,
      offset: 0,
      results: [
        post(1, '2026-03-15T09:00:00.000Z'),
        post(2, '2026-03-15T11:00:00.000Z'),
        post(3, '2026-03-15T10:00:00.000Z'),
      ],
    });

    const { result } = await renderHookWithProviders(() => usePostsByUserId(7));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.posts.map((p) => p.id)).toEqual([2, 3, 1]);
  });

  it('sorts across page boundaries, not just within a page', async () => {
    mockedGetPostByUserId.mockResolvedValueOnce({
      total: 45,
      limit: 20,
      offset: 0,
      results: [
        post(1, '2026-03-15T09:00:00.000Z'),
        post(2, '2026-03-15T08:00:00.000Z'),
      ],
    });
    // Page 2 contains a post newer than everything in page 1.
    mockedGetPostByUserId.mockResolvedValueOnce({
      total: 45,
      limit: 20,
      offset: 20,
      results: [post(3, '2026-03-15T23:00:00.000Z')],
    });

    const { result } = await renderHookWithProviders(() => usePostsByUserId(7));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    result.current.loadMore();
    await waitFor(() => expect(result.current.posts).toHaveLength(3));

    expect(result.current.posts.map((p) => p.id)).toEqual([3, 1, 2]);
  });

  it('stops paginating once offset + limit reaches total', async () => {
    mockedGetPostByUserId.mockResolvedValue({
      total: 40,
      limit: 20,
      offset: 20,
      results: [],
    });

    const { result } = await renderHookWithProviders(() => usePostsByUserId(7));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.hasNextPage).toBe(false);
  });

  it('writes to the ["posts", { userId }] cache key that useCreatePost reads', async () => {
    // If these two keys ever diverge, useCreatePost's optimistic update lands in
    // a different cache entry and silently does nothing.
    mockedGetPostByUserId.mockResolvedValue({
      total: 1,
      limit: 20,
      offset: 0,
      results: [post(1, '2026-03-15T10:00:00.000Z')],
    });

    const queryClient = makeTestQueryClient();
    const { result } = await renderHookWithProviders(
      () => usePostsByUserId(7),
      { queryClient },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(queryClient.getQueryData(['posts', { userId: 7 }])).toBeDefined();
  });
});
