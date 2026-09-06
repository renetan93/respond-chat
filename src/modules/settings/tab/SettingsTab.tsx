import { ScreenContainer } from '@/components/layouts';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { appSliceActions } from '@/modules/app/appSlice';
import { RootState } from '@/store';
import * as Application from 'expo-application';
import { MoonIcon, SunIcon } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import SettingsListItem from './SettingsListItem';

interface ThemeToggleProps {
  className?: string;
  icon: React.ElementType;
  onPress?: () => void;
}

const ThemeToggle = ({ className, icon, onPress }: ThemeToggleProps) => {
  return (
    <Box
      className={`self-start p-2 rounded-full ${className ?? ''}`}
      onTouchStart={onPress}>
      <Icon as={icon} size="lg" />
    </Box>
  );
};

const SettingsTab = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.app.theme);

  const handleThemeChange = (value: 'dark' | 'light') => {
    dispatch(appSliceActions.setTheme(value));
  };

  return (
    <ScreenContainer className="bg-background">
      <Card>
        <Center>
          <Avatar className="w-40 h-40">
            <AvatarFallbackText className="text-6xl">TCC</AvatarFallbackText>
            <AvatarImage source={{ uri: 'https://example.com/avatar.png' }} />
          </Avatar>

          <Box className="h-4" />

          <Text size="2xl" className="font-bold">
            Tan Choon Chean
          </Text>
          <Text size="lg" className="text-gray-500">
            tcc@example.com
          </Text>
        </Center>
      </Card>

      <Box className="h-4" />

      <Divider />

      <Box className="h-4" />

      <VStack className="flex-1">
        <Card>
          <SettingsListItem
            title="Theme"
            renderRight={
              <HStack className="gap-2 rounded-full bg-accent p-1">
                <ThemeToggle
                  className={theme === 'dark' ? 'bg-primary-foreground' : ''}
                  icon={MoonIcon}
                  onPress={() => handleThemeChange('dark')}
                />

                <ThemeToggle
                  className={theme === 'light' ? 'bg-primary' : ''}
                  icon={SunIcon}
                  onPress={() => handleThemeChange('light')}
                />
              </HStack>
            }
          />

          {/* <Divider /> */}

          {/* <SettingsListItem
            title="Notifications"
            renderRight={<Icon as={ChevronRightIcon} />}
          />

          <Divider />

          <SettingsListItem
            title="Privacy"
            renderRight={<Icon as={ChevronRightIcon} />}
          /> */}
        </Card>
      </VStack>

      <Text size="xs" className="text-center">
        {`Version ${Application.nativeApplicationVersion} (${Application.nativeBuildVersion})`}
      </Text>
    </ScreenContainer>
  );
};

export default SettingsTab;
