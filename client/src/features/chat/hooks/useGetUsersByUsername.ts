import { useInfiniteQuery } from "@tanstack/react-query";
import { getUsersByUsernameServ } from "../services/chat-services";

export function useGetUsersByUsername(username: string) {
  return useInfiniteQuery({
    queryKey: ["usernames", username],
    queryFn: ({ pageParam }: { pageParam: string | null }) =>
      getUsersByUsernameServ(username, { limit: 20, cursor: pageParam }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 5 * 60 * 1000,
    enabled: username.trim().length > 0,
  });
}
