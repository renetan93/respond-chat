import { User } from '@/types/user';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import ChatHeaderTitle from '../components/ChatHeaderTitle';

export function useChatHeader(user?: User) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (!user) return;

    navigation.setOptions({
      headerTitleAlign: 'left',
      headerTitle: () => <ChatHeaderTitle user={user} />,
    });
  }, [navigation, user]);
}
