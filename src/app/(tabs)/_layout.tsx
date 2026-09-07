import { Colors } from '@/constants/theme';
import { RootState } from '@/store';
import { Tabs } from 'expo-router';
import { MessageCircleMoreIcon, SettingsIcon } from 'lucide-react-native';
import { useSelector } from 'react-redux';

function TabLayout() {
  const { theme } = useSelector((state: RootState) => state.app);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor:
          theme === 'dark' ? Colors.dark.primary : Colors.light.primary,
        tabBarInactiveTintColor:
          theme === 'dark'
            ? Colors.dark.mutedForeground
            : Colors.light.mutedForeground,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'chats',
          tabBarIcon: ({ color }) => <MessageCircleMoreIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'settings',
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
        }}
      />
    </Tabs>
  );
}

export default TabLayout;
