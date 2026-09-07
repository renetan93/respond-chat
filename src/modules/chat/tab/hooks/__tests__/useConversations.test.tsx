import { getConversations } from '@/api/users';
import { renderHookWithProviders } from '@/test-utils';
import { Conversation } from '@/types/conversations';
import { waitFor } from '@testing-library/react-native';
import { useConversations } from '../useConversations';

jest.mock('@/api/users');

const mockedGetConversations = jest.mocked(getConversations);

const conversation = (id: number): Conversation => ({
  id,
  name: `User ${id}`,
  avatar: '',
  lastMessage: 'hello world',
  timestamp: '2026-03-15T10:30:00.000Z',
});

const page = (offset: number, total = 45) => ({
  total,
  limit: 20,
  offset,
  results: Array.from({ length: 20 }, (_, i) => conversation(offset + i)),
});

describe('useConversations', () => {
  it('requests the first page with offset 0 and flattens results', async () => {
    mockedGetConversations.mockResolvedValue(page(0));

    const { result } = await renderHookWithProviders(() => useConversations());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedGetConversations).toHaveBeenCalledWith({
      limit: 20,
      offset: 0,
    });
    expect(result.current.conversations).toHaveLength(20);
    expect(result.current.hasNextPage).toBe(true);
  });

  it('advances the offset by the page size on loadMore', async () => {
    mockedGetConversations.mockResolvedValueOnce(page(0));
    mockedGetConversations.mockResolvedValueOnce(page(20));

    const { result } = await renderHookWithProviders(() => useConversations());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    result.current.loadMore();

    await waitFor(() => expect(result.current.conversations).toHaveLength(40));
    expect(mockedGetConversations).toHaveBeenLastCalledWith({
      limit: 20,
      offset: 20,
    });
  });

  it('stops paginating once offset + limit reaches total', async () => {
    // total 45: offsets 0 and 20 have a next page, offset 40 does not
    // because 40 + 20 = 60, which is not < 45.
    mockedGetConversations.mockResolvedValueOnce(page(0));
    mockedGetConversations.mockResolvedValueOnce(page(20));
    mockedGetConversations.mockResolvedValueOnce({ ...page(40), results: [] });

    const { result } = await renderHookWithProviders(() => useConversations());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    result.current.loadMore();
    await waitFor(() => expect(result.current.conversations).toHaveLength(40));

    result.current.loadMore();
    await waitFor(() => expect(result.current.hasNextPage).toBe(false));

    expect(mockedGetConversations).toHaveBeenCalledTimes(3);

    // A further loadMore must not issue a request.
    result.current.loadMore();
    expect(mockedGetConversations).toHaveBeenCalledTimes(3);
  });

  it('treats an exactly-full final page as the end', async () => {
    // total 40, offset 20: 20 + 20 = 40, not < 40, so there is no next page.
    mockedGetConversations.mockResolvedValueOnce(page(20, 40));

    const { result } = await renderHookWithProviders(() => useConversations());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.hasNextPage).toBe(false);
  });
});
