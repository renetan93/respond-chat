import { ScreenContainer } from '@/components/layouts';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { appSliceActions } from '@/modules/app/appSlice';
import ProfileInfoItem from '@/modules/chat/profile/components/ProfileInfoItem';
import { RootState } from '@/store';
import { useNavigation } from 'expo-router';
import {
  GlobeIcon,
  InfoIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from 'lucide-react-native';
import { useCallback, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useUser from '../hooks/useUser';
import ProfileSkeleton from './components/ProfileSkeleton';

type ProfileScreenProps = {
  userId: number;
};

const ProfileScreen = ({ userId }: ProfileScreenProps) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const blockedUsers = useSelector(
    (state: RootState) => state.app.blockedUsers,
  );
  const isBlocked = !!blockedUsers[userId];

  const { data: user, isLoading } = useUser(userId);

  const blockUser = useCallback(() => {
    dispatch(appSliceActions.blockUser(userId));
  }, [dispatch, userId]);

  const unblockUser = useCallback(() => {
    dispatch(appSliceActions.unblockUser(userId));
  }, [dispatch, userId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        isBlocked ? (
          <Button variant="secondary" onPress={unblockUser}>
            <ButtonText>Unblock</ButtonText>
          </Button>
        ) : (
          <Button variant="destructive" onPress={blockUser}>
            <ButtonText>Block</ButtonText>
          </Button>
        ),
    });
  }, [blockUser, unblockUser, isBlocked, navigation]);

  if (isLoading)
    return (
      <ScreenContainer className="bg-background">
        <ProfileSkeleton />
      </ScreenContainer>
    );

  if (!user)
    return (
      <ScreenContainer className="bg-background justify-center items-center">
        <Card>
          <Center>
            <Icon as={InfoIcon} className="stroke-muted-foreground h-16 w-16" />

            <Box className="h-4" />

            <Text className="text-lg font-bold">User not found</Text>

            <Text className="text-muted-foreground">
              The user you are looking for does not exist.
            </Text>
          </Center>
        </Card>
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
            <AvatarFallbackText>{user.name}</AvatarFallbackText>
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
