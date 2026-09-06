import { VStack } from '@/components/ui/vstack';
import { RootState } from '@/store';
import { Conversation } from '@/types/conversations';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useSelector } from 'react-redux';
import ConversationItem from './components/ConversationItem';
import ConversationSkeleton from './components/ConversationSkeleton';
import { useConversations } from './hooks/useConversations';

const ChatTab = () => {
  const { conversations, loadMore, refetch, isRefetching, isLoading } =
    useConversations();

  const blockedUsers = useSelector(
    (state: RootState) => state.app.blockedUsers,
  );

  const renderItem: ListRenderItem<Conversation> = useCallback(
    ({ item }) => {
      const onPress = () => {
        router.navigate({
          pathname: '/chat/conversation-detail/[userId]',
          params: {
            userId: item.id.toString(),
          },
        });
      };

      return (
        <ConversationItem
          conversation={item}
          onPress={onPress}
          isBlocked={!!blockedUsers[item.id]}
        />
      );
    },
    [blockedUsers],
  );

  if (isLoading) {
    return (
      <VStack className="flex-1 bg-background gap-2 p-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <ConversationSkeleton key={index} />
        ))}
      </VStack>
    );
  }

  return (
    <VStack className="flex-1 bg-background">
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshing={isRefetching}
        onRefresh={refetch}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
    </VStack>
  );
};

export default ChatTab;
