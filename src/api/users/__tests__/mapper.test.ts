import { User } from '@/types/user';
import { toConversation } from '../mapper';

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

describe('toConversation', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-03-15T10:30:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('carries over id, name and avatar', () => {
    const conversation = toConversation(user);
    expect(conversation.id).toBe(7);
    expect(conversation.name).toBe('Ada Lovelace');
    expect(conversation.avatar).toBe('https://example.com/ada.png');
  });

  it('stamps the current time as the timestamp', () => {
    expect(toConversation(user).timestamp).toBe('2026-03-15T10:30:00.000Z');
  });

  it('hardcodes lastMessage - there is no message source yet', () => {
    expect(toConversation(user).lastMessage).toBe('hello world');
  });

  it('does not leak fields outside the Conversation shape', () => {
    expect(Object.keys(toConversation(user)).sort()).toEqual([
      'avatar',
      'id',
      'lastMessage',
      'name',
      'timestamp',
    ]);
  });
});
