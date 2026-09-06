import { RootState } from '@/store';
import { User } from '@/types/user';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import ChatHeaderTitle from '../components/ChatHeaderTitle';

export function useChatHeader(user?: User) {
  const navigation = useNavigation();
  const blockedUsers = useSelector(
    (state: RootState) => state.app.blockedUsers,
  );

  useLayoutEffect(() => {
    if (!user) return;

    navigation.setOptions({
      headerTitleAlign: 'left',
      headerTitle: () => (
        <ChatHeaderTitle user={user} isBlocked={!!blockedUsers[user.id]} />
      ),
    });
  }, [navigation, user, blockedUsers]);
}
