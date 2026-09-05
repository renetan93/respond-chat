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

type ProfileScreenProps = {
  userId: number;
};

const ProfileScreen = ({ userId }: ProfileScreenProps) => {
  const obj = {
    id: 1,
    name: 'Alice Johnson',
    username: 'alicej',
    email: 'alice.johnson@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    phone: '+1-202-555-0101',
    website: 'https://alicejohnson.dev',
    address: {
      street: '123 Maple St',
      city: 'Springfield',
      zipcode: '62704',
    },
  };
  return (
    <ScreenContainer>
      <Center>
        <Avatar className="w-40 h-40">
          <AvatarImage
            source={{
              uri: obj.avatar,
            }}
          />

          <AvatarFallbackText>{obj.name[0]}</AvatarFallbackText>
        </Avatar>

        <Box className="h-4" />

        <Text size="3xl" className="font-bold">
          {obj.name}
        </Text>
      </Center>

      <Box className="h-4" />

      <ProfileInfoItem icon={MailIcon} title="Email">
        {obj.email}
      </ProfileInfoItem>

      <Divider />

      <ProfileInfoItem icon={PhoneIcon} title="Phone">
        {obj.phone}
      </ProfileInfoItem>

      <Divider />

      <ProfileInfoItem icon={MapPinIcon} title="Address">
        {obj.address.street}, {obj.address.city}, {obj.address.zipcode}
      </ProfileInfoItem>

      <Divider />

      <ProfileInfoItem icon={GlobeIcon} title="Website">
        {obj.website}
      </ProfileInfoItem>

      <Divider />
    </ScreenContainer>
  );
};

export default ProfileScreen;
