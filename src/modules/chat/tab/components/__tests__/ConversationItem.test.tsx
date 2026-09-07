import { renderWithProviders } from '@/test-utils';
import { Conversation } from '@/types/conversations';
import { fireEvent, screen } from '@testing-library/react-native';
import ConversationItem from '../ConversationItem';

const conversation: Conversation = {
  id: 7,
  name: 'Ada Lovelace',
  avatar: 'https://example.com/ada.png',
  lastMessage: 'hello world',
  timestamp: '2026-03-15T08:05:00.000Z',
};

describe('ConversationItem', () => {
  beforeEach(() => {
    // formatTimestamp branches on "today", so pin the clock. TZ is UTC.
    jest.useFakeTimers().setSystemTime(new Date('2026-03-15T10:30:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows the name, last message and formatted timestamp', async () => {
    await renderWithProviders(
      <ConversationItem conversation={conversation} onPress={jest.fn()} />,
    );

    expect(screen.getByText('Ada Lovelace')).toBeOnTheScreen();
    expect(screen.getByText('hello world')).toBeOnTheScreen();
    expect(screen.getByText('08:05')).toBeOnTheScreen();
  });

  it('hides the blocked label by default', async () => {
    await renderWithProviders(
      <ConversationItem conversation={conversation} onPress={jest.fn()} />,
    );

    expect(screen.queryByText('(Blocked)')).not.toBeOnTheScreen();
  });

  it('shows the blocked label when isBlocked', async () => {
    await renderWithProviders(
      <ConversationItem
        isBlocked
        conversation={conversation}
        onPress={jest.fn()}
      />,
    );

    expect(screen.getByText('(Blocked)')).toBeOnTheScreen();
  });

  it('calls onPress once when tapped', async () => {
    const onPress = jest.fn();
    await renderWithProviders(
      <ConversationItem conversation={conversation} onPress={onPress} />,
    );

    await fireEvent.press(screen.getByText('Ada Lovelace'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders the avatar image, not initials, when there is a URI', async () => {
    await renderWithProviders(
      <ConversationItem conversation={conversation} onPress={jest.fn()} />,
    );

    expect(screen.queryByText('AL')).not.toBeOnTheScreen();
  });

  it('falls back to the name initials when there is no avatar', async () => {
    await renderWithProviders(
      <ConversationItem
        conversation={{ ...conversation, avatar: '' }}
        onPress={jest.fn()}
      />,
    );

    // AvatarFallbackText derives initials from the name - "Ada Lovelace" -> "AL".
    expect(screen.getByText('AL')).toBeOnTheScreen();
  });
});
