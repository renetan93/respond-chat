import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { VStack } from '@/components/ui/vstack';
import { memo } from 'react';

const SkeletonItem = () => (
  <Box className="p-4">
    <SkeletonText _lines={2} gap={3} className="h-4" />
  </Box>
);

const ProfileSkeleton = () => {
  return (
    <VStack>
      <Center>
        <Skeleton variant="circular" className="h-40 w-40" />

        <Box className="h-4" />

        <Skeleton className="h-8 w-40" />
      </Center>

      <Box className="h-4" />

      <SkeletonItem />

      <Divider />

      <SkeletonItem />

      <Divider />

      <SkeletonItem />

      <Divider />

      <SkeletonItem />

      <Divider />
    </VStack>
  );
};

export default memo(ProfileSkeleton);
