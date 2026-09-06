import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';

type SettingsListItemProps = {
  title: string;
  renderRight?: React.ReactNode;
};

const SettingsListItem = ({ title, renderRight }: SettingsListItemProps) => {
  return (
    <HStack className="items-center">
      <Text size="xl" className="font-medium flex-1">
        {title}
      </Text>
      {renderRight && <Box>{renderRight}</Box>}
    </HStack>
  );
};

export default SettingsListItem;
