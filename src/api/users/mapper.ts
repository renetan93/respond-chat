import { Conversation } from '@/types/conversations';
import { User } from '@/types/user';

export function toConversation(user: User): Conversation {
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    lastMessage: 'hello world',
    timestamp: new Date().toISOString(),
  };
}
