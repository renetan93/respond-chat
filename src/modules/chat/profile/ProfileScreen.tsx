import { ScreenContainer } from '@/components/layouts';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Text } from '@/components/ui/text';
import ProfileInfoItem from '@/modules/chat/profile/components/ProfileInfoItem';
import {
  GlobeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from 'lucide-react-native';
import useUser from '../hooks/useUser';
import ProfileSkeleton from './components/ProfileSkeleton';

type ProfileScreenProps = {
  userId: number;
};

const ProfileScreen = ({ userId }: ProfileScreenProps) => {
  const { data: user, isLoading } = useUser(userId);

  if (isLoading || !user)
    return (
      <ScreenContainer className="bg-background">
        <ProfileSkeleton />
      </ScreenContainer>
    );

  return (
    <ScreenContainer className="bg-background">
      <Center>
        <Avatar className="w-40 h-40">
          {user.avatar ? (
            <AvatarImage
              source={{
                uri: user.avatar,
              }}
            />
          ) : (
            <AvatarFallbackText>{user.name[0]}</AvatarFallbackText>
          )}
        </Avatar>

        <Box className="h-4" />

        <Text size="3xl" className="font-bold">
          {user.name}
        </Text>
      </Center>

      <Box className="h-4" />

      <ProfileInfoItem icon={MailIcon} title="Email">
        {user.email}
      </ProfileInfoItem>

      <Divider />

      <ProfileInfoItem icon={PhoneIcon} title="Phone">
        {user.phone}
      </ProfileInfoItem>

      <Divider />

      <ProfileInfoItem icon={MapPinIcon} title="Address">
        {user.address.street}, {user.address.city}, {user.address.zipcode}
      </ProfileInfoItem>

      <Divider />

      <ProfileInfoItem icon={GlobeIcon} title="Website">
        {user.website}
      </ProfileInfoItem>

      <Divider />
    </ScreenContainer>
  );
};

export default ProfileScreen;
