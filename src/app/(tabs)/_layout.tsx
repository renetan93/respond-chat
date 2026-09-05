import { Tabs } from 'expo-router';
import { MessageCircleMoreIcon, SettingsIcon } from 'lucide-react-native';

function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ color }) => <MessageCircleMoreIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{ tabBarIcon: ({ color }) => <SettingsIcon color={color} /> }}
      />
    </Tabs>
  );
}

export default TabLayout;
