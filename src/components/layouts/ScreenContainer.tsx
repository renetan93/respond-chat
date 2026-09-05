import { VStack } from '@/components/ui/vstack';

const ScreenContainer = ({ children }: { children: React.ReactNode }) => {
  return <VStack className="p-4">{children}</VStack>;
};

export default ScreenContainer;
