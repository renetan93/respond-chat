import { IPaginationResponse } from '@/api/common';
import { createPost } from '@/api/posts';
import { makeTestQueryClient, renderHookWithProviders } from '@/test-utils';
import { Post } from '@/types/post';
import { InfiniteData, QueryClient } from '@tanstack/react-query';
import { waitFor } from '@testing-library/react-native';
import { useCreatePost } from '../useCreatePost';

jest.mock('@/api/posts');

const mockedCreatePost = jest.mocked(createPost);

type PostsCache = InfiniteData<IPaginationResponse<Post>>;

const USER_ID = 7;
const QUERY_KEY = ['posts', { userId: USER_ID }];

const post = (id: number, title: string): Post => ({
  id,
  userId: USER_ID,
  title,
  body: '',
  tags: [],
  category: 'general',
  createdAt: '2026-03-15T10:00:00.000Z',
});

const postA = post(1, 'first');
const postB = post(2, 'second');
const postC = post(3, 'on page two');

const draft = { ...post(0, 'new message') } as Omit<Post, 'id'>;

/** Two pages so we can prove only page 0 is touched. */
function seed(queryClient: QueryClient): PostsCache {
  const cache: PostsCache = {
    pageParams: [0, 20],
    pages: [
      { total: 3, limit: 20, offset: 0, results: [postA, postB] },
      { total: 3, limit: 20, offset: 20, results: [postC] },
    ],
  };
  queryClient.setQueryData(QUERY_KEY, cache);
  return cache;
}

/**
 * A promise we can hold open to observe the optimistic state, then settle so no
 * mutation is left pending when the test ends.
 */
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

async function setup() {
  const queryClient = makeTestQueryClient();
  const snapshot = structuredClone(seed(queryClient));
  const { result } = await renderHookWithProviders(
    () => useCreatePost(USER_ID),
    { queryClient },
  );
  const read = () => queryClient.getQueryData<PostsCache>(QUERY_KEY);
  return { queryClient, result, snapshot, read };
}

describe('useCreatePost', () => {
  describe('onMutate', () => {
    it('cancels in-flight page fetches before writing', async () => {
      const { queryClient, result } = await setup();
      const cancelQueries = jest.spyOn(queryClient, 'cancelQueries');

      result.current.mutate(draft);
      await waitFor(() => expect(cancelQueries).toHaveBeenCalled());

      expect(cancelQueries).toHaveBeenCalledWith({ queryKey: QUERY_KEY });
    });

    it('prepends an optimistic post to page 0 with a temp id', async () => {
      const { result, read } = await setup();
      const inFlight = deferred<Post>();
      mockedCreatePost.mockReturnValue(inFlight.promise);

      result.current.mutate(draft);

      await waitFor(() => expect(read()!.pages[0].results).toHaveLength(3));

      const optimistic = read()!.pages[0].results[0];
      expect(optimistic.tempId).toBe('test-uuid-1');
      expect(optimistic.title).toBe('new message');
      // A negative id keeps the optimistic row from colliding with server ids.
      expect(optimistic.id).toBeLessThan(0);

      inFlight.resolve(post(501, 'new message'));
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    it('leaves pages other than the first untouched', async () => {
      const { result, read, snapshot } = await setup();
      const inFlight = deferred<Post>();
      mockedCreatePost.mockReturnValue(inFlight.promise);

      result.current.mutate(draft);
      await waitFor(() => expect(read()!.pages[0].results).toHaveLength(3));

      expect(read()!.pages[1]).toEqual(snapshot.pages[1]);
      expect(read()!.pages[0].results.slice(1)).toEqual([postA, postB]);

      inFlight.resolve(post(501, 'new message'));
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    it('does not throw when the cache is empty', async () => {
      const queryClient = makeTestQueryClient();
      const { result } = await renderHookWithProviders(
        () => useCreatePost(USER_ID),
        { queryClient },
      );
      mockedCreatePost.mockResolvedValue(post(501, 'new message'));

      result.current.mutate(draft);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(queryClient.getQueryData(QUERY_KEY)).toBeUndefined();
    });
  });

  describe('onSuccess', () => {
    it('reconciles the temp post in place and clears its tempId', async () => {
      const { result, read } = await setup();
      const created = post(501, 'new message');
      mockedCreatePost.mockResolvedValue(created);

      result.current.mutate(draft);
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const results = read()!.pages[0].results;
      expect(results).toHaveLength(3);
      // Position is preserved - the server row replaces the temp row in place.
      expect(results[0].id).toBe(501);
      expect(results[0].tempId).toBeUndefined();
      expect(results.slice(1)).toEqual([postA, postB]);
    });

    it('does not disturb the other page', async () => {
      const { result, read, snapshot } = await setup();
      mockedCreatePost.mockResolvedValue(post(501, 'new message'));

      result.current.mutate(draft);
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(read()!.pages[1]).toEqual(snapshot.pages[1]);
    });
  });

  describe('onError', () => {
    it('rolls the cache back to the pre-mutation snapshot', async () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const { result, read, snapshot } = await setup();
      mockedCreatePost.mockRejectedValue(new Error('network down'));

      result.current.mutate(draft);
      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(read()).toEqual(snapshot);
      expect(consoleError).toHaveBeenCalledWith(
        'Failed to send message:',
        expect.any(Error),
      );
    });
  });
});
