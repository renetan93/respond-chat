import { forwardRef, memo } from 'react';
import { ScrollViewProps } from 'react-native';
import {
  KeyboardChatScrollView,
  KeyboardChatScrollViewProps,
  type KeyboardChatScrollViewRef,
} from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MARGIN } from '../constants';

const ChatScrollView = forwardRef<
  KeyboardChatScrollViewRef,
  ScrollViewProps & KeyboardChatScrollViewProps
>((props, ref) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <KeyboardChatScrollView
      ref={ref}
      automaticallyAdjustContentInsets={false}
      contentInsetAdjustmentBehavior="never"
      keyboardDismissMode="interactive"
      offset={bottom - MARGIN}
      {...props}
    />
  );
});
ChatScrollView.displayName = 'ChatScrollView';

export default memo(ChatScrollView);
