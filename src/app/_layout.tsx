import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { Colors } from '@/constants/theme';
import '@/global.css';
import { RootState, store } from '@/store';
import { Provider, useSelector } from 'react-redux';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function AppLayout() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <KeyboardProvider>
          <LayoutWrapper />
        </KeyboardProvider>
      </QueryClientProvider>
    </Provider>
  );
}

function LayoutWrapper() {
  const { theme } = useSelector((state: RootState) => state.app);

  return (
    <GluestackUIProvider mode={theme}>
      <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor:
                theme === 'dark' ? Colors.dark.card : Colors.light.card,
            },
            headerBackButtonDisplayMode: 'minimal',
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          <Stack.Screen
            name="chat/conversation-detail/[userId]"
            options={{ headerTitle: '' }}
          />

          <Stack.Screen
            name="chat/profile/[userId]"
            options={{ headerTitle: 'Profile' }}
          />
        </Stack>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
