import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Post } from '@/types/post';
import { format } from 'date-fns';
import { memo } from 'react';

type BubbleMessageProps = {
  post: Post;
};

const BubbleMessage = ({ post }: BubbleMessageProps) => {
  const formattedTime = format(new Date(post.createdAt), 'h:mma');
  return (
    <Card className="w-4/5 p-1 bg-card border border-border">
      <VStack className="p-2 gap-2">
        <Text className="text-md font-normal">{post.title}</Text>
        <Text size="xs" className="self-end">
          {formattedTime}
        </Text>
      </VStack>
    </Card>
  );
};

export default memo(BubbleMessage);
