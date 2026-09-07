import { renderWithProviders } from '@/test-utils';
import { fireEvent, screen } from '@testing-library/react-native';
import type { SharedValue } from 'react-native-reanimated';
import ChatComposer from '../ChatComposer';

const sharedValue = () => ({ value: 0 }) as unknown as SharedValue<number>;

async function renderComposer(onSubmit = jest.fn()) {
  await renderWithProviders(
    <ChatComposer onSubmit={onSubmit} extraContentPadding={sharedValue()} />,
  );
  return {
    onSubmit,
    input: screen.getByPlaceholderText('Type a message...'),
    sendButton: screen.getByLabelText('Send message'),
  };
}

describe('ChatComposer', () => {
  it('renders the input and an accessible send button', async () => {
    const { input, sendButton } = await renderComposer();
    expect(input).toBeOnTheScreen();
    expect(sendButton).toBeOnTheScreen();
  });

  it('submits the trimmed text', async () => {
    const { onSubmit, input, sendButton } = await renderComposer();

    await fireEvent.changeText(input, '  hello world  ');
    await fireEvent.press(sendButton);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith('hello world');
  });

  it('ignores an empty input', async () => {
    const { onSubmit, sendButton } = await renderComposer();

    await fireEvent.press(sendButton);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('ignores a whitespace-only input', async () => {
    const { onSubmit, input, sendButton } = await renderComposer();

    await fireEvent.changeText(input, '   \n\t  ');
    await fireEvent.press(sendButton);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('clears its buffer after sending, so a second press sends nothing', async () => {
    const { onSubmit, input, sendButton } = await renderComposer();

    await fireEvent.changeText(input, 'first');
    await fireEvent.press(sendButton);
    await fireEvent.press(sendButton);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith('first');
  });

  it('sends each message separately', async () => {
    const { onSubmit, input, sendButton } = await renderComposer();

    await fireEvent.changeText(input, 'one');
    await fireEvent.press(sendButton);
    await fireEvent.changeText(input, 'two');
    await fireEvent.press(sendButton);

    expect(onSubmit).toHaveBeenNthCalledWith(1, 'one');
    expect(onSubmit).toHaveBeenNthCalledWith(2, 'two');
  });

  it('grows the animated content padding as the input gets taller', async () => {
    const extraContentPadding = sharedValue();
    const onSubmit = jest.fn();
    await renderWithProviders(
      <ChatComposer
        onSubmit={onSubmit}
        extraContentPadding={extraContentPadding}
      />,
    );

    // INPUT_HEIGHT is 42, so a 90pt-tall input means 48pt of extra padding.
    // The reanimated mock makes withTiming resolve to its target immediately.
    await fireEvent(
      screen.getByPlaceholderText('Type a message...'),
      'layout',
      { nativeEvent: { layout: { height: 90 } } },
    );

    expect(extraContentPadding.value).toBe(48);
  });
});
