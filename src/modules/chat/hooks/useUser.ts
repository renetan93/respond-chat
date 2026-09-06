import { getUserById } from '@/api/conversations';
import { useQuery } from '@tanstack/react-query';

const useUser = (userId: number) =>
  useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById({ id: userId }),
  });

export default useUser;
