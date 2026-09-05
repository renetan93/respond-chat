import { ScreenContainer } from '@/components/layouts';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';

type ConversationsScreenProps = {
  conversationId: number;
};

const ConversationsScreen = ({ conversationId }: ConversationsScreenProps) => {
  const onPress = () => {
    router.navigate({
      pathname: '/chat/profile/[userId]',
      params: {
        userId: '1',
      },
    });
  };
  return (
    <ScreenContainer>
      <Text>Conversations {conversationId}</Text>

      <Button onPress={onPress}>
        <ButtonText>to profile</ButtonText>
      </Button>
    </ScreenContainer>
  );
};

export default ConversationsScreen;
