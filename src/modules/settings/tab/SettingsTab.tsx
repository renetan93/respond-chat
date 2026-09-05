import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { appSliceActions } from '@/modules/app/appSlice';
import { RootState } from '@/store';
import * as Application from 'expo-application';
import { MoonIcon, SunIcon } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import SettingsListItem from './SettingsListItem';

interface ThemeToggleProps {
  icon: React.ElementType;
  selected?: boolean;
  onPress?: () => void;
}

const ThemeToggle = ({ icon, selected, onPress }: ThemeToggleProps) => {
  return (
    <Box
      className={`self-start p-2 rounded-full ${selected ? 'bg-gray-600' : ''}`}
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
    <Box>
      <SettingsListItem
        title="Theme"
        renderRight={
          <HStack className="gap-2 rounded-full bg-gray-400 p-1">
            <ThemeToggle
              icon={MoonIcon}
              selected={theme === 'dark'}
              onPress={() => handleThemeChange('dark')}
            />

            <ThemeToggle
              icon={SunIcon}
              selected={theme === 'light'}
              onPress={() => handleThemeChange('light')}
            />
          </HStack>
        }
      />

      <Text size="xs" className="text-center">
        {`Version ${Application.nativeApplicationVersion} (${Application.nativeBuildVersion})`}
      </Text>
    </Box>
  );
};

export default SettingsTab;
