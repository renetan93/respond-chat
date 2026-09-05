import { ConversationsScreen } from '@/modules/chat/conversations';
import { useLocalSearchParams } from 'expo-router';

const ConversationsRoute = () => {
  const params = useLocalSearchParams<{ conversationId: string }>();
  return <ConversationsScreen conversationId={Number(params.conversationId)} />;
};

export default ConversationsRoute;
