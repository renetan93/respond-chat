import { Box } from '@/components/ui/box';
import { useCallback } from 'react';
import { ListRenderItem, type ScrollViewProps, StyleSheet } from 'react-native';
import { KeyboardGestureArea } from 'react-native-keyboard-controller';
import { useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import useUser from '../hooks/useUser';
import { INPUT_HEIGHT, TEXT_INPUT_HEIGHT } from './constants';

import { FlatList } from '@/components/ui/flat-list';
import { Post } from '@/types/post';
import { BubbleMessage, ChatComposer, ChatScrollView } from './components';
import { useChatHeader } from './hooks/useChatHeader';
import { useCreatePost } from './hooks/useCreatePost';
import { usePostsByUserId } from './hooks/usePostsByUserId';

const renderItem: ListRenderItem<Post> = ({ item }) => {
  return <BubbleMessage post={item} />;
};

type ConversationDetailScreenProps = {
  userId: number;
};

const ItemSeparator = () => <Box className="h-2" />;

function ConversationDetailScreen({ userId }: ConversationDetailScreenProps) {
  const { data: user } = useUser(userId);
  useChatHeader(user);
  const { posts, loadMore: loadMorePosts } = usePostsByUserId(userId);
  const { mutate } = useCreatePost(userId);
  const extraContentPadding = useSharedValue(0);

  const renderScrollComponent = useCallback(
    (props: ScrollViewProps) => (
      <ChatScrollView {...props} extraContentPadding={extraContentPadding} />
    ),
    [extraContentPadding],
  );

  const onSend = useCallback(
    (value: string) => {
      mutate({
        createdAt: new Date().toISOString(),
        userId,
        body: value,
        title: value,
        category: 'general',
        tags: [],
      });
    },
    [mutate, userId],
  );

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <Box className="flex-1 bg-background">
        <KeyboardGestureArea
          interpolator="ios"
          offset={INPUT_HEIGHT}
          style={styles.container}
          textInputNativeID="chat-input">
          <FlatList
            inverted
            contentContainerStyle={styles.list}
            data={posts}
            keyExtractor={(item) => String(item.id)}
            renderScrollComponent={renderScrollComponent}
            ItemSeparatorComponent={ItemSeparator}
            renderItem={renderItem}
            onEndReached={loadMorePosts}
            onEndReachedThreshold={0.5}
          />

          <Box className="h-2" />

          <ChatComposer
            extraContentPadding={extraContentPadding}
            onSubmit={onSend}
          />
        </KeyboardGestureArea>
      </Box>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  list: {
    paddingTop: TEXT_INPUT_HEIGHT,
    paddingHorizontal: 12,
  },
});

export default ConversationDetailScreen;
