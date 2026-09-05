import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';

const ChatTab = () => {
  const onPress = () => {
    router.navigate({
      pathname: '/chat/conversations/[conversationId]',
      params: {
        conversationId: '1',
      },
    });
  };

  return (
    <Box>
      <Text>chat</Text>

      <Button onPress={onPress}>
        <ButtonText>to chat</ButtonText>
      </Button>
    </Box>
  );
};

export default ChatTab;
