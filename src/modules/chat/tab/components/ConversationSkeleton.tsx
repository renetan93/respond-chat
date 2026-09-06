import { HStack } from '@/components/ui/hstack';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { memo } from 'react';

const ConversationSkeleton = () => {
  return (
    <HStack space="xs" className="gap-1 items-center">
      <Skeleton variant="circular" className="h-16 w-16" />
      <SkeletonText _lines={2} gap={4} className="h-4" />
    </HStack>
  );
};

export default memo(ConversationSkeleton);
