import { ConversationDetailScreen } from '@/modules/chat/conversation-detail';
import { useLocalSearchParams } from 'expo-router';

const ConversationDetailRoute = () => {
  const params = useLocalSearchParams<{ userId: string }>();
  return <ConversationDetailScreen userId={Number(params.userId)} />;
};

export default ConversationDetailRoute;
