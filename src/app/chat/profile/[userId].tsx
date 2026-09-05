import { ProfileScreen } from '@/modules/chat/profile';
import { useLocalSearchParams } from 'expo-router';

type SearchParams = {
  userId: string;
};

const ProfileRoute = () => {
  const params = useLocalSearchParams<SearchParams>();
  return <ProfileScreen userId={Number(params.userId)} />;
};

export default ProfileRoute;
