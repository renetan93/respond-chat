import { screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { renderWithProviders } from '..';

it('mounts the provider stack', async () => {
  const { store, queryClient } = await renderWithProviders(<Text>ok</Text>);

  expect(screen.getByText('ok')).toBeOnTheScreen();
  expect(store.getState().app.theme).toBe('light');
  expect(queryClient).toBeDefined();
});

it('seeds redux state', async () => {
  const { store } = await renderWithProviders(<Text>ok</Text>, {
    appState: { theme: 'dark', blockedUsers: { 7: true } },
  });

  expect(store.getState().app.theme).toBe('dark');
  expect(store.getState().app.blockedUsers).toEqual({ 7: true });
});

it('gives each render a fresh store', async () => {
  const { store: first } = await renderWithProviders(<Text>ok</Text>);
  const { store: second } = await renderWithProviders(<Text>ok</Text>);
  expect(first).not.toBe(second);
});
