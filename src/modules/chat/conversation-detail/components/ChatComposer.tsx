import { Button, ButtonIcon } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { SendIcon } from 'lucide-react-native';
import { ComponentRef, Ref, useCallback, useRef } from 'react';
import { LayoutChangeEvent, StyleSheet, TextInput } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { SharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { INPUT_HEIGHT, MARGIN, TEXT_INPUT_HEIGHT } from '../constants';

export const CHAT_INPUT_ID = 'chat-input';

type ChatComposerProps = {
  onSubmit: (text: string) => void;
  extraContentPadding: SharedValue<number>;
};

const ChatComposer = ({ onSubmit, extraContentPadding }: ChatComposerProps) => {
  const { bottom } = useSafeAreaInsets();
  const textInputRef = useRef<TextInput>(null);
  const textRef = useRef('');

  const onSend = useCallback(() => {
    const text = textRef.current.trim();
    if (!text) return;

    onSubmit(text);
    textInputRef.current?.clear();
    textRef.current = '';
  }, [onSubmit]);

  const onInputLayout = (e: LayoutChangeEvent) => {
    extraContentPadding.value = withTiming(
      Math.max(e.nativeEvent.layout.height - INPUT_HEIGHT, 0),
      { duration: 250 },
    );
  };

  return (
    <KeyboardStickyView
      offset={{ opened: bottom - MARGIN }}
      style={styles.composer}>
      <Divider className="border-border" />
      <HStack className="w-full items-end gap-2 bg-card px-2 pt-2">
        <Input
          className="flex-1 h-auto rounded-3xl bg-muted border-input"
          style={styles.input}
          onLayout={onInputLayout}>
          <InputField
            ref={
              textInputRef as unknown as Ref<ComponentRef<typeof InputField>>
            }
            multiline
            nativeID={CHAT_INPUT_ID}
            placeholder="Type a message..."
            className="h-auto max-h-32 py-2 text-muted-foreground"
            onChangeText={(text) => (textRef.current = text)}
          />
        </Input>
        <Button
          size="icon"
          className="rounded-full"
          style={styles.sendButton}
          accessibilityLabel="Send message"
          onPress={onSend}>
          <ButtonIcon as={SendIcon} />
        </Button>
      </HStack>
    </KeyboardStickyView>
  );
};

const styles = StyleSheet.create({
  composer: {
    position: 'absolute',
    width: '100%',
    minHeight: TEXT_INPUT_HEIGHT,
  },
  input: {
    minHeight: INPUT_HEIGHT,
    maxHeight: 128,
  },
  sendButton: {
    height: INPUT_HEIGHT,
    width: INPUT_HEIGHT,
  },
});

export default ChatComposer;
