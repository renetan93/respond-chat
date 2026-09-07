import axios from '@/api/axios';
import { User } from '@/types/user';
import { getConversations, getUserById } from '..';

jest.mock('@/api/axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));

const mockedAxios = jest.mocked(axios);

const user: User = {
  id: 7,
  name: 'Ada Lovelace',
  username: 'ada',
  email: 'ada@example.com',
  avatar: 'https://example.com/ada.png',
  phone: '555-0100',
  website: 'ada.example.com',
  address: { street: '1 Analytical Way', city: 'London', zipcode: 'E1' },
};

describe('getConversations', () => {
  it('forwards pagination params and maps results through toConversation', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { total: 45, limit: 20, offset: 40, results: [user] },
    });

    const page = await getConversations({ limit: 20, offset: 40 });

    expect(mockedAxios.get).toHaveBeenCalledWith('/users', {
      params: { limit: 20, offset: 40 },
    });
    expect(page.total).toBe(45);
    expect(page.limit).toBe(20);
    expect(page.offset).toBe(40);
    expect(page.results).toHaveLength(1);
    expect(page.results[0]).toMatchObject({ id: 7, name: 'Ada Lovelace' });
    // Mapped, not passed through raw.
    expect(page.results[0]).not.toHaveProperty('email');
  });

  it('passes params: undefined when called with no arguments', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { total: 0, limit: 20, offset: 0, results: [] },
    });

    await getConversations();

    expect(mockedAxios.get).toHaveBeenCalledWith('/users', {
      params: undefined,
    });
  });

  it('returns an empty result list without calling the mapper', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { total: 0, limit: 20, offset: 0, results: [] },
    });

    await expect(getConversations()).resolves.toMatchObject({ results: [] });
  });
});

describe('getUserById', () => {
  it('hits the id-scoped path and returns the body verbatim', async () => {
    mockedAxios.get.mockResolvedValue({ data: user });

    await expect(getUserById({ id: 3 })).resolves.toEqual(user);
    expect(mockedAxios.get).toHaveBeenCalledWith('/users/3');
  });
});
