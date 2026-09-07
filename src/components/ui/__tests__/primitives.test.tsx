import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { render, screen } from '@testing-library/react-native';

it('renders className-bearing primitives', async () => {
  await render(
    <HStack className="p-2 gap-2">
      <Text className="text-lg">hi</Text>
    </HStack>,
  );
  expect(screen.getByText('hi')).toBeOnTheScreen();
});
