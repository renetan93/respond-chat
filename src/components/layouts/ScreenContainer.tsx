import { VStack } from '@/components/ui/vstack';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from '../ui/safe-area-view';

interface ScreenContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ScreenContainer = ({ children, className }: ScreenContainerProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <VStack className={`p-4 flex-1 ${className ?? ''}`}>{children}</VStack>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenContainer;
