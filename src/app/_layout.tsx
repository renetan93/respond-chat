import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { RootState, store } from '@/store';
import { Provider, useSelector } from 'react-redux';

SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  return (
    <Provider store={store}>
      <LayoutWrapper />
    </Provider>
  );
}

function LayoutWrapper() {
  const { theme } = useSelector((state: RootState) => state.app);

  return (
    <GluestackUIProvider mode={theme}>
      <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
