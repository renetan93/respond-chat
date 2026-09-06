import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { User } from '@/types/user';
import { router } from 'expo-router';
import { memo } from 'react';
import { TouchableOpacity } from 'react-native';

interface ChatHeaderTitleProps {
  user: User;
  isBlocked?: boolean;
}

const ChatHeaderTitle = ({ user, isBlocked }: ChatHeaderTitleProps) => {
  return (
    <TouchableOpacity
      onPress={() =>
        router.navigate({
          pathname: '/chat/profile/[userId]',
          params: {
            userId: user.id.toString(),
          },
        })
      }>
      <HStack className="gap-2 items-center">
        <Avatar className="w-10 h-10 bg-primary">
          {user.avatar ? (
            <AvatarImage
              source={{
                uri: user.avatar,
              }}
            />
          ) : (
            <AvatarFallbackText className="text-primary-foreground">
              {user.name}
            </AvatarFallbackText>
          )}
        </Avatar>
        {isBlocked && (
          <Text className="text-sm text-destructive">(Blocked)</Text>
        )}
        <Text className="text-lg font-medium">{user.name}</Text>
      </HStack>
    </TouchableOpacity>
  );
};

export default memo(ChatHeaderTitle);
