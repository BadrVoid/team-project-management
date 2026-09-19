
import { useQuery } from "@tanstack/react-query";

import {
  usersApi,
  type UserDiscoveryParams,
} from "@/api/apis/users.api";

export function useDiscoverUsers(params: UserDiscoveryParams) {
  return useQuery({
    queryKey: ["users", "discover", params],
    queryFn: () => usersApi.discoverUsers(params),
  });
}
