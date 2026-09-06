import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { memo } from 'react';

const ProfileInfoItem = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) => (
  <Box className="p-4">
    <HStack className="gap-2 items-center">
      <Icon as={icon} size="lg" />
      <Text size="xl" className="font-bold">
        {title}
      </Text>
    </HStack>
    <Text size="lg" className="font-medium">
      {children}
    </Text>
  </Box>
);

export default memo(ProfileInfoItem);
