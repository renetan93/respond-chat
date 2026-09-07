import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { appReducer } from '@/modules/app/appSlice';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  render,
  renderHook,
  type RenderHookOptions,
  type RenderOptions,
} from '@testing-library/react-native';
import type { PropsWithChildren, ReactElement } from 'react';
import { SafeAreaProvider, type Metrics } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

type AppState = ReturnType<typeof appReducer>;
export type TestStore = ReturnType<typeof makeTestStore>;

/** iPhone-ish metrics so `useSafeAreaInsets()` returns something non-trivial. */
export const TEST_SAFE_AREA_METRICS: Metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const BASE_APP_STATE: AppState = appReducer(undefined, { type: '@@test/INIT' });

/** A brand-new store per call - never the module singleton in `@/store`. */
export function makeTestStore(appState?: Partial<AppState>) {
  return configureStore({
    reducer: { app: appReducer },
    preloadedState: { app: { ...BASE_APP_STATE, ...appState } },
  });
}

/**
 * A brand-new QueryClient per call. `retry: false` is the important one:
 * otherwise a rejected queryFn retries 3x with backoff and the test times out
 * instead of failing.
 */
export function makeTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnReconnect: false,
      },
      // gcTime: Infinity matters as much as retry here. React Query keeps a
      // SEPARATE 5-minute gc default for mutations, and that setTimeout is an
      // open handle that stops Jest exiting after a mutation test. Infinity
      // makes scheduleGc() skip the timer entirely.
      mutations: { retry: false, gcTime: Infinity },
    },
  });
}

export type ProviderOptions = {
  appState?: Partial<AppState>;
  store?: TestStore;
  queryClient?: QueryClient;
  safeAreaMetrics?: Metrics;
};

/**
 * Mirrors the provider stack in `src/app/_layout.tsx`, minus two:
 *
 * - `KeyboardProvider` is omitted. The shipped jest mock exports it as the
 *   *string* `"KeyboardProvider"`, and every consumer the app uses
 *   (`KeyboardStickyView`) is mocked to a plain View, so no provider is needed.
 * - expo-router's `ThemeProvider` is omitted: it only supplies react-navigation
 *   theme context to Stack headers, which nothing under test consumes.
 *
 * `SafeAreaProvider` is added even though `Stack` supplies it in the real app,
 * so `useSafeAreaInsets()` returns deterministic values.
 */
export function createTestWrapper(options: ProviderOptions = {}) {
  const store = options.store ?? makeTestStore(options.appState);
  const queryClient = options.queryClient ?? makeTestQueryClient();
  const metrics = options.safeAreaMetrics ?? TEST_SAFE_AREA_METRICS;
  const mode = store.getState().app.theme;

  function Wrapper({ children }: PropsWithChildren) {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider initialMetrics={metrics}>
            <GluestackUIProvider mode={mode}>{children}</GluestackUIProvider>
          </SafeAreaProvider>
        </QueryClientProvider>
      </Provider>
    );
  }

  return { Wrapper, store, queryClient };
}

/** Async: RNTL 14's `render` returns a Promise. Always `await` this. */
export async function renderWithProviders(
  ui: ReactElement,
  {
    appState,
    store,
    queryClient,
    safeAreaMetrics,
    ...renderOptions
  }: ProviderOptions & Omit<RenderOptions, 'wrapper'> = {},
) {
  const ctx = createTestWrapper({
    appState,
    store,
    queryClient,
    safeAreaMetrics,
  });
  const view = await render(ui, { wrapper: ctx.Wrapper, ...renderOptions });
  return { ...view, store: ctx.store, queryClient: ctx.queryClient };
}

/** Async: RNTL 14's `renderHook` returns a Promise. Always `await` this. */
export async function renderHookWithProviders<Result, Props>(
  hook: (initialProps: Props) => Result,
  {
    appState,
    store,
    queryClient,
    safeAreaMetrics,
    ...hookOptions
  }: ProviderOptions & Omit<RenderHookOptions<Props>, 'wrapper'> = {},
) {
  const ctx = createTestWrapper({
    appState,
    store,
    queryClient,
    safeAreaMetrics,
  });
  const view = await renderHook(hook, {
    wrapper: ctx.Wrapper,
    ...hookOptions,
  });
  return { ...view, store: ctx.store, queryClient: ctx.queryClient };
}
