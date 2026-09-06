import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Conversation } from '@/types/conversations';
import { formatTimestamp } from '@/utils';
import { TouchableOpacity } from 'react-native';

interface ConversationItemProps {
  conversation: Conversation;
  onPress: () => void;
}

const ConversationItem = ({ conversation, onPress }: ConversationItemProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <HStack className="p-2 gap-2 items-center">
        <Avatar className="h-16 w-16">
          {conversation.avatar ? (
            <AvatarImage
              source={{
                uri: conversation.avatar,
              }}
            />
          ) : (
            <AvatarFallbackText className="text-primary-foreground">
              {conversation.name}
            </AvatarFallbackText>
          )}
        </Avatar>

        <VStack className="flex-1 gap-1">
          <HStack className="items-center">
            <Text className="flex-1 text-lg font-medium">
              {conversation.name}
            </Text>
            <Text size="xs">{formatTimestamp(conversation.timestamp)}</Text>
          </HStack>
          <Text className="text-sm text-gray-500">
            {conversation.lastMessage}
          </Text>
        </VStack>
      </HStack>
    </TouchableOpacity>
  );
};

export default ConversationItem;
